# Astro, static output, with MDX

The portfolio is an Astro site with static output, and its Case Study is MDX. Each Project in the portfolio takes a different approach: MySous is Next.js and React, and the Dad-a-base is Vue with Apollo. A portfolio is a content site, which is what Astro is built for, and it renders to plain HTML with no JavaScript unless a page asks for some.

## Considered Options

- **Next.js:** what MySous already shows, and more framework than a handful of static pages need.
- **Vue with Vite, or Nuxt:** what the Dad-a-base already shows.
- **SvelteKit:** a fair fit, but its strengths are in interactive apps, and this site has almost no interaction.
- **Astro (chosen).**

## Consequences

- Pages ship as HTML and CSS. The few scripts are opted into one by one ([ADR 0004](0004-near-zero-js.md)).
- Projects are content, read through Astro's content collections ([ADR 0003](0003-projects-as-content.md)).
- The Case Study can be MDX without extra wiring.
