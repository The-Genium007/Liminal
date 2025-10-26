import type { Meta, StoryObj } from '@storybook/react';
import { AccordionSlider } from './AccordionSlider';

const meta: Meta<typeof AccordionSlider> = {
  title: 'Components/AccordionSlider',
  component: AccordionSlider,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#07090d' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-visible',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: false, // Disabled as this is a component demo
          },
        ],
      },
    },
    docs: {
      description: {
        component:
          'An interactive, accessible accordion slider that expands cards on hover or click. Features smooth animations, autoplay mode, keyboard navigation, screen reader support, and responsive design. WCAG 2.2 compliant.',
      },
    },
  },
  argTypes: {
    // Content
    items: {
      description: 'Array of slide items to display',
      table: {
        type: { summary: 'SlideItem[]' },
        category: '📦 Content',
      },
      control: { disable: true },
    },
    slideCount: {
      control: { type: 'number', min: 0, max: 20 },
      description: 'Number of slides (0 = use all items, will duplicate if needed)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '5' },
        category: '📦 Content',
      },
    },

    // Appearance
    borderRadius: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Border radius for cards in rem',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
        category: '🎨 Appearance',
      },
    },
    grayscaleInactive: {
      control: { type: 'boolean' },
      description: 'Apply grayscale filter to inactive cards',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '🎨 Appearance',
      },
    },
    backgroundBlur: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description: 'Background image blur intensity in pixels',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
        category: '🎨 Appearance',
      },
    },

    // Dimensions
    height: {
      control: { type: 'text' },
      description: 'Global height for cards (e.g., "26rem", "400px", "auto")',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
        category: '📐 Dimensions',
      },
    },
    width: {
      control: { type: 'text' },
      description: 'Global width for the slider container',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
        category: '📐 Dimensions',
      },
    },

    // Animation
    animationSpeed: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Animation speed multiplier (affects all transitions)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
        category: '⚡ Animation',
      },
    },

    // Autoplay
    autoplay: {
      control: { type: 'boolean' },
      description: 'Enable automatic carousel mode',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: '▶️ Autoplay',
      },
    },
    autoplayInterval: {
      control: { type: 'range', min: 1000, max: 10000, step: 500 },
      description: 'Time between slide transitions (ms)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '3000' },
        category: '▶️ Autoplay',
      },
      if: { arg: 'autoplay', truthy: true },
    },
    autoplayResumeDelay: {
      control: { type: 'range', min: 500, max: 5000, step: 500 },
      description: 'Delay before resuming autoplay after hover (ms)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '2000' },
        category: '▶️ Autoplay',
      },
      if: { arg: 'autoplay', truthy: true },
    },

    // Advanced
    className: {
      control: { type: 'text' },
      description: 'Optional CSS class name',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: '⚙️ Advanced',
      },
    },
    onSlideChange: {
      action: 'slide-changed',
      description: 'Callback fired when the active slide changes',
      table: {
        type: { summary: '(index: number) => void' },
        category: '⚙️ Advanced',
      },
      control: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccordionSlider>;

// Default data
const defaultItems = [
  {
    id: 'designers',
    title: 'Designers',
    description: 'Tools that work like you do.',
    backgroundImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=480&q=80',
    onDetailsClick: () => console.log('Designers details clicked'),
  },
  {
    id: 'marketers',
    title: 'Marketers',
    description: 'Create faster, explore new possibilities.',
    backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&q=80',
    onDetailsClick: () => console.log('Marketers details clicked'),
  },
  {
    id: 'filmmakers',
    title: 'VFX filmmakers',
    description: 'From concept to cut, faster.',
    backgroundImage: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=480&q=80',
    onDetailsClick: () => console.log('VFX filmmakers details clicked'),
  },
  {
    id: 'content-creators',
    title: 'Content creators',
    description: 'Make scroll-stopping content, easily.',
    backgroundImage: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1200&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=480&q=80',
    onDetailsClick: () => console.log('Content creators details clicked'),
  },
  {
    id: 'art-directors',
    title: 'Art directors',
    description: 'Creative control at every stage.',
    backgroundImage: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1200&q=80',
    thumbnailImage: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=480&q=80',
    onDetailsClick: () => console.log('Art directors details clicked'),
  },
];

/**
 * Default accordion slider with 5 slides
 */
export const Default: Story = {
  args: {
    items: defaultItems,
    slideCount: 5,
    borderRadius: 0,
    grayscaleInactive: false,
    backgroundBlur: 0,
    height: 'auto',
    width: 'auto',
    animationSpeed: 1,
    autoplay: false,
    autoplayInterval: 3000,
    autoplayResumeDelay: 2000,
    className: '',
  },
};

/**
 * With rounded corners
 */
export const Rounded: Story = {
  args: {
    ...Default.args,
    borderRadius: 1,
  },
};

/**
 * Extra rounded corners
 */
export const ExtraRounded: Story = {
  args: {
    ...Default.args,
    borderRadius: 2.5,
  },
};

/**
 * Grayscale inactive cards
 */
export const GrayscaleInactive: Story = {
  args: {
    ...Default.args,
    grayscaleInactive: true,
  },
};

/**
 * With background blur on active card
 */
export const WithBlur: Story = {
  args: {
    ...Default.args,
    backgroundBlur: 10,
  },
};

/**
 * Faster animations
 */
export const FastAnimations: Story = {
  args: {
    ...Default.args,
    animationSpeed: 2,
  },
};

/**
 * Slower animations
 */
export const SlowAnimations: Story = {
  args: {
    ...Default.args,
    animationSpeed: 0.5,
  },
};

/**
 * With autoplay enabled
 */
export const Autoplay: Story = {
  args: {
    ...Default.args,
    autoplay: true,
    autoplayInterval: 3000,
  },
};

/**
 * Fast autoplay
 */
export const FastAutoplay: Story = {
  args: {
    ...Default.args,
    autoplay: true,
    autoplayInterval: 1500,
  },
};

/**
 * Only 3 slides
 */
export const ThreeSlides: Story = {
  args: {
    ...Default.args,
    slideCount: 3,
  },
};

/**
 * Many slides (10 total, will duplicate items)
 */
export const ManySlides: Story = {
  args: {
    ...Default.args,
    slideCount: 10,
  },
};

/**
 * Use all items from the array
 */
export const AllSlides: Story = {
  args: {
    ...Default.args,
    slideCount: 0,
  },
};

/**
 * Custom items example
 */
export const CustomItems: Story = {
  args: {
    ...Default.args,
    items: [
      {
        id: 'web-dev',
        title: 'Web Developers',
        description: 'Build modern, responsive websites with cutting-edge tools.',
        backgroundImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
      },
      {
        id: 'data-science',
        title: 'Data Scientists',
        description: 'Transform data into actionable insights.',
        backgroundImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400',
      },
      {
        id: 'ui-ux',
        title: 'UI/UX Designers',
        description: 'Craft beautiful, intuitive user experiences.',
        backgroundImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        thumbnailImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400',
      },
    ],
    slideCount: 3,
  },
};

/**
 * With callbacks
 */
export const WithCallbacks: Story = {
  args: {
    ...Default.args,
    items: defaultItems.map((item) => ({
      ...item,
      onDetailsClick: () => alert(`Details clicked for: ${item.title}`),
    })),
    onSlideChange: (index: number) => {
      console.log(`Active slide changed to index: ${index}`);
    },
  },
};

/**
 * Complete showcase with all features
 */
export const CompleteShowcase: Story = {
  args: {
    ...Default.args,
    borderRadius: 1.5,
    grayscaleInactive: true,
    backgroundBlur: 8,
    animationSpeed: 1.2,
    autoplay: true,
    autoplayInterval: 4000,
  },
};

/**
 * Accessibility features demonstration
 */
export const AccessibilityDemo: Story = {
  args: {
    ...Default.args,
    borderRadius: 1,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates accessibility features:\n\n' +
          '- **Keyboard Navigation**: Use arrow keys to navigate between slides (component must be focused)\n' +
          '- **Screen Reader Support**: Live region announces slide changes\n' +
          '- **Focus Management**: Clear focus indicators for keyboard users\n' +
          '- **ARIA Attributes**: Proper roles, labels, and states for assistive technologies\n' +
          '- **Reduced Motion**: Respects prefers-reduced-motion preference\n' +
          '\nTo test keyboard navigation, click on the slider first to focus it, then use arrow keys.',
      },
    },
  },
};

/**
 * Error handling demonstration (with intentionally broken images)
 */
export const WithErrorHandling: Story = {
  args: {
    ...Default.args,
    items: [
      {
        id: 'broken-1',
        title: 'Broken Image Example',
        description: 'This slide has intentionally broken image URLs to demonstrate error handling.',
        backgroundImage: 'https://example.com/nonexistent-image-1.jpg',
        thumbnailImage: 'https://example.com/nonexistent-image-2.jpg',
      },
      {
        id: 'working-1',
        title: 'Working Image',
        description: 'This slide has a working image.',
        backgroundImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
        thumbnailImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=480&q=80',
      },
      {
        id: 'broken-2',
        title: 'Another Broken Example',
        description: 'Both images will fail to load and show placeholders.',
        backgroundImage: 'https://example.com/broken-bg.jpg',
        thumbnailImage: 'https://example.com/broken-thumb.jpg',
      },
    ],
    slideCount: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates robust error handling for broken images. The component gracefully displays placeholder elements when images fail to load.',
      },
    },
  },
};
