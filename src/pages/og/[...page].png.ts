import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import { renderCard, type Card } from '../../og'

/**
 * Every page's link preview image, at `/og/<page>.png`, where `<page>` is its path, or `index` for the home page.
 * `Base` points each page's `og:image` here, so a page without a card here fails the build's link check in the tests.
 */
export const getStaticPaths = (async () => {
  const projects = await getCollection('projects')
  const cards: Record<string, Card> = {
    index: {
      note: "hi, I'm Mikel",
      title: 'A product-minded frontend engineer who sweats the details.',
      line: 'Projects, their Case Studies, and how they were made.',
    },
    about: {
      note: "that's me",
      title: 'About',
      line: '18 years between design and engineering, and life outside work.',
    },
    resume: {
      note: 'the resume',
      title: 'Resume',
      line: 'Senior Software Engineer & Design Architect.',
    },
    'case-study': {
      note: 'how it was made',
      title: 'How this site was made',
      line: 'Why Astro, Projects as content, the look, and building it with Claude Code.',
    },
  }
  for (const { id, data } of projects) {
    cards[`projects/${id}`] = { note: data.note, title: data.name, line: data.pitch }
  }
  return Object.entries(cards).map(([page, card]) => ({ params: { page }, props: card }))
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderCard(props as Card)), { headers: { 'Content-Type': 'image/png' } })
