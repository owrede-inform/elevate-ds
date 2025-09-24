# ELEVATE Design System Documentation

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator, and documents the ELEVATE Design System components and patterns.

## Installation

```bash
pnpm install
```

## Local Development

```bash
pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Additional Commands

```bash
# Type checking
pnpm typecheck

# Clear Docusaurus cache
pnpm clear

# Serve production build locally
pnpm serve
```

## Deployment

Using SSH:

```bash
USE_SSH=true pnpm deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
