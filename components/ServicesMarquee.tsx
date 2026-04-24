/**
 * Infinite horizontal marquee — services / capabilities (no Strapi).
 * Duplicated track for seamless CSS loop.
 */
const SERVICES = [
  'LANDING PAGES',
  'SITIOS CORPORATIVOS',
  'TIENDAS EN LÍNEA',
  'PERFORMANCE & SEO',
  'DISEÑO A LA MEDIDA',
  'BRANDING DIGITAL',
  'REDACCIÓN CREATIVA',
] as const

function MarqueeSegment({ idPrefix }: { idPrefix: string }) {
  return (
    <>
      {SERVICES.map((label, i) => (
        <span key={`${idPrefix}-${i}`} className="inline-flex items-center shrink-0">
          <span className="mx-5 sm:mx-8 text-white font-bold text-[11px] sm:text-sm tracking-[0.18em] sm:tracking-[0.22em] uppercase whitespace-nowrap">
            {label}
          </span>
          <span className="text-white/45 text-base sm:text-lg leading-none pb-0.5" aria-hidden>
            ·
          </span>
        </span>
      ))}
    </>
  )
}

export default function ServicesMarquee() {
  return (
    <div
      className="relative w-full border-y border-white/[0.08] py-3.5 sm:py-4 overflow-hidden"
      aria-hidden
    >
      <div className="flex w-max animate-marquee">
        <div className="flex shrink-0 items-center">
          <MarqueeSegment idPrefix="a" />
        </div>
        <div className="flex shrink-0 items-center">
          <MarqueeSegment idPrefix="b" />
        </div>
      </div>
    </div>
  )
}
