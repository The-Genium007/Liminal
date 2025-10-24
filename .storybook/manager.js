import { addons } from 'storybook/manager-api';
import liminalTheme from './LiminalTheme';

console.log('Manager.js loaded - applying theme:', liminalTheme);

addons.setConfig({
  theme: liminalTheme,
  sidebar: {
    showRoots: false,
    renderLabel: ({ name }) => name,
  },
});
