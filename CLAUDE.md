# Portfolio

Mikel McCormick's portfolio: a static Astro site presenting his Projects (MySous, the Dad-a-base and this site) to hiring managers and engineers. The spec is `docs/spec.md`.

## Working here

- Work in milestones (see the spec). Each is a GitHub issue on `magicianmike/portfolio` and a pull request, managed with `gh`. The repository is public: ask the author before pushing, opening issues or pull requests, or commenting.
- Decisions that are hard to reverse go in `docs/adr/`. Domain terms are in `GLOSSARY.md`; use them as written there.
- Visual-direction work ends with a journal entry in `docs/journal/NNNN-name.md`: what was chosen, the alternatives, and screenshots.
- Deploys go through Vercel's Git integration: a preview per pull request, production on merge to `main`.

## Code

- Astro, static output. Projects live in a content collection with a Zod schema; don't hard-code a Project's details in a page.
- Styles use Tailwind v4 with the theme's tokens in `@theme`. No raw colour values outside the token definitions.
- The only client-side scripts are the theme toggle and Vercel Web Analytics. Ask before adding any other.
- Every image has real alt text. Every page passes axe in both themes.
- Project copy is drafted from that Project's own Case Study, journals and decision records. No claim they don't support.
