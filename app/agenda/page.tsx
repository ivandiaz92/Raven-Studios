import type { Metadata } from 'next'
import Link from 'next/link'
import ExternalLinkIcon from '@/components/ExternalLinkIcon'

const FALLBACK_CALCOM_BOOKING_URL = 'https://cal.com/aspect/15min'

function getCalcomBookingUrl() {
  return process.env.NEXT_PUBLIC_CALCOM_BOOKING_URL || FALLBACK_CALCOM_BOOKING_URL
}

function getCalcomEmbedUrl() {
  const url = new URL(getCalcomBookingUrl())
  url.searchParams.set('embed', 'true')
  url.searchParams.set('theme', 'dark')
  return url.toString()
}

export const metadata: Metadata = {
  title: 'Agenda una llamada',
  description:
    'Agenda una llamada de descubrimiento con Aspect para hablar sobre tu proyecto, objetivos y próximos pasos.',
}

export default function AgendaPage() {
  const bookingUrl = getCalcomBookingUrl()
  const embedUrl = getCalcomEmbedUrl()

  return (
    <div className="mx-auto w-[92%] max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pt-40">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-[#0ea5e9]/10 backdrop-blur-md sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -left-32 top-16 h-72 w-72 rounded-full bg-[#38bdf8]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#6366f1]/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <aside className="flex flex-col justify-between gap-8">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-[#7dd3fc] sm:text-sm">
                Llamada de descubrimiento
              </p>
              <h1 className="text-balance font-display text-4xl font-light leading-tight text-white sm:text-6xl lg:text-7xl">
                Agenda una llamada
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                Elige el horario que mejor te funcione. Revisamos tu proyecto, tus objetivos y los
                próximos pasos para construir una experiencia digital clara.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-white/75 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ['Duración', '15 minutos'],
                ['Formato', 'Online'],
                ['Enfoque', 'Objetivos + próximos pasos'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-white/45">
                    {label}
                  </p>
                  <p className="mt-2 text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 border-b border-[#7dd3fc]/70 pb-1 font-mono text-xs uppercase tracking-[0.18em] text-[#7dd3fc] transition-colors hover:border-white hover:text-white"
              >
                Abrir en Cal.com
                <ExternalLinkIcon className="text-base" />
              </a>
              <Link
                href="/contact"
                prefetch={false}
                className="inline-flex min-h-11 items-center border-b border-white/40 pb-1 font-mono text-xs uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-[#7dd3fc] hover:text-[#7dd3fc]"
              >
                Prefiero escribir
              </Link>
            </div>
          </aside>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/40">
            <iframe
              src={embedUrl}
              title="Agenda una llamada en Cal.com"
              className="h-[760px] w-full bg-black sm:h-[820px]"
              loading="lazy"
              allow="camera; microphone; fullscreen; payment"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
