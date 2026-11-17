# Deploys through Vercel's Git integration

The site deploys through Vercel's Git integration: every pull request gets a preview, and a merge to `main` deploys production. MySous and the Dad-a-base deploy from the author's machine with the Vercel CLI; this repository is the author's own, so the integration can connect to it.

## Considered Options

- **The Vercel CLI from the author's machine:** what the other two do, and it means a preview has to be made by hand for each change.
- **The Git integration (chosen):** a preview link on every pull request, which matters for a visual site.

## Consequences

- Production is whatever `main` is. CI must pass before a merge.
- The address is `mikelmccormick.vercel.app`, or `mikel-mccormick.vercel.app` if that's taken.
