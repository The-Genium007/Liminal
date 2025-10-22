import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Transform, Vec3, Camera } from 'ogl';
import './FusionBall.css';

export type FusionBallProps = {
  color?: string;
  secondaryColor?: string;
  speed?: number;
  enableMouseInteraction?: boolean;
  hoverSmoothness?: number;
  animationSize?: number;
  ballCount?: number;
  ballSize?: number;
  clumpFactor?: number;
  cursorBallSize?: number;
  cursorBallColor?: string;
  invertColors?: boolean;
  enablePixelation?: boolean;
  pixelSize?: number;
  className?: string;
  width?: number;
  height?: number;
};

function parseColor(color: string): [number, number, number, number] {
  // Support hex format: #RRGGBB or #RRGGBBAA
  if (color.startsWith('#')) {
    const c = color.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;
    const a = c.length === 8 ? parseInt(c.substring(6, 8), 16) / 255 : 1.0;
    return [r, g, b, a];
  }

  // Support rgba format: rgba(r, g, b, a)
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]) / 255;
    const g = parseInt(rgbaMatch[2]) / 255;
    const b = parseInt(rgbaMatch[3]) / 255;
    const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1.0;
    return [r, g, b, a];
  }

  // Fallback to white
  return [1, 1, 1, 1];
}

function fract(x: number): number {
  return x - Math.floor(x);
}

function hash31(p: number): number[] {
  let r = [p * 0.1031, p * 0.103, p * 0.0973].map(fract);
  const r_yzx = [r[1], r[2], r[0]];
  const dotVal = r[0] * (r_yzx[0] + 33.33) + r[1] * (r_yzx[1] + 33.33) + r[2] * (r_yzx[2] + 33.33);
  for (let i = 0; i < 3; i++) {
    r[i] = fract(r[i] + dotVal);
  }
  return r;
}

function hash33(v: number[]): number[] {
  let p = [v[0] * 0.1031, v[1] * 0.103, v[2] * 0.0973].map(fract);
  const p_yxz = [p[1], p[0], p[2]];
  const dotVal = p[0] * (p_yxz[0] + 33.33) + p[1] * (p_yxz[1] + 33.33) + p[2] * (p_yxz[2] + 33.33);
  for (let i = 0; i < 3; i++) {
    p[i] = fract(p[i] + dotVal);
  }
  const p_xxy = [p[0], p[0], p[1]];
  const p_yxx = [p[1], p[0], p[0]];
  const p_zyx = [p[2], p[1], p[0]];
  const result: number[] = [];
  for (let i = 0; i < 3; i++) {
    result[i] = fract((p_xxy[i] + p_yxx[i]) * p_zyx[i]);
  }
  return result;
}

const vertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform vec4 iColor;
uniform vec4 iSecondaryColor;
uniform vec4 iCursorColor;
uniform float iAnimationSize;
uniform int iBallCount;
uniform float iCursorBallSize;
uniform vec3 iFusionBalls[50];
uniform float iClumpFactor;
uniform bool invertColors;
uniform bool enablePixelation;
uniform float pixelSize;
out vec4 outColor;
const float PI = 3.14159265359;

float getFusionBallValue(vec2 c, float r, vec2 p) {
    vec2 d = p - c;
    float dist2 = dot(d, d);
    return (r * r) / dist2;
}

