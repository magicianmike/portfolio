# Tailwind v4, with the theme's tokens in `@theme`

Styles use Tailwind v4. The theme's colours, type, spacing and radii are CSS variables declared in its `@theme` block, and dark mode reassigns the colour variables. The Dad-a-base styles with plain CSS and three layers of tokens; this shows another way to keep a design consistent.

## Considered Options

- **Plain CSS with token layers:** what the Dad-a-base already shows.
- **CSS Modules or scoped styles alone:** fine for a few pages, but nothing stops a raw value creeping in.
- **Tailwind v4 (chosen):** its `@theme` makes the tokens real CSS variables, so the utilities and any hand-written CSS read the same values.

## Consequences

- Raw colour values appear only in the token definitions.
- The visual direction (milestone 1) fills in the tokens; the components use only the names.
