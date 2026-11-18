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

## Since

18 November 2026, with the author's agreement: a third script, 342 bytes, on the home page only. Arriving from another page's Work link, it opens the page at the top and then scrolls down to the Projects, as a click on Work does on the home page itself, where CSS's `scroll-behavior` does it with no script. With less motion asked for, or without JavaScript, the page jumps to the Projects instead.
