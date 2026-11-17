/** The main navigation. A page joins it when its milestone lands, so nothing links to a page that isn't there yet. */
export const navigation = [{ label: 'Work', href: '/#work' }] as const

export const contact = {
  email: 'mjmfxmike@gmail.com',
  github: 'https://github.com/magicianmike',
  linkedin: 'https://www.linkedin.com/in/mikel-mccormick-b054b445/',
  code: 'https://github.com/magicianmike/portfolio',
} as const
