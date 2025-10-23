# Contributing to Liminal

Thank you for considering contributing to Liminal!

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/The-Genium007/Liminal.git
   cd liminal
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start Storybook:
   ```bash
   npm run storybook
   ```

## Development Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test your changes in Storybook
4. Build the library:
   ```bash
   npm run build
   ```
5. Commit your changes:
   ```bash
   git commit -m "feat: your feature description"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Use SCSS modules for styling
- Keep components focused and reusable

## Testing

- Add Storybook stories for new components
- Include play functions to test interactions
- Ensure all tests pass before submitting PR

## Pull Request Process

1. Update README.md if needed
2. Update CHANGELOG.md with your changes
3. Ensure all CI checks pass
4. Request review from maintainers
5. Address review feedback
6. Maintainers will merge once approved

## Questions?

Open an issue for questions or discussions.
