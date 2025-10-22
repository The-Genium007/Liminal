# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Development Commands

### Core Commands
- `npm install` - Install all dependencies
- `npm run dev` - Start Vite development server for testing components
- `npm run build` - **CRITICAL**: Build library (runs TypeScript compiler + Vite build)
- `npm run preview` - Preview production build locally
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run build-storybook` - Build static Storybook for deployment
- `npm run prepublishOnly` - **CRITICAL**: Pre-publish hook that runs build automatically

### Testing & Validation
- **BEFORE publishing**: ALWAYS run `npm run build` to verify TypeScript compilation succeeds
- **BEFORE committing component changes**: Run `npm run storybook` to verify visual changes
- **CRITICAL**: TypeScript strict mode is enabled - all type errors MUST be resolved

## Architecture Overview

**Tech Stack**:
- React 18.2.0 with TypeScript 5.2.2 (strict mode enabled)
- Vite 5.2.0 for bundling (builds ES modules + UMD)
- SCSS modules for component styling
- Storybook 8.0.0 for component documentation
- vite-plugin-dts for TypeScript declaration generation

### Library Configuration
- **Entry Point**: `src/index.ts` (exports all public components/hooks)
- **Build Output**: `dist/` directory with:
  - `liminal.js` - ES module (primary)
  - `liminal.umd.cjs` - UMD bundle
  - `style.css` - Compiled SCSS styles
  - `index.d.ts` - TypeScript declarations
- **Peer Dependencies**: React ^18.0.0, react-dom ^18.0.0 (externalized in build)

### Project Structure
```
Liminal/
├── src/
│   ├── components/
│   │   ├── AnimatedText/          - Text animation component
│   │   ├── ScrollReveal/          - Scroll-based reveal animations
│   │   ├── AnimatedBackground/    - Dynamic background effects
│   │   └── index.ts               - Component exports
│   ├── hooks/
│   │   ├── useIntersectionObserver.ts
│   │   ├── useScrollAnimation.ts
│   │   └── index.ts
│   └── index.ts                   - Main library entry point
├── .storybook/                    - Storybook configuration
├── dist/                          - Build output (gitignored)
└── vite.config.ts                 - Vite library build config
```

## Code Style & Conventions

### TypeScript
- **ALWAYS** use strict TypeScript with explicit types
- **REQUIRED**: Export all component prop types (e.g., `AnimatedTextProps`)
- **Convention**: Use interface for React props (not type alias)
- **Target**: ES2020 with DOM libraries
- **JSX**: Use `react-jsx` transform (no need to import React in files)

### Component Structure
- **Pattern**: Each component in its own folder with:
  - `ComponentName.tsx` - Component implementation
  - `ComponentName.module.scss` - SCSS module styles
  - `ComponentName.stories.tsx` - Storybook stories
  - `index.ts` - Re-export component and types
  - `README.md` - Component documentation
- **CRITICAL**: ALWAYS use SCSS modules (not global CSS)
- **Import Pattern**: `import styles from './ComponentName.module.scss'`
- **Class Names**: Access via `styles.className` (module pattern)

### Styling Guidelines
- **SCSS Modules**: Use `.module.scss` extension for all component styles
- **CSS Variables**: Use CSS custom properties for dynamic styles (e.g., `--animation-duration`)
- **Animations**: Pure CSS animations (no external animation libraries)
- **No Global Styles**: All styles MUST be scoped to component modules

### Import Conventions
- **Internal Imports**: Use relative paths within src (e.g., `'./AnimatedText.module.scss'`)
- **Component Exports**: Export from folder index.ts, then from components/index.ts
- **Public API**: Only export through `src/index.ts` for library consumers
- **NEVER** export `.stories.tsx` or `.test.tsx` files in production build

## Component Development Workflow

### Adding a New Component
1. Create folder in `src/components/ComponentName/`
2. **REQUIRED files**:
   - `ComponentName.tsx` with exported interface `ComponentNameProps`
   - `ComponentName.module.scss` for styles
   - `ComponentName.stories.tsx` for Storybook
   - `index.ts` that exports component and prop types
   - `README.md` with usage examples
3. Add export to `src/components/index.ts`
4. Add export to `src/index.ts` for public API
5. **ALWAYS** test in Storybook before building

### Modifying Existing Components
1. **BEFORE editing**: Run `npm run storybook` to see current state
2. Make changes to component/styles
3. **AFTER editing**: Verify in Storybook that examples still work
4. Update stories if new props added
5. **CRITICAL**: Run `npm run build` to verify TypeScript compilation

## Publishing to NPM

### Pre-publish Checklist
- ☐ Update version in `package.json` (use semantic versioning)
- ☐ **CRITICAL**: Run `npm run build` and verify no errors
- ☐ **CRITICAL**: Check `dist/` folder contains all files:
  - `liminal.js`, `liminal.umd.cjs`, `style.css`, `index.d.ts`
- ☐ Test import in example project if making breaking changes
- ☐ Update README.md if API changed

### Publishing Commands
```bash
# Standard publish (after build verification)
npm publish

