# Projects are a content collection with a Zod schema

Each Project is one file in an Astro content collection, validated by a Zod schema: its name, slug, pitch, problem, role, stack, Highlights, what's next, links and images. The home page and the Project pages read the collection; no page hard-codes a Project's details.

## Considered Options

- **Pages written by hand, one per Project:** quick for three, but the template drifts and comparing Projects gets harder.
- **A headless CMS:** a service and an account for content one person edits a few times a year.
- **A content collection (chosen).**

## Consequences

- A new Project is one new file. A missing or misspelt field fails the build, not the page.
- The Project page template is one component, so every Project has the same sections in the same order.
- The schema is the single source of truth for what a Project has, as the Zod schemas are for the API in the Dad-a-base.
