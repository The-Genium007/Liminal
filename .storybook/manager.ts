import { addons } from 'storybook/internal/manager-api';
import liminalTheme from './LiminalTheme';

addons.setConfig({
  theme: liminalTheme,
  sidebar: {
    showRoots: false,
    renderLabel: ({ name }) => name,
  },
});
