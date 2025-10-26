# GitHub Actions Workflows

This directory contains the CI/CD workflows for Liminal UI Library.

## Branch Strategy

```
development → CI validation → auto-merge to main → NPM publish + Storybook deploy
```

### Branch Flow

1. **development**: Development branch where you push changes
2. **main**: Production branch (auto-updated after CI passes)
3. NPM publishes automatically when version in package.json is new
4. Storybook deploys automatically to GitHub Pages

---

## Workflows

### 🔍 CI (`ci.yml`)

Runs on every push to `development` and `main` branches.

**Jobs:**
- **lint-and-typecheck**: TypeScript type checking
- **build**: Build the library and verify artifacts
- **build-storybook**: Build Storybook documentation
- **test-storybook**: Run Storybook interaction tests
- **security-audit**: npm audit for vulnerabilities
- **dependency-review**: Review dependency changes in PRs

---

### 🚀 Auto-Merge to Main (`merge-to-main.yml`) - **PRINCIPAL**

**The main workflow that handles everything automatically.**

Triggers on every push to `development` branch.

**Flow:**
1. ✅ Wait for all CI jobs to complete
2. 🔀 Auto-merge `development` → `main` (if CI passes)
3. 📦 Publish to NPM (if version is new on npm registry)
4. 📚 Deploy Storybook to GitHub Pages
5. 💬 Add success comment on commit

**Jobs:**
- **check-ci**: Wait for CI validation
- **auto-merge**: Merge development to main
- **publish-npm**: Publish package to NPM with provenance
- **deploy-storybook**: Deploy Storybook documentation

**Features:**
- Node 22 LTS
- Smart version guard (skips if already published on npm)
- Provenance enabled for npm packages
- GitHub Pages deployment with proper permissions

---

### 📤 Publish on Main (`publish-on-main.yml`) - **BACKUP**

Fallback workflow if you manually merge to `main`.

**Triggers:**
- Direct push to `main` branch (manual merge)

**What it does:**
- Same as the publish job in `merge-to-main.yml`
- Ensures npm publication even if auto-merge is bypassed

---

### 🔒 CodeQL (`codeql.yml`)

Security analysis that runs:
- On push to `main`
- On pull requests to `main`
- Weekly on Mondays at 6:00 AM

**What it does:**
- Static code analysis for security vulnerabilities
- Scans JavaScript/TypeScript code
- Reports findings in Security tab

---

## Setup Instructions

### 1. NPM Token (Required)

1. Create an NPM **Granular Access Token** at https://www.npmjs.com/settings/tokens
2. Select **"Automation"** token type
3. Grant **publish** permission for `liminal-ui-library`
4. Add token to GitHub Secrets as `NPM_TOKEN`:
   - Go to repository **Settings > Secrets and variables > Actions**
   - Click **"New repository secret"**
   - Name: `NPM_TOKEN`
   - Value: your NPM token

### 2. GitHub Pages (Required for Storybook)

1. Go to repository **Settings > Pages**
2. Source: **GitHub Actions**
3. Storybook will be deployed at: `https://the-genium007.github.io/liminal-ui-library/`

### 3. Repository Settings

Ensure `package.json` has correct repository URL:
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/The-Genium007/liminal-ui-library.git"
  }
}
```

---

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
1. ✅ CI runs all tests on development
2. 🔀 Auto-merge to main (if CI passes)
3. 📦 Publish to NPM (if version is new)
4. 📚 Deploy Storybook to GitHub Pages

---

### Creating a Release

#### Option 1: Manual Version Bump (Simple)

```bash
# On development branch
git checkout development

# Update version (patch: 0.1.0 → 0.1.1)
npm version patch
# or
npm version minor  # 0.1.0 → 0.2.0
npm version major  # 0.1.0 → 1.0.0

# Update CHANGELOG.md
# Add your changes under new version

# Push (version commit + tag)
git push origin development --follow-tags
```

#### Option 2: Script (Recommended)

Add to `package.json`:
```json
{
  "scripts": {
    "release:patch": "npm version patch && git push origin development --follow-tags",
    "release:minor": "npm version minor && git push origin development --follow-tags",
    "release:major": "npm version major && git push origin development --follow-tags"
  }
}
```

Then run:
```bash
npm run release:patch
```

**What happens automatically:**
1. ✅ CI validates on development
2. 🔀 Merges to main
3. 🔍 Checks if version exists on npm
4. 📦 Publishes to NPM (if new version)
5. 📚 Deploys Storybook

---

## Badges

Add these badges to your main README.md:

```markdown
[![CI](https://github.com/The-Genium007/liminal-ui-library/actions/workflows/ci.yml/badge.svg)](https://github.com/The-Genium007/liminal-ui-library/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/liminal-ui-library?style=flat-square&logo=npm)](https://www.npmjs.com/package/liminal-ui-library)
[![npm downloads](https://img.shields.io/npm/dm/liminal-ui-library?style=flat-square&logo=npm)](https://www.npmjs.com/package/liminal-ui-library)
[![License](https://img.shields.io/badge/license-Dual%20License-blue?style=flat-square)](https://github.com/The-Genium007/liminal-ui-library/blob/main/LICENSE.md)
```

---

## Troubleshooting

### NPM Publish Fails

**Error: EPUBLISHCONFLICT**
- Version already exists on npm
- Increment version in `package.json`
- The workflow has a guard and will skip publishing automatically

**Error: 401 Unauthorized**
- Verify `NPM_TOKEN` secret is set correctly
- Check token has "Automation" permission with publish rights
- Token might have expired - generate a new one

**Error: Package name not available**
- Ensure package name `liminal-ui-library` is yours
- Check on npmjs.com if you own the package

### Storybook Deploy Fails

**Error: Deployment failed**
- Ensure GitHub Pages is enabled (Settings > Pages)
- Source must be set to "GitHub Actions"
- Check permissions in workflow (pages: write, id-token: write)

**Error: Build fails**
- Run locally: `npm run build-storybook`
- Check Storybook configuration
- Verify all dependencies are in `package.json`

### Merge to Main Fails

**Error: CI jobs not found**
- Ensure CI workflow ran successfully on development
- Check CI job names match exactly:
  - `Lint and Type Check`
  - `Build Library`
  - `Build Storybook`
  - `Test Storybook`

**Error: Merge conflict**
- Manually resolve conflicts
- Merge main into development first
- Push to development again

### Build Artifacts Missing

**Error: Files not found in dist/**
- Ensure `npm run build` completes successfully
- Check TypeScript compilation has no errors
- Verify `vite.config.ts` outputs to `dist/`
- Required files: `liminal.js`, `liminal.umd.cjs`, `style.css`, `index.d.ts`

---

## Workflow Architecture

```
┌─────────────────┐
│  Push to dev    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   CI Workflow   │
│  - Lint/Type    │
│  - Build        │
│  - Test         │
└────────┬────────┘
         │ ✅ Pass
         ▼
┌─────────────────┐
│  Auto-merge     │
│  dev → main     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Publish npm    │
│  (if new ver)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deploy Storybook│
│  GitHub Pages   │
└─────────────────┘
```

---

## Notes

- All workflows use **Node 22 LTS** for consistency
- npm packages are published with **provenance** for security
- Storybook is deployed to **GitHub Pages** automatically
- Version guard prevents duplicate publications
- Workflows are **idempotent** - safe to re-run
