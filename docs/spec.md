# Portfolio: spec

Mikel McCormick's portfolio, a small static site that presents his projects to hiring managers and engineers screening for frontend and product-engineering roles. It shows MySous and the Dad-a-base, and itself. Each project already has its own in-app Case Study, so the portfolio summarises and links out rather than retelling. The site is itself a sample of how he works: it has a spec, decision records, issues and pull requests, and a Case Study of its own.

## Audience and goal

- **Who:** hiring managers and engineers deciding whether to talk to Mikel.
- **What they should do:** read a Project, then a Case Study, then get in touch.
- **Identity:** "Mikel McCormick", "product-minded frontend engineer", with one supporting sentence.

## Pages

| Path               | What it is                                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `/`                | The hero (name, positioning, one sentence), then a Project card each for MySous, the Dad-a-base and This site, in that order |
| `/projects/<slug>` | A Project page, from one template (below)                                                                                    |
| `/case-study`      | This site's own Case Study, in MDX                                                                                           |
| `/about`           | A photo, a short bio, life outside work, and links to the resume and its PDF                                                 |
| `/resume`          | The resume as HTML, laid out as `resume.html` is, and a PDF download                                                         |
| 404                | A styled not-found page linking home                                                                                         |

Every page has the same header (name, navigation, theme toggle) and footer (contact links, the code, the Case Study).

### The Project page template

Every Project page has the same sections, in this order, so Projects are easy to compare and a new one drops in:

1. **Pitch and hero:** one line, and a hero screenshot.
2. **The problem and my role.**
3. **Stack:** as chips.
4. **Three Highlights:** each a heading, a short paragraph and an image.
5. **What's next.**
6. **Links:** Live, Case Study, Code.

"This site" is a Project too: its Case Study link goes to `/case-study`, and its Live link is the home page.

### The Projects

| Project        | Live                                | Case Study                                     | Code                                         | Stack in brief                     |
| -------------- | ----------------------------------- | ---------------------------------------------- | -------------------------------------------- | ---------------------------------- |
| MySous         | <https://my-sous.vercel.app>        | <https://my-sous.vercel.app/case-study>        | <https://github.com/magicianmike/my-sous>    | Next.js 16 static export, React 19 |
| The Dad-a-base | <https://the-dad-a-base.vercel.app> | <https://the-dad-a-base.vercel.app/case-study> | <https://github.com/magicianmike/dad-a-base> | Vue 3, Apollo over REST, Pinia     |
| This site      | the home page                       | `/case-study`                                  | <https://github.com/magicianmike/portfolio>  | Astro, Tailwind v4                 |

The Dad-a-base's live deploy comes from the repository it was first built in, so its Case Study is framed slightly differently from the public copy of its code. That's accepted for now and revisited later.

### Copy

Each Project's pitch, problem, role, Highlights and "what's next" are drafted from that Project's own Case Study, journals and decision records, then edited by the author. No claim goes in that those sources don't support.

### Contact

Links only, with no form and no backend: email (`mailto:mjmfxmike@gmail.com`), [GitHub](https://github.com/magicianmike) and [LinkedIn](https://www.linkedin.com/in/mikel-mccormick-b054b445/).

### About and resume

A short bio on `/about`, and the resume on `/resume`, in the main navigation. The resume is copied word for word from `resume.html` in the `resume` repo and kept up to date by hand, with its PDF to download. Its page keeps `resume.html`'s layout, on a sheet of its own in the notebook: the black bar, the uppercase name, the spaced-out section labels, the striped rows and the three-column footer. It uses the site's fonts, and the sheet has tokens of its own after `resume.html`'s greys, with the lightest darkened to pass 4.5:1, and a dark sheet in the dark theme.

The author's photo, taped into the page beside the bio, and a section on life outside work: the author's family (their wife, Brittany, two dogs, Hank and Oakley, and four cats), woodworking, home renovation, cooking, photography and mixed-media art. The same photo is a small avatar beside the name in every page's header, where it's decorative. The photo's metadata is stripped before it's committed. Brittany's first name and the dogs' names are in by the author's choice, and nothing more about them; no photos but the author's, and nothing that places the author more closely than the town already on the site.

## Look

Quiet and typographic, so each Project's own look carries the colour in its screenshots. One accent. The direction is chosen from four throwaway home-page variants (Swiss grid, Editorial, Studio notebook, Developer mono), each in both themes, and recorded in journal 0001.

- **Themes:** light and dark. The site follows the system until the Visitor uses the toggle, which is remembered.
- **Accessibility:** WCAG 2.2 AA. Keyboard and screen reader friendly, reduced motion respected, contrast checked in both themes.

## Stack

- **Astro 7**, static output, with MDX for the Case Study ([ADR 0001](adr/0001-astro.md)).
- **Tailwind v4**, with the theme's tokens as CSS variables in `@theme` ([ADR 0002](adr/0002-tailwind-v4-tokens.md)).
- **Projects in a content collection** with a Zod schema, so a new Project is one file and a missing field fails the build ([ADR 0003](adr/0003-projects-as-content.md)).
- **Near-zero JavaScript:** the theme toggle and Vercel Web Analytics are the only scripts. No framework islands ([ADR 0004](adr/0004-near-zero-js.md)).
- **Screenshots** are captured from the live apps by a Playwright script, at desktop and phone sizes, in light and dark, committed, and optimised by `astro:assets`. Every image has real alt text.
- **Vercel Web Analytics:** cookieless, no consent banner. Unlike the Projects, which have no analytics, the portfolio wants to know whether its Case Studies are read, and its Case Study says so.
- **SEO:** a sitemap, `robots.txt`, an Open Graph image per page made at build time, and an initials favicon set.

## Quality

CI must pass before a merge:

- Build, lint and typecheck.
- Playwright on every page, in Chromium and WebKit.
- axe on every page, in both themes.
- Lighthouse CI on mobile: Accessibility, Best Practices and SEO at 100, Performance at 95 or more.

## The Case Study

`/case-study`, in MDX, in the same voice as the other two: why Astro, the content model, performance and the Lighthouse numbers, accessibility, and building with Claude. It's linked from the home page as This site's card, and from the footer.

## Process

- [`CLAUDE.md`](../CLAUDE.md), [`GLOSSARY.md`](../GLOSSARY.md), decision records in `docs/adr/`.
- Each milestone is a GitHub issue and a pull request. The repository is public from its first commit.
- Journals in `docs/journal/` for visual-direction work only.
- Deploys use Vercel's Git integration: a preview for every pull request, production on merge to `main`, at `mikelmccormick.vercel.app` (or `mikel-mccormick.vercel.app` if the first is taken) ([ADR 0005](adr/0005-vercel-git-integration.md)).

## Milestones

0. **Tracer:** an Astro skeleton with one page, CI (build, lint, typecheck, Playwright, axe), and a Vercel deploy through the Git integration.
1. **Visual direction:** the author picks from the four variants; tokens, type and layout in Tailwind's `@theme`; the header, footer and theme toggle. Journal 0001.
2. **Home and Projects as content:** the content collection and its schema, the hero and the Project cards.
3. **Project pages:** the template, the screenshot script, and the three Projects' copy.
4. **About and contact:** the bio, the resume, the PDF and the contact links.
5. **The Case Study.**
6. **Polish:** the Lighthouse budget in CI, the README, Open Graph images, the sitemap, `robots.txt`, the favicon set, the 404 page, and Vercel Web Analytics.
7. **Bio and photo:** the photo on About and as the header's avatar, and the Outside work section.
8. **Resume page:** the resume on `/resume`, laid out as `resume.html` is, and a new photo.
