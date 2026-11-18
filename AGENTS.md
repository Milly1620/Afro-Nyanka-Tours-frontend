# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with aliases via `@` → `src/` (see `vite.config.ts`).
- Components: `src/components/{pages,sections,ui,layout}`; shared utils in `src/lib/`.
- State: Redux Toolkit store in `src/store.ts`.
- Types: `src/types/`; API client in `src/services/api.ts`.
- Styles: Tailwind CSS in `src/index.css`; assets in `src/assets/`.
- Entrypoints: `src/main.tsx`, `src/App.tsx`. Static files in `public/`. Build output in `dist/`.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server.
- `npm run build`: Production build to `dist/`.
- `npm run preview`: Serve the built app locally.
- `npm test`: Run unit tests with Vitest (jsdom, RTL setup in `src/setupTests.ts`).
- `npm run test:ui`: Vitest UI for interactive runs.
- `npm run lint`: ESLint over `src/`.
- Docker: `docker build -t tour-frontend .` then `docker run -p 7000:7000 tour-frontend`.

## Coding Style & Naming Conventions
- Language: TypeScript + React. Prefer functional components and hooks.
- Indentation: 2 spaces; semicolons required; ES modules.
- Naming: `PascalCase` for components (`HeroSection.tsx`), `camelCase` for vars/functions, `SCREAMING_SNAKE_CASE` for env keys.
- Imports: use `@/...` alias for modules under `src/`.
- Linting: Config in `eslint.config.js` (React + TS). Fix issues before PRs.
- Styling: Tailwind CSS utility-first classes in JSX; keep component styles local.

## Testing Guidelines
- Frameworks: Vitest + React Testing Library.
- Location: Co-locate tests next to code or in `__tests__/`.
- Naming: `*.test.tsx` (components) or `*.test.ts` (utils).
- Run: `npm test` (headless) or `npm run test:ui`.
- Aim: Cover critical UI states, reducers, and API helpers.

## Commit & Pull Request Guidelines
- Commits: Use clear, imperative messages (present tense). Example: "Refactor Header for mobile nav; fix z-index".
- PRs: Include a concise description, testing steps, related issues/links, and screenshots/gifs for UI changes.
- Scope: Keep PRs focused and small; ensure `npm run lint` and tests pass.

## Security & Configuration
- Env: Set `VITE_BACKEND_URL` in `.env` for API base URL.
- Do not commit secrets. Validate external requests in `src/services/api.ts` and handle errors gracefully.
