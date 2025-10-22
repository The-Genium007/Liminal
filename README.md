# Liminal

A modern React component library featuring WebGL-powered effects and animations built with TypeScript.

## Installation

```bash
npm install liminal
```

## Usage

```tsx
import { FusionBall } from 'liminal';
import 'liminal/styles';

function App() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <FusionBall
        color="#ffffff"
        speed={0.3}
        ballCount={15}
        enableMouseInteraction={true}
      />
    </div>
  );
}
```

## Components

### FusionBall

WebGL-powered metaball animation with mouse interaction and customizable effects.

```tsx
<FusionBall
  color="#ffffff"
  secondaryColor="#ff0000"
  cursorBallColor="#00ff00"
  speed={0.3}
  ballCount={15}
  ballSize={1.5}
  cursorBallSize={3}
  enableMouseInteraction={true}
  invertColors={false}
  enablePixelation={false}
  pixelSize={6}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `#ffffff` | Primary color (hex, rgba) |
| `secondaryColor` | `string` | `''` | Secondary color for gradient effect |
| `cursorBallColor` | `string` | `''` | Cursor ball color |
| `speed` | `number` | `0.3` | Animation speed |
| `ballCount` | `number` | `15` | Number of balls (5-50) |
| `ballSize` | `number` | `1.5` | Ball size multiplier |
| `clumpFactor` | `number` | `1` | Ball clustering factor |
| `cursorBallSize` | `number` | `3` | Cursor ball size |
| `enableMouseInteraction` | `boolean` | `true` | Enable mouse interaction |
| `hoverSmoothness` | `number` | `0.05` | Cursor smoothness |
| `animationSize` | `number` | `30` | Animation scale |
| `invertColors` | `boolean` | `false` | Invert colors (negative effect) |
| `enablePixelation` | `boolean` | `false` | Enable pixelation effect |
| `pixelSize` | `number` | `6` | Pixel size (even numbers only) |
| `className` | `string` | `''` | Custom CSS class |
| `width` | `number` | `undefined` | Canvas width (auto if undefined) |
| `height` | `number` | `undefined` | Canvas height (auto if undefined) |

#### Color Format

Colors support multiple formats with opacity:
- Hex: `#RRGGBB` or `#RRGGBBAA`
- RGB/RGBA: `rgba(255, 0, 0, 0.5)`

## Development

### Setup

```bash
npm install
npm run storybook
```

### Available Commands

```bash
npm run dev              # Start Vite dev server
npm run build            # Build library
npm run storybook        # Start Storybook on port 6006
npm run build-storybook  # Build static Storybook
```

### Project Structure

```
liminal/
├── src/
│   ├── components/
│   │   └── FusionBall/
│   │       ├── FusionBall.tsx
│   │       ├── FusionBall.css
│   │       ├── FusionBall.stories.tsx
│   │       └── index.ts
│   └── index.ts
├── dist/
│   ├── liminal.js
│   ├── liminal.umd.cjs
│   ├── style.css
│   └── index.d.ts
└── package.json
```

## Browser Support

- Modern browsers with WebGL 2.0 support
- Chrome, Firefox, Safari, Edge (latest versions)

## License

MIT

## Dependencies

- React 18+
- [OGL](https://github.com/oframe/ogl) - WebGL library
