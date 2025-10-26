import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, waitFor } from '@storybook/test';
import FusionBall from './FusionBall';
import type { FusionBallProps } from './FusionBall';

// Helper to convert hex color and opacity to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  if (!hex) return '';
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Wrapper component to handle opacity controls
const FusionBallWithOpacity = (props: FusionBallProps & {
  colorOpacity?: number;
  secondaryColorOpacity?: number;
  cursorBallColorOpacity?: number;
}) => {
  const {
    color,
    colorOpacity = 1.0,
    secondaryColor,
    secondaryColorOpacity = 1.0,
    cursorBallColor,
    cursorBallColorOpacity = 1.0,
    ...rest
  } = props;

  return (
    <FusionBall
      {...rest}
      color={color ? hexToRgba(color, colorOpacity) : color}
      secondaryColor={secondaryColor ? hexToRgba(secondaryColor, secondaryColorOpacity) : secondaryColor}
      cursorBallColor={cursorBallColor ? hexToRgba(cursorBallColor, cursorBallColorOpacity) : cursorBallColor}
    />
  );
};

const meta = {
  title: 'Components/FusionBall',
  component: FusionBallWithOpacity,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A high-performance WebGL-powered animated fusion ball effect. Features smooth liquid-like fusion when balls get close, mouse/pointer interaction, procedural animation, and extensive customization options. Includes WebGL context loss recovery and graceful fallback for unsupported devices.',
      },
      page: null,
    },
    previewTabs: {
      'storybook/docs/panel': { index: -1 },
    },
    viewMode: 'docs',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const invertColors = context.args.invertColors;
      return (
        <div style={{
          width: '100%',
          height: '600px',
          background: invertColors
            ? 'url(https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80) center/cover'
            : '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Story />
        </div>
      );
    },
  ],
  argTypes: {
    // Colors
    color: {
      control: 'color',
      description: 'Primary color (supports hex with alpha: #RRGGBBAA or rgba)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#ffffff' },
        category: '🎨 Colors',
      },
    },
    colorOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Primary color opacity',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1.0' },
        category: '🎨 Colors',
      },
    },
    secondaryColor: {
      control: 'color',
      description: 'Secondary color (empty = disabled)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: '🎨 Colors',
      },
    },
    secondaryColorOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Secondary color opacity',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1.0' },
        category: '🎨 Colors',
      },
      if: { arg: 'secondaryColor' },
    },
    cursorBallColor: {
      control: 'color',
      description: 'Cursor ball color (empty = disabled)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: '🎨 Colors',
      },
    },
    cursorBallColorOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Cursor ball color opacity',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1.0' },
        category: '🎨 Colors',
      },
      if: { arg: 'cursorBallColor' },
    },

    // Visual Effects
    invertColors: {
      control: 'boolean',
      description: 'Invert colors (on/off)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '✨ Effects',
      },
    },
    enablePixelation: {
      control: 'boolean',
      description: 'Enable pixelation effect',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '✨ Effects',
      },
    },
    pixelSize: {
      control: { type: 'range', min: 2, max: 20, step: 2 },
      description: 'Pixel size (even numbers only)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '6' },
        category: '✨ Effects',
      },
      if: { arg: 'enablePixelation', truthy: true },
    },

    // Ball Configuration
    ballCount: {
      control: { type: 'number', min: 5, max: 50, step: 1 },
      description: 'Number of balls',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '15' },
        category: '⚫ Balls',
      },
    },
    ballSize: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.1 },
      description: 'Ball size',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1.5' },
        category: '⚫ Balls',
      },
    },
    clumpFactor: {
      control: { type: 'number', min: 0.5, max: 2, step: 0.1 },
      description: 'Clustering',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
        category: '⚫ Balls',
      },
    },

    // Animation
    speed: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Animation speed',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0.3' },
        category: '⚡ Animation',
      },
    },
    animationSize: {
      control: { type: 'number', min: 10, max: 100, step: 5 },
      description: 'Animation scale',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '30' },
        category: '⚡ Animation',
      },
    },

    // Mouse Interaction
    enableMouseInteraction: {
      control: 'boolean',
      description: 'Enable interaction',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: '🖱️ Mouse',
      },
    },
    cursorBallSize: {
      control: { type: 'range', min: 1, max: 10, step: 0.5 },
      description: 'Cursor ball size',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
        category: '🖱️ Mouse',
      },
      if: { arg: 'enableMouseInteraction', truthy: true },
    },
    hoverSmoothness: {
      control: { type: 'range', min: 0.01, max: 0.2, step: 0.01 },
      description: 'Cursor smoothness',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0.05' },
        category: '🖱️ Mouse',
      },
      if: { arg: 'enableMouseInteraction', truthy: true },
    },

    // Dimensions
    width: {
      control: 'text',
      description: 'Canvas width in px (empty = auto)',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: 'undefined' },
        category: '📐 Dimensions',
      },
    },
    height: {
      control: 'text',
      description: 'Canvas height in px (empty = auto)',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: 'undefined' },
        category: '📐 Dimensions',
      },
    },

    // Advanced
    className: {
      control: 'text',
      description: 'CSS class',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: '⚙️ Advanced',
      },
    },
  },
} satisfies Meta<typeof FusionBallWithOpacity>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default fusion ball animation
 */
