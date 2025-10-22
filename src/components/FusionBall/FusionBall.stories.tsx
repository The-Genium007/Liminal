import type { Meta, StoryObj } from '@storybook/react';
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
  title: 'FusionBall',
  component: FusionBallWithOpacity,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'An animated fusion ball effect using WebGL. Balls move around and create a liquid fusion effect when they get close to each other. Features mouse interaction.',
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
    (Story) => (
      <div style={{
        width: '100%',
        height: '600px',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Story />
      </div>
    ),
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
      description: 'Invert colors (negative effect)',
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
};

