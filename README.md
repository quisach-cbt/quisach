# BTOI Platform

A modern web platform built with SvelteKit, TypeScript, and Prisma.

## Features

- Authentication system using Auth.js
- Markdown support with various extensions:
  - KaTeX for math equations
  - Emoji support
  - Task lists
  - Anchors and references
- Monaco code editor integration
- Tailwind CSS for styling
- PostgreSQL database with Prisma ORM
- Contest management system
- User achievements and badges

## Prerequisites

- Node.js >= 18
- pnpm package manager
- PostgreSQL database

## Installation

1. Clone the repository
2. Install dependencies:

    ```sh
    pnpm install
    ```

3. Set up environment variables:

    ```sh
    cp .env.example .env
    # Edit .env with your configuration
    ```

4. Initialize the database:

    ```sh
    pnpm prisma generate
    pnpm prisma db push
    ```

## Development

Start the development server:

```sh
pnpm dev
```

The application will be available at `http://localhost:5173`

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm lint` - Run linting
- `pnpm format` - Format code

## Technology Stack

- [SvelteKit](https://kit.svelte.dev/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Prisma](https://www.prisma.io/) - Database ORM
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Markdown-it](https://github.com/markdown-it/markdown-it) - Markdown parser
- [Auth.js](https://authjs.dev/) - Authentication
- [Vitest](https://vitest.dev/) - Testing framework

## License

This project is proprietary software.