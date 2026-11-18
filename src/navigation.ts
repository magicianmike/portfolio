/**
 * The main navigation. A page joins it when its milestone lands, so nothing links to a page that isn't there yet. The
 * Case Study isn't in it: it's reached from the Portfolio site's card and Project page.
 */
export const navigation = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: 'Resume', href: '/resume' },
] as const

export const contact = {
  email: 'mjmfxmike@gmail.com',
  github: 'https://github.com/magicianmike',
  linkedin: 'https://www.linkedin.com/in/mikel-mccormick-b054b445/',
  code: 'https://github.com/magicianmike/portfolio',
} as const
