# Mikel McCormick: portfolio

The portfolio of Mikel McCormick, product-minded frontend engineer: **<https://www.mjmfx.com>**.

It presents three Projects, each with a page of its own and a link to its full Case Study:

- **[MySous](https://www.mjmfx.com/projects/my-sous):** a kitchen assistant for what goes with what, and why. Next.js and React. ([code](https://github.com/magicianmike/my-sous))
- **[The Dad-a-base](https://www.mjmfx.com/projects/dad-a-base):** a dad-joke site styled as the Sunday funnies. Vue and Apollo over REST. ([code](https://github.com/magicianmike/dad-a-base))
- **[The portfolio site](https://www.mjmfx.com/projects/this-site),** and [how it was made](https://www.mjmfx.com/case-study).

## Start here

- **[The Case Study](https://www.mjmfx.com/case-study):** why Astro, Projects as content, how the look was chosen from prototypes, performance, accessibility, and building it with Claude Code.
- **[The spec](docs/spec.md)** and the **[decision records](docs/adr/)**.
- **[Journal 0001](docs/journal/0001-visual-direction.md):** the visual direction, with every prototype.
- **[The pull requests](https://github.com/magicianmike/portfolio/pulls?q=is%3Apr+is%3Aclosed):** one per milestone, each closing its issue.

## How it's built

- **Astro 7, static output** ([ADR 0001](docs/adr/0001-astro.md)), with MDX for the Case Study.
- **Tailwind v4,** with the theme's tokens as CSS variables in `src/styles/global.css` ([ADR 0002](docs/adr/0002-tailwind-v4-tokens.md)).
- **Projects as content:** one YAML file each in `src/content/projects/`, checked by a Zod schema in `src/content.config.ts`, so a missing field or alt text fails the build ([ADR 0003](docs/adr/0003-projects-as-content.md)).
- **Near-zero JavaScript:** about 1 KB: 660 bytes for the theme, 342 on the home page for the glide to Work, and Vercel Web Analytics ([ADR 0004](docs/adr/0004-near-zero-js.md)).
- **Screenshots from a script,** captured from the live apps in light and dark, and **link preview images made at build time** from the site's own fonts and colours.
- **Deploys through Vercel's Git integration:** a preview for every pull request, production on merge to `main` ([ADR 0005](docs/adr/0005-vercel-git-integration.md)).

## Run it

Node 24 (`.nvmrc`) and npm.

```sh
npm install
npm run dev          # http://localhost:4321
```

| Command               | What it does                                                                         |
| --------------------- | ------------------------------------------------------------------------------------ |
| `npm run check`       | Lint, typecheck, the token contrast tests and the build, as CI runs them             |
| `npm run test:e2e`    | Playwright in Chromium and iPhone WebKit, with axe in both themes, against the build |
| `npx lhci autorun`    | The Lighthouse budget, on a phone, after `npm run build`                             |
| `npm run screenshots` | Recapture every Project's screenshots; `-- my-sous` for one                          |

`npm run resume-pdf` reprints the resume PDF from the site's own `/resume` page, and `node scripts/icons.ts` renders the PNG icons from `public/favicon.svg`.

## Quality

Every pull request runs lint, typecheck and the build; Playwright on every page in Chromium and WebKit, with axe in light and dark; and Lighthouse on a phone, which fails the pull request below 100 for Accessibility, Best Practices or SEO, or 95 for Performance.

## How it was made

Built with Claude Code, to the spec and the rules in [`CLAUDE.md`](CLAUDE.md): Claude builds each milestone, and the author reviews its preview deploy and merges. The Case Study's [Building with Claude](https://www.mjmfx.com/case-study#building-with-claude) says more.
