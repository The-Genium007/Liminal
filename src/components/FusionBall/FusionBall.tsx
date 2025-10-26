import React, { useEffect, useRef, useMemo } from 'react';
import { Renderer, Program, Mesh, Triangle, Transform, Vec3, Camera } from 'ogl';
import styles from './FusionBall.module.scss';

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
  invertIntensity?: number;
  enablePixelation?: boolean;
  pixelSize?: number;
  className?: string;
  width?: number;
  height?: number;
};

// ============================================================================
// Color Parsing Utilities
// ============================================================================

const HEX_REGEX = /^#([0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGBA_REGEX = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/;
const COLOR_SCALE = 1 / 255;

function parseColor(color: string): [number, number, number, number] {
  // Support hex format: #RRGGBB or #RRGGBBAA
  if (color.startsWith('#')) {
    const match = color.match(HEX_REGEX);
    if (match) {
      const hex = match[1];
      const r = parseInt(hex.substring(0, 2), 16) * COLOR_SCALE;
      const g = parseInt(hex.substring(2, 4), 16) * COLOR_SCALE;
      const b = parseInt(hex.substring(4, 6), 16) * COLOR_SCALE;
      const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) * COLOR_SCALE : 1.0;
      return [r, g, b, a];
    }
  }

  // Support rgba format: rgba(r, g, b, a)
  const rgbaMatch = color.match(RGBA_REGEX);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10) * COLOR_SCALE;
    const g = parseInt(rgbaMatch[2], 10) * COLOR_SCALE;
    const b = parseInt(rgbaMatch[3], 10) * COLOR_SCALE;
    const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1.0;
    return [r, g, b, a];
  }

  // Fallback to white
  return [1, 1, 1, 1];
}

// ============================================================================
// Hash Functions for Procedural Generation
// ============================================================================

const HASH_CONSTANT = 33.33;

function fract(x: number): number {
  return x - Math.floor(x);
}

function hash31(p: number): number[] {
  const r = [p * 0.1031, p * 0.103, p * 0.0973].map(fract);
  const r_yzx = [r[1], r[2], r[0]];
  const dotVal = r[0] * (r_yzx[0] + HASH_CONSTANT) +
                 r[1] * (r_yzx[1] + HASH_CONSTANT) +
                 r[2] * (r_yzx[2] + HASH_CONSTANT);

  return r.map(val => fract(val + dotVal));
}

