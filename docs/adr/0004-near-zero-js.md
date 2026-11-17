# Near-zero JavaScript: the theme toggle and analytics only

The only client-side scripts are the theme toggle, which must run before first paint to avoid a flash of the wrong theme, and Vercel Web Analytics. There are no framework islands.

## Considered Options

- **Islands for small touches** (an image lightbox, animated cards): pleasant, but each costs a framework runtime for something CSS or a plain link can do.
- **No analytics:** what the Projects do, as a privacy stance. But the portfolio's job is to be read by people hiring, and knowing whether its Case Studies are opened is worth a cookieless counter.
- **Two scripts (chosen).**

## Consequences

- Pages work without JavaScript, apart from remembering the theme.
- Lighthouse Performance has little to lose; the budget is 95 or more on mobile.
- Any new script needs the author's agreement and a note here.
