/**
 * Aspect — public site branding (logos, names, taglines).
 * White logo: dark UI backgrounds. Dark logo: light backgrounds / browser chrome.
 */
export const SITE_NAME = 'Aspect'
/** Short uppercase label for header edge, footer wordmark companion */
export const SITE_NAME_MARK = 'ASPECT'
export const SITE_TAGLINE = 'Digital Crafts for Ambitious Brands'
/** Vertical strip text (right edge) */
export const SITE_EDGE_LABEL = 'ASPECT DIGITAL STUDIO'

/** SVG viewBox size — use with Next/Image width/height + h-* w-auto for correct aspect ratio */
export const LOGO_SVG_INTRINSIC = { width: 400, height: 82 } as const

/** Use on dark backgrounds (header, footer, menu) */
export const LOGO_WHITE = '/images/aspect-blanco.svg'
/** Use on light backgrounds; favicon / OG when preview is light */
export const LOGO_DARK = '/images/aspect-negro.svg'

/** Canonical site URL — override with NEXT_PUBLIC_SITE_URL in production */
export const DEFAULT_SITE_URL = 'https://aspectdigital.io'
