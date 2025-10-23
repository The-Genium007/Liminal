# GitHub Actions Workflows

This directory contains the CI/CD workflows for Liminal.

## Branch Strategy

```
development → CI validation → auto-merge to main → NPM release
```

### Branch Flow

1. **development**: Development branch where you push changes
2. **main**: Production branch (auto-updated after CI passes)
3. NPM publishes automatically when version in package.json changes on main

## Workflows

### CI (`ci.yml`)

Runs on every push to `development` branch.

**Jobs:**
- **lint-and-typecheck**: TypeScript type checking
- **build**: Build the library and verify artifacts
- **build-storybook**: Build Storybook documentation
- **test-storybook**: Run Storybook interaction tests
- **security-audit**: npm audit for vulnerabilities
- **dependency-review**: Review dependency changes in PRs

### Auto-Merge (`merge-to-main.yml`)

Automatically merges `development` to `main` after CI passes.

**Flow:**
1. Wait for all CI jobs to complete
2. If all tests pass, merge development → main
3. Adds comment confirming successful merge

### Release (`release.yml`)

Triggered automatically when `package.json` version changes on `main`.

**Jobs:**
- **check-version-change**: Detect if version was updated
- **validate**: Run full validation suite
- **create-tag**: Create git tag (e.g., v0.1.0)
- **publish-npm**: Publish package to NPM registry
- **create-github-release**: Create GitHub release with changelog
- **deploy-storybook**: Deploy Storybook to GitHub Pages

### Deploy Storybook (`deploy-storybook.yml`)

Standalone workflow to deploy Storybook documentation to GitHub Pages.

**Triggers:**
- On every push to `main` branch
- Manual trigger via GitHub Actions UI (workflow_dispatch)

**What it does:**
- Builds Storybook static site
- Deploys to GitHub Pages at: `https://the-genium007.github.io/Liminal/`

### CodeQL (`codeql.yml`)

Security analysis that runs:
- On push to `main`
- On pull requests to `main`
- Weekly on Mondays

## Setup Instructions

### 1. NPM Token

1. Create an NPM access token at https://www.npmjs.com/settings/tokens
2. Select "Automation" token type
3. Add token to GitHub Secrets as `NPM_TOKEN`:
   - Go to repository Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: your NPM token

### 2. GitHub Pages

1. Go to repository Settings > Pages
2. Source: GitHub Actions
3. Storybook will be deployed at: `https://yourusername.github.io/liminal/`

### 3. Branch Protection

Recommended branch protection rules for `main`:

1. Go to Settings > Branches > Add rule
2. Branch name pattern: `main`
3. Enable:
   - Require a pull request before merging
   - Require status checks to pass before merging
     - `Lint and Type Check`
     - `Build Library`
     - `Build Storybook`
   - Require branches to be up to date before merging
   - Do not allow bypassing the above settings

## Development Workflow

### Daily Development

```bash
# Work on development branch
git checkout development

# Make your changes
# ...

# Commit and push
git add .
git commit -m "feat: your feature"
git push origin development
```

**What happens automatically:**
1. CI runs all tests on development
2. If tests pass → auto-merge to main
3. If package.json version changed → publish to NPM

### Creating a Release

```bash
# On development branch
git checkout development

# Update version (patch: 0.1.0 → 0.1.1)
npm version patch  # or minor (0.1.0 → 0.2.0), major (0.1.0 → 1.0.0)

# Update CHANGELOG.md
# Add your changes under new version

# Commit and push
git add .
git commit -m "chore: release v0.1.1"
git push origin development
```

**What happens automatically:**
1. CI validates on development
2. Merges to main
3. Detects version change
4. Creates git tag (v0.1.1)
5. Publishes to NPM
6. Creates GitHub release
7. Deploys Storybook

## Badges

Add these badges to your README.md:

```markdown
[![CI](https://github.com/yourusername/liminal/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/liminal/actions/workflows/ci.yml)
[![Release](https://github.com/yourusername/liminal/actions/workflows/release.yml/badge.svg)](https://github.com/yourusername/liminal/actions/workflows/release.yml)
[![npm version](https://badge.fury.io/js/liminal.svg)](https://www.npmjs.com/package/liminal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## Troubleshooting

### NPM Publish Fails

- Verify `NPM_TOKEN` secret is set correctly
- Check token has "Automation" permission
- Ensure package name is available on NPM
- Verify version number doesn't already exist

### Storybook Tests Fail

- Tests require Playwright
- Ensure tests pass locally: `npm run test-storybook`
- Check play functions don't have timeouts

### Build Artifacts Missing

- Ensure `npm run build` completes successfully
- Check `dist/` folder contains all required files
- Verify TypeScript compilation has no errors