function hash33(v: number[]): number[] {
  const p = [v[0] * 0.1031, v[1] * 0.103, v[2] * 0.0973].map(fract);
  const p_yxz = [p[1], p[0], p[2]];
  const dotVal = p[0] * (p_yxz[0] + HASH_CONSTANT) +
                 p[1] * (p_yxz[1] + HASH_CONSTANT) +
                 p[2] * (p_yxz[2] + HASH_CONSTANT);

  const p_processed = p.map(val => fract(val + dotVal));
  const p_xxy = [p_processed[0], p_processed[0], p_processed[1]];
  const p_yxx = [p_processed[1], p_processed[0], p_processed[0]];
  const p_zyx = [p_processed[2], p_processed[1], p_processed[0]];

  return p_xxy.map((val, i) => fract((val + p_yxx[i]) * p_zyx[i]));
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

    // The inversion is handled by CSS mix-blend-mode: difference
    // Just output the color normally
    outColor = vec4(cFinal.rgb * f, cFinal.a * f);
}
`;

// ============================================================================
// Type Definitions
// ============================================================================

type BallParams = {
  st: number;
  dtFactor: number;
  baseScale: number;
  toggle: number;
  radius: number;
};

// ============================================================================
// Constants
// ============================================================================

const DPR = 1;
const MAX_BALLS = 50;
const TWO_PI = 2 * Math.PI;

// Ball generation constants
const BALL_GEN = {
  DT_MIN: 0.1 * Math.PI,
  DT_MAX: 0.4 * Math.PI,
  BASE_SCALE_MIN: 5.0,
  BASE_SCALE_MAX: 10.0,
  RADIUS_MIN: 0.5,
  RADIUS_MAX: 2.0,
} as const;

// ============================================================================
// FusionBall Component
// ============================================================================

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

  // Memoize parsed colors to avoid re-parsing on every render
  const parsedColors = useMemo(() => {
    const [r1, g1, b1, a1] = parseColor(color);
    const effectiveSecondaryColor = secondaryColor || color;
    const [r2, g2, b2, a2] = parseColor(effectiveSecondaryColor);
    const effectiveCursorColor = cursorBallColor || color;
    const [r3, g3, b3, a3] = parseColor(effectiveCursorColor);

    return {
      primary: [r1, g1, b1, a1] as [number, number, number, number],
      secondary: [r2, g2, b2, a2] as [number, number, number, number],
      cursor: [r3, g3, b3, a3] as [number, number, number, number],
    };
  }, [color, secondaryColor, cursorBallColor]);

  // Memoize ball parameters generation
  const ballParams = useMemo(() => {
    const effectiveBallCount = Math.min(ballCount, MAX_BALLS);
    const params: BallParams[] = [];

    for (let i = 0; i < effectiveBallCount; i++) {
      const idx = i + 1;
      const h1 = hash31(idx);
      const st = h1[0] * TWO_PI;
      const dtFactor = BALL_GEN.DT_MIN + h1[1] * (BALL_GEN.DT_MAX - BALL_GEN.DT_MIN);
      const baseScale = BALL_GEN.BASE_SCALE_MIN + h1[1] * (BALL_GEN.BASE_SCALE_MAX - BALL_GEN.BASE_SCALE_MIN);
      const h2 = hash33(h1);
      const toggle = Math.floor(h2[0] * 2.0);
      const radiusVal = (BALL_GEN.RADIUS_MIN + h2[2] * (BALL_GEN.RADIUS_MAX - BALL_GEN.RADIUS_MIN)) * ballSize;

      params.push({ st, dtFactor, baseScale, toggle, radius: radiusVal });
    }

    return params;
  }, [ballCount, ballSize]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize WebGL renderer with optimized settings
    const renderer = new Renderer({
      dpr: DPR,
      alpha: true,
      premultipliedAlpha: false
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    // Setup orthographic camera
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

    // Pre-allocate fusion balls array
    const fusionBallsUniform = Array.from(
      { length: MAX_BALLS },
      () => new Vec3(0, 0, 0)
    );

    // Create shader program with uniforms
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(0, 0, 0) },
        iMouse: { value: new Vec3(0, 0, 0) },
        iColor: { value: parsedColors.primary },
        iSecondaryColor: { value: parsedColors.secondary },
        iCursorColor: { value: parsedColors.cursor },
        iAnimationSize: { value: animationSize },
        iBallCount: { value: ballCount },
        iCursorBallSize: { value: cursorBallSize },
        iFusionBalls: { value: fusionBallsUniform },
        iClumpFactor: { value: clumpFactor },
        enablePixelation: { value: enablePixelation },
        pixelSize: { value: pixelSize }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    const scene = new Transform();
    mesh.setParent(scene);

    // Mouse tracking state
    const mouseBallPos = { x: 0, y: 0 };
    let pointerInside = false;
    let pointerX = 0;
    let pointerY = 0;

    // Resize handler
    const resize = () => {
      if (!container) return;
      const canvasWidth = width || container.clientWidth;
      const canvasHeight = height || container.clientHeight;
      renderer.setSize(canvasWidth * DPR, canvasHeight * DPR);
      gl.canvas.style.width = `${canvasWidth}px`;
      gl.canvas.style.height = `${canvasHeight}px`;
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 0);
    };
    window.addEventListener('resize', resize);
    resize();

    // Pointer event handlers
    const onPointerMove = (e: PointerEvent) => {
      if (!enableMouseInteraction || !container) return;
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      pointerX = (px / rect.width) * gl.canvas.width;
      pointerY = (1 - py / rect.height) * gl.canvas.height;
    };

    const onPointerEnter = () => {
      if (!enableMouseInteraction) return;
      pointerInside = true;
    };

    const onPointerLeave = () => {
      if (!enableMouseInteraction) return;
      pointerInside = false;
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerenter', onPointerEnter);
    container.addEventListener('pointerleave', onPointerLeave);

    // Animation loop
    const startTime = performance.now();
    const effectiveBallCount = ballParams.length;
    let animationFrameId: number;

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      const elapsed = (t - startTime) * 0.001;
      program.uniforms.iTime.value = elapsed;

      // Update ball positions
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

      // Update mouse ball position
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
    };

    animationFrameId = requestAnimationFrame(update);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointerleave', onPointerLeave);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    parsedColors,
    ballParams,
    speed,
    enableMouseInteraction,
    hoverSmoothness,
    animationSize,
    ballCount,
    clumpFactor,
    cursorBallSize,
    enablePixelation,
    pixelSize,
    width,
    height
  ]);

  // Apply CSS blend mode for color inversion
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.style.mixBlendMode = invertColors ? 'difference' : '';
    }
  }, [invertColors]);

  // Memoize container style
  const containerStyle = useMemo<React.CSSProperties>(() => ({
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : '100%',
  }), [width, height]);

  // Combine class names
  const containerClassName = useMemo(() =>
    className ? `${styles.fusionballContainer} ${className}` : styles.fusionballContainer,
    [className]
  );

  return <div ref={containerRef} className={containerClassName} style={containerStyle} />;
};

export default FusionBall;
