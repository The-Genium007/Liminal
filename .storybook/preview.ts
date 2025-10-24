import type { Preview } from "@storybook/react";
import liminalTheme from './LiminalTheme';

// Apply theme globally via console log to verify it loads
console.log('Liminal Theme loaded:', liminalTheme);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true, // Expand controls panel by default
    },
    docs: {
      toc: true, // Enable table of contents in docs
      theme: liminalTheme, // Apply Liminal theme to docs
    },
    options: {
      storySort: {
        method: 'alphabetical',
      },
      title: 'Liminal UI Library',
    },
    backgrounds: {
      default: 'ivoire',
      values: [
        { name: 'ivoire', value: '#E9E4DA' }, // Ivoire pâle
        { name: 'white', value: '#ffffff' },
        { name: 'concrete', value: '#B7B6B2' }, // Gris béton clair
        { name: 'graphite', value: '#4F4652' }, // Violet graphite
        { name: 'steel', value: '#8C969D' }, // Bleu acier
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1920px', height: '1080px' },
        },
      },
    },
  },
};

export default preview;