# For scoped packages (if package name becomes @scope/liminal)
npm publish --access public
```

### Version Guidelines
- **Patch (0.1.x)**: Bug fixes, style tweaks
- **Minor (0.x.0)**: New components, new props (backward compatible)
- **Major (x.0.0)**: Breaking API changes, removed props

## Storybook Configuration

- **Version**: 9.1.13 (latest)
- **Port**: 6006 (default)
- **Framework**: @storybook/react-vite
- **Story Format**: Component Story Format (CSF)
- **Stories Location**: `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- **Addons**: Built-in essentials (controls, actions, viewport, backgrounds, docs)
- **Testing**: @storybook/test (next) for play functions
- **ALWAYS** use TypeScript for stories (`Meta`, `StoryObj` types)
- **IMPORTANT**: Import types from `@storybook/react`, NOT `@storybook/react-vite`

### Story Writing Best Practices
- **Import Pattern**: `import type { Meta, StoryObj } from '@storybook/react';`
- **Tags**: Add `['autodocs']` to enable automatic documentation
- **ArgTypes**: Always add descriptions for all props
- **Play Functions**: Add interaction tests using `@storybook/test`
- **Decorators**: Use for common wrapper patterns (scroll containers, etc.)
- **SCSS Types**: TypeScript declarations in `src/scss.d.ts` for module imports

### Testing with Play Functions
```typescript
import { expect, within, waitFor } from '@storybook/test';

export const WithTest: Story = {
  args: { text: 'Hello' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByText('Hello');
    expect(element).toBeInTheDocument();
  },
};
```

For detailed Storybook best practices, see [STORYBOOK-BEST-PRACTICES.md](STORYBOOK-BEST-PRACTICES.md)

## Build Configuration

### Vite Library Mode
- **Entry**: `src/index.ts`
- **Formats**: ES module (primary), UMD (secondary)
- **Externals**: React and react-dom are peer dependencies (not bundled)
- **CSS**: Single `style.css` file (no code splitting)
- **Type Declarations**: Generated by vite-plugin-dts

### TypeScript Compiler
- **Strict mode**: Enabled (all strict checks)
- **noUnusedLocals**: true - MUST remove unused imports
- **noUnusedParameters**: true - MUST remove unused function parameters
- **Exclude**: `*.stories.tsx`, `*.test.tsx`, `node_modules`, `dist`

## Common Patterns

### Animation Component Pattern
```tsx
// Use CSS modules for styles
import styles from './Component.module.scss';

// Export props interface
export interface ComponentProps {
  /** Always document props with JSDoc */
  animation?: 'fade' | 'slide';
  duration?: number;
  delay?: number;
  className?: string;
}

// Use FC type with explicit props
export const Component: React.FC<ComponentProps> = ({
  animation = 'fade',
  duration = 1000,
  delay = 0,
  className = '',
}) => {
  // CSS variables for dynamic values
  return (
    <div
      className={`${styles.component} ${styles[animation]} ${className}`}
      style={{ '--duration': `${duration}ms` } as React.CSSProperties}
    >
      Content
    </div>
  );
};
```

### Hook Pattern
```tsx
// Export options interface
export interface UseHookOptions {
  threshold?: number;
  once?: boolean;
}

// Export hook with typed return
export const useHook = (options: UseHookOptions = {}) => {
  const { threshold = 0.5, once = false } = options;
  // Hook implementation
  return result;
};
```

## Critical Rules

- **NEVER** use global CSS - ALWAYS use SCSS modules
- **NEVER** bundle React/ReactDOM - they are peer dependencies
- **NEVER** export internal utils outside of src/index.ts
- **ALWAYS** run `npm run build` before publishing
- **ALWAYS** use TypeScript strict mode with explicit types
- **ALWAYS** document props with JSDoc comments
- **BEFORE committing**: Verify no TypeScript errors with `npm run build`

## Environment & Browser Support

- **Node**: Modern versions supporting ESM
- **Browsers**: Modern browsers with:
  - Intersection Observer API (for ScrollReveal)
  - CSS Grid and Flexbox
  - CSS Custom Properties (CSS variables)
  - ES2020 features
- **No polyfills included** - consumers must polyfill if supporting older browsers

## Git Workflow

- **NEVER commit**: `node_modules/`, `dist/`, `storybook-static/`, `.env` files
- **Branch**: Work on feature branches, PR to main
- **Commits**: Use conventional commits (feat:, fix:, docs:, chore:)
- **BEFORE pushing**: Ensure `npm run build` succeeds

---

**Library Type**: React component library (published to NPM)
**Build Tool**: Vite in library mode
**Style System**: SCSS modules with pure CSS animations
