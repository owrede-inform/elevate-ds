# ELEVATE Design System Documentation

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator, and documents the ELEVATE Design System components and patterns.

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Additional Commands

```bash
# Type checking
npm run typecheck

# Clear Docusaurus cache
npm run clear

# Serve production build locally
npm run serve
```

## Deployment

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