export const Default: Story = {
  args: {
    color: '#ffffff',
    colorOpacity: 1.0,
    secondaryColor: '',
    secondaryColorOpacity: 1.0,
    cursorBallColor: '',
    cursorBallColorOpacity: 1.0,
    speed: 0.3,
    enableMouseInteraction: true,
    hoverSmoothness: 0.05,
    animationSize: 30,
    ballCount: 15,
    ballSize: 1.5,
    clumpFactor: 1,
    cursorBallSize: 3,
    invertColors: false,
    enablePixelation: false,
    pixelSize: 6,
    className: '',
    width: undefined,
    height: undefined,
  },
  play: async ({ canvasElement }) => {
    // Wait for canvas element to be created
    await waitFor(() => {
      const canvasEl = canvasElement.querySelector('canvas');
      expect(canvasEl).toBeInTheDocument();
      expect(canvasEl).toBeInstanceOf(HTMLCanvasElement);
    });

    // Verify container has correct class (CSS modules use camelCase)
    const container = canvasElement.querySelector('[class*="fusionballContainer"]');
    expect(container).toBeInTheDocument();
  },
};

/**
 * With secondary color gradient
 */
export const WithSecondaryColor: Story = {
  args: {
    ...Default.args,
    color: '#ff0000',
    secondaryColor: '#0000ff',
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const canvasEl = canvasElement.querySelector('canvas');
      expect(canvasEl).toBeInTheDocument();
    });
  },
};

/**
 * Pixelated effect
 */
export const Pixelated: Story = {
  args: {
    ...Default.args,
    enablePixelation: true,
    pixelSize: 8,
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const canvasEl = canvasElement.querySelector('canvas');
      expect(canvasEl).toBeInTheDocument();
    });
  },
};

/**
 * Inverted colors
 */
export const InvertedColors: Story = {
  args: {
    ...Default.args,
    color: '#ffffff',
    colorOpacity: 1.0,
    invertColors: true,
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const canvasEl = canvasElement.querySelector('canvas');
      expect(canvasEl).toBeInTheDocument();
    });
  },
};

/**
 * Custom ball count and size
 */
export const CustomBalls: Story = {
  args: {
    ...Default.args,
    ballCount: 30,
    ballSize: 2.5,
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const canvasEl = canvasElement.querySelector('canvas');
      expect(canvasEl).toBeInTheDocument();
    });
  },
};

/**
 * Without mouse interaction
 */
export const NoMouseInteraction: Story = {
  args: {
    ...Default.args,
    enableMouseInteraction: false,
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const canvasEl = canvasElement.querySelector('canvas');
      expect(canvasEl).toBeInTheDocument();
    });
  },
};

/**
 * Performance showcase - many balls with fast animation
 */
export const PerformanceTest: Story = {
  args: {
    ...Default.args,
    ballCount: 40,
    ballSize: 2,
    speed: 1.5,
    color: '#00ffff',
    secondaryColor: '#ff00ff',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Stress test with 40 balls, larger size, and faster animation. Tests WebGL performance optimization.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const canvasEl = canvasElement.querySelector('canvas');
      expect(canvasEl).toBeInTheDocument();
    });
  },
};

/**
 * RGB color showcase
 */
export const RGBShowcase: Story = {
  args: {
    ...Default.args,
    color: '#ff0000',
    secondaryColor: '#00ff00',
    cursorBallColor: '#0000ff',
    ballCount: 20,
    ballSize: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary (red), secondary (green), and cursor (blue) colors working together.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const canvasEl = canvasElement.querySelector('canvas');
      expect(canvasEl).toBeInTheDocument();
    });
  },
};

/**
 * Minimal setup - few balls, slow animation
 */
export const Minimal: Story = {
  args: {
    ...Default.args,
    ballCount: 5,
    ballSize: 1,
    speed: 0.1,
    clumpFactor: 0.5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal configuration with few balls and slow, meditative animation.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      const canvasEl = canvasElement.querySelector('canvas');
      expect(canvasEl).toBeInTheDocument();
    });
  },
};

