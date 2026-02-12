'use client'

import { useState } from 'react'

const SERVICE_OPTIONS = [
  'Research & Strategy',
  'UX / UI Design',
  'Webflow / Framer development',
  'Custom Development',
] as const

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    // TODO: wire to your API or form service (e.g. Formspree, Resend, Strapi)
    setTimeout(() => setStatus('done'), 800)
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-2xl overflow-hidden bg-gray-900/90 border border-gray-800/80"
          style={{
            boxShadow: '0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          {/* Subtle noise overlay to match site texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06] rounded-2xl"
            style={{ backgroundImage: 'url(/images/dynamic_noise.png)', backgroundSize: 'auto' }}
            aria-hidden
          />
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 p-8 sm:p-10 lg:p-12 xl:p-14">
            {/* Left: CTA / message */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h2 className="title-entrance text-3xl sm:text-6xl lg:text-[4.95rem] font-display font-light text-white leading-tight mb-4">
                Ready to
                <br />
                elevate your brand?
              </h2>
              <p className="fade-in-up text-white/80 text-base sm:text-lg leading-relaxed" data-delay="0.12">
                If this resonates with you, let&apos;s collaborate and bring your vision to life.
                We&apos;re here to help!
              </p>
            </div>

            {/* Right: form */}
            <div className="fade-in-up lg:col-span-7" data-delay="0.2">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-white/90 mb-2">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7dd3fc]/60 focus:ring-1 focus:ring-[#7dd3fc]/30 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-white/90 mb-2">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7dd3fc]/60 focus:ring-1 focus:ring-[#7dd3fc]/30 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-service" className="block text-sm font-medium text-white/90 mb-2">
                    Service of your interest
                  </label>
                  <select
                    id="contact-service"
                    name="service"
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-700/80 text-white focus:outline-none focus:border-[#7dd3fc]/60 focus:ring-1 focus:ring-[#7dd3fc]/30 transition-colors appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.25rem',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="">Select...</option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-white/90 mb-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about your project..."
                    className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7dd3fc]/60 focus:ring-1 focus:ring-[#7dd3fc]/30 transition-colors resize-y min-h-[100px]"
                  />
                </div>
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#7dd3fc]/15 text-[#7dd3fc] border border-[#7dd3fc]/40 font-medium text-sm tracking-wide hover:bg-[#7dd3fc]/25 hover:border-[#7dd3fc]/60 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? 'Sending...' : status === 'done' ? 'Message sent' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
