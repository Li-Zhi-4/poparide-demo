# Poparide — Request to Book (demo)

An unofficial, desktop-only rebuild of Poparide's Request to Book page, made to
show how I'd work in a Next.js + TypeScript codebase. Not affiliated with
Poparide; all trip, driver and review content is placeholder data.

> 🚧 Work in progress. Screenshots, live link and design notes coming soon.

## Stack

- Next.js (App Router) + TypeScript (strict, `noUncheckedIndexedAccess`)
- Tailwind CSS v4 with design tokens from the Figma variables
  ([`src/app/globals.css`](src/app/globals.css))

## Running locally

```bash
npm install
npm run dev
```

| Script              | What it does                 |
| ------------------- | ---------------------------- |
| `npm run dev`       | Start the dev server         |
| `npm run build`     | Production build             |
| `npm run lint`      | ESLint                       |
| `npm run typecheck` | TypeScript, no emit          |
| `npm run format`    | Prettier (sorts class names) |
