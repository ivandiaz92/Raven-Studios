/** Primary navigation — shared by header and mobile drawer */
export const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/portfolio', label: 'Portafolio' },
  { href: '/blog', label: 'Blog' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/contact', label: 'Contacto' },
] as const

export function navLinkIsActive(pathname: string | null | undefined, href: string): boolean {
  // usePathname() can be null briefly in dev — guard or .startsWith throws and breaks the app
  if (pathname == null || pathname === '') {
    return false
  }
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
