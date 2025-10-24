import { create } from 'storybook/internal/theming';

export default create({
  base: 'light',

  // Typography
  fontBase: '"Montserrat", sans-serif',
  fontCode: '"Fira Code", "Consolas", "Monaco", monospace',

  // Brand
  brandTitle: 'Liminal UI Library',
  brandUrl: 'https://the-genium007.github.io/Liminal/',
  brandImage: './assets/liminal-logo.png',
  brandTarget: '_self',

  // Color palette - hard industrial aesthetic
  colorPrimary: '#4F4652', // Violet graphite
  colorSecondary: '#8C969D', // Bleu acier

  // UI colors
  appBg: '#E9E4DA', // Ivoire pâle - main background
  appContentBg: '#E9E4DA', // Ivoire for content areas (docs)
  appBorderColor: '#B7B6B2', // Gris béton clair - borders
  appBorderRadius: 0, // No border radius - hard edges
  appPreviewBg: '#E9E4DA', // Preview background

  // Text colors
  textColor: '#1a1a1a', // Dark text for readability
  textInverseColor: '#E9E4DA', // Light text for dark backgrounds
  textMutedColor: '#4F4652', // Violet graphite for muted text

  // Toolbar colors
  barTextColor: '#1a1a1a', // Dark text in toolbar/sidebar
  barSelectedColor: '#E9E4DA', // Ivoire pâle for selected
  barBg: '#E9E4DA', // Ivoire pâle
  barHoverColor: '#E9E4DA', // Ivoire pâle

  // Button colors
  buttonBg: '#8C969D', // Bleu acier
  buttonBorder: '#8C969D',
  booleanBg: '#B7B6B2',
  booleanSelectedBg: '#8C969D',

  // Input colors
  inputBg: '#ffffff',
  inputBorder: '#B7B6B2',
  inputTextColor: '#1a1a1a',
  inputBorderRadius: 0, // No border radius - hard edges
});
