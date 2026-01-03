# Copilot Instructions

## Coding Standards
- Always update relevant documentation when making code changes
- Always update tests for any code changes
- Use conventional commit messages (feat:, fix:, docs:, etc.)
- Update .gitignore when adding new tools or generated files
- Run tests before committing

## Project-Specific Rules
- Use `brandvault.gocxm.com` (non-www) for all URLs
- Apply changes to all three Firebase configs (uat, prod)
- Run npm audit to ensure no vulnerabilities
- When updating Cloud Functions, use `firebase-functions/v1` (1st gen) - do not upgrade to 2nd gen
- Cloud Functions deploy to `northamerica-northeast1` (Montreal) region
- When adding new origins, update CORS whitelist in `functions/index.js`

## Branch Strategy
- `dev` - Development and feature work
- `uat` - User Acceptance Testing (auto-deploys on push)
- `main` - Production (auto-deploys on PR merge from uat)
- Dependabot PRs target `dev` branch

## Dependencies
- Both `package.json` files need updating (root and functions/)
- Both `package-lock.json` files need regenerating after dependency changes
- Node.js version: 24

## Linting (when configured)
- ESLint for JavaScript files
- HTMLHint for HTML files  
- Stylelint for CSS files
- Prettier for formatting
- markdownlint for .md files
- Run PurgeCSS when CSS files are modified to remove unused styles