void main() {
    vec2 fc = gl_FragCoord.xy;

    float scale = iAnimationSize / (iResolution.y * 0.8);
    vec2 coord = (fc - iResolution.xy * 0.5) * scale;

    // Apply pixelation effect if enabled
    if (enablePixelation) {
        coord = floor(coord * (1.0 / scale) / pixelSize) * pixelSize * scale;
    }

    vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale;
    float m1 = 0.0;
    for (int i = 0; i < 50; i++) {
        if (i >= iBallCount) break;
        m1 += getFusionBallValue(iFusionBalls[i].xy, iFusionBalls[i].z, coord);
    }
    float m2 = getFusionBallValue(mouseW, iCursorBallSize, coord);
    float total = m1 + m2;

    float threshold = 1.3;
    float f = smoothstep(-1.0, 1.0, (total - threshold) / min(1.0, fwidth(total)));

    vec4 cFinal = vec4(0.0);
    if (total > 0.0) {
        float alpha1 = m1 / total;
        float alpha2 = m2 / total;
        // Mix primary, secondary and cursor colors with their alpha channels
        vec4 mainColor = mix(iColor, iSecondaryColor, alpha1 * 0.5);
        cFinal = mainColor * alpha1 + iCursorColor * alpha2;
    }
    // Apply color inversion if enabled
    vec3 finalColor = invertColors ? (vec3(1.0) - cFinal.rgb) : cFinal.rgb;
    outColor = vec4(finalColor * f, cFinal.a * f);
}
`;

type BallParams = {
  st: number;
  dtFactor: number;
  baseScale: number;
  toggle: number;
  radius: number;
};

const FusionBall: React.FC<FusionBallProps> = ({
  color = '#ffffff',
  secondaryColor = '',
  speed = 0.3,
  enableMouseInteraction = true,
  hoverSmoothness = 0.05,
  animationSize = 30,
  ballCount = 15,
  ballSize = 1.5,
  clumpFactor = 1,
  cursorBallSize = 3,
  cursorBallColor = '',
  invertColors = false,
  enablePixelation = false,
  pixelSize = 6,
  className = '',
  width,
  height
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dpr = 1;
    const renderer = new Renderer({
      dpr,
      alpha: true,
      premultipliedAlpha: false
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      near: 0.1,
      far: 10
    });
    camera.position.z = 1;

    const geometry = new Triangle(gl);
    const [r1, g1, b1, a1] = parseColor(color);

    // Use color as fallback if secondaryColor is empty
    const effectiveSecondaryColor = secondaryColor || color;
    const [r2, g2, b2, a2] = parseColor(effectiveSecondaryColor);

    // Use color as fallback if cursorBallColor is empty
    const effectiveCursorColor = cursorBallColor || color;
    const [r3, g3, b3, a3] = parseColor(effectiveCursorColor);

    const fusionBallsUniform: Vec3[] = [];
    for (let i = 0; i < 50; i++) {
      fusionBallsUniform.push(new Vec3(0, 0, 0));
    }

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(0, 0, 0) },
        iMouse: { value: new Vec3(0, 0, 0) },
        iColor: { value: [r1, g1, b1, a1] },
        iSecondaryColor: { value: [r2, g2, b2, a2] },
        iCursorColor: { value: [r3, g3, b3, a3] },
        iAnimationSize: { value: animationSize },
        iBallCount: { value: ballCount },
        iCursorBallSize: { value: cursorBallSize },
        iFusionBalls: { value: fusionBallsUniform },
        iClumpFactor: { value: clumpFactor },
        invertColors: { value: invertColors },
        enablePixelation: { value: enablePixelation },
        pixelSize: { value: pixelSize }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    const scene = new Transform();
    mesh.setParent(scene);

    const maxBalls = 50;
    const effectiveBallCount = Math.min(ballCount, maxBalls);
    const ballParams: BallParams[] = [];
    for (let i = 0; i < effectiveBallCount; i++) {
      const idx = i + 1;
      const h1 = hash31(idx);
      const st = h1[0] * (2 * Math.PI);
      const dtFactor = 0.1 * Math.PI + h1[1] * (0.4 * Math.PI - 0.1 * Math.PI);
      const baseScale = 5.0 + h1[1] * (10.0 - 5.0);
      const h2 = hash33(h1);
      const toggle = Math.floor(h2[0] * 2.0);
      const radiusVal = (0.5 + h2[2] * (2.0 - 0.5)) * ballSize;
      ballParams.push({ st, dtFactor, baseScale, toggle, radius: radiusVal });
    }

    const mouseBallPos = { x: 0, y: 0 };
    let pointerInside = false;
    let pointerX = 0;
    let pointerY = 0;

    function resize() {
      if (!container) return;
      const canvasWidth = width || container.clientWidth;
      const canvasHeight = height || container.clientHeight;
      renderer.setSize(canvasWidth * dpr, canvasHeight * dpr);
      gl.canvas.style.width = `${canvasWidth}px`;
      gl.canvas.style.height = `${canvasHeight}px`;
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    function onPointerMove(e: PointerEvent) {
      if (!enableMouseInteraction || !container) return;
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      pointerX = (px / rect.width) * gl.canvas.width;
      pointerY = (1 - py / rect.height) * gl.canvas.height;
    }
    function onPointerEnter() {
      if (!enableMouseInteraction) return;
      pointerInside = true;
    }
    function onPointerLeave() {
      if (!enableMouseInteraction) return;
      pointerInside = false;
    }
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerenter', onPointerEnter);
    container.addEventListener('pointerleave', onPointerLeave);

    const startTime = performance.now();
    let animationFrameId: number;
    function update(t: number) {
      animationFrameId = requestAnimationFrame(update);
      const elapsed = (t - startTime) * 0.001;
      program.uniforms.iTime.value = elapsed;

      for (let i = 0; i < effectiveBallCount; i++) {
        const p = ballParams[i];
        const dt = elapsed * speed * p.dtFactor;
        const th = p.st + dt;
        const x = Math.cos(th);
        const y = Math.sin(th + dt * p.toggle);
        const posX = x * p.baseScale * clumpFactor;
        const posY = y * p.baseScale * clumpFactor;
        fusionBallsUniform[i].set(posX, posY, p.radius);
      }

      let targetX: number, targetY: number;
      if (pointerInside) {
        targetX = pointerX;
        targetY = pointerY;
      } else {
        const cx = gl.canvas.width * 0.5;
        const cy = gl.canvas.height * 0.5;
        const rx = gl.canvas.width * 0.15;
        const ry = gl.canvas.height * 0.15;
        targetX = cx + Math.cos(elapsed * speed) * rx;
        targetY = cy + Math.sin(elapsed * speed) * ry;
      }
      mouseBallPos.x += (targetX - mouseBallPos.x) * hoverSmoothness;
      mouseBallPos.y += (targetY - mouseBallPos.y) * hoverSmoothness;
      program.uniforms.iMouse.value.set(mouseBallPos.x, mouseBallPos.y, 0);

      renderer.render({ scene, camera });
    }
    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    color,
    secondaryColor,
    cursorBallColor,
    speed,
    enableMouseInteraction,
    hoverSmoothness,
    animationSize,
    ballCount,
    ballSize,
    clumpFactor,
    cursorBallSize,
    invertColors,
    enablePixelation,
    pixelSize,
    width,
    height
  ]);

  const containerStyle: React.CSSProperties = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : '100%',
  };

  return <div ref={containerRef} className={`fusionball-container ${className}`} style={containerStyle} />;
};

export default FusionBall;
