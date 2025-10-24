import { addons } from 'storybook/manager-api';
import liminalTheme from './LiminalTheme';

addons.setConfig({
  theme: liminalTheme,
  sidebar: {
    showRoots: false,
    renderLabel: ({ name }) => name,
  },
});
