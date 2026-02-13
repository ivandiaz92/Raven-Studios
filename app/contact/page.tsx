'use client'

import { useState } from 'react'
import Link from 'next/link'

const inputClass =
  'w-full px-4 py-3.5 text-base rounded-lg bg-black/40 border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7dd3fc]/60 focus:ring-1 focus:ring-[#7dd3fc]/30 transition-colors'
const labelClass = 'block text-base font-medium text-white/90 mb-2'
const sectionTitleClass = 'text-2xl font-display font-light text-white border-b border-gray-800 pb-2 mb-6 tracking-wide [word-spacing:0.2em]'
const sectionContentClass = 'space-y-5'

const SECTIONS_MODIFY = [
  { value: 'no_base', label: 'No, usar estructura base' },
  { value: 'add', label: 'Sí, agregar secciones' },
  { value: 'remove', label: 'Sí, eliminar secciones' },
  { value: 'modify', label: 'Sí, modificar secciones' },
  { value: 'other', label: 'Otro' },
]
const SITE_OBJECTIVE = [
  { value: 'contactos', label: 'Generar contactos' },
  { value: 'marca', label: 'Posicionamiento de marca' },
  { value: 'informativo', label: 'Informativo' },
  { value: 'otro', label: 'Otro' },
]
const SHOW_PRODUCTS_SERVICES = [
  { value: 'servicios', label: 'Servicios' },
  { value: 'productos', label: 'Productos' },
  { value: 'ambos', label: 'Ambos' },
  { value: 'ninguno', label: 'Ninguno' },
]
const INFO_LEVEL = [
  { value: 'basico', label: 'Básico (nombre + breve descripción + CTA)' },
  { value: 'intermedio', label: 'Intermedio (descripción + imagen + CTA)' },
  { value: 'detallado', label: 'Detallado (galería, atributos, precio, CTA)' },
]
const DOMAIN_PROVIDER = [
  { value: 'godaddy', label: 'GoDaddy' },
  { value: 'google_domains', label: 'Google Domains' },
  { value: 'namecheap', label: 'Namecheap' },
  { value: 'otro', label: 'Otro' },
]
const HOSTING_PREFERENCE = [
  { value: 'mantener_actual', label: 'Mantener hosting actual' },
  { value: 'migrar', label: 'Migrar a servidor administrado por ustedes' },
  { value: 'por_definir', label: 'Por definir' },
]
const PROJECT_TYPE = [
  { value: 'sitio_nuevo', label: 'Sitio nuevo desde cero' },
  { value: 'rediseno', label: 'Rediseño de sitio existente' },
]
const ADDITIONAL_FUNCTIONALITY = [
  { value: 'no_estandar', label: 'No, solo funcionalidad estándar' },
  { value: 'si_algunas', label: 'Sí, algunas funcionalidades adicionales' },
]
const FUNCTIONALITY_TYPES = [
  'Agenda / reservas',
  'Integraciones con herramientas externas (CRM, email, ERP, etc.)',
  'Multilenguaje',
  'Área privada / login de usuarios',
  'Panel de administración personalizado',
  'Otro (especificar)',
]
const MAINTENANCE_PLAN = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
  { value: 'conocer_opciones', label: 'Me gustaría conocer las opciones' },
]
const SUPPORT_TYPES = [
  'Actualizaciones técnicas y de seguridad',
  'Respaldos y monitoreo del sitio',
  'Soporte ante errores o caídas',
  'Ajustes menores de contenido',
  'Por definir',
]

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [functionalityTypes, setFunctionalityTypes] = useState<string[]>([])
  const [supportTypes, setSupportTypes] = useState<string[]>([])

  function toggleCheckbox(set: string[], value: string, setter: (arr: string[]) => void) {
    if (set.includes(value)) setter(set.filter((x) => x !== value))
    else setter([...set, value])
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value ?? ''
    const getRadio = (name: string) => {
      const el = form.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement | null
      return el?.value ?? ''
    }
    const payload = {
      company_name: get('company_name'),
      contact_name: get('contact_name'),
      email: get('email'),
      social_networks: get('social_networks') || undefined,
      sections_needed: get('sections_needed') || undefined,
      sections_modify: getRadio('sections_modify') || undefined,
      sections_specify: get('sections_specify') || undefined,
      site_has_blog: getRadio('site_has_blog') || undefined,
      google_analytics_global: getRadio('google_analytics_global') || undefined,
      measurement_tags: getRadio('measurement_tags') || undefined,
      site_objective: getRadio('site_objective') || undefined,
      show_products_services: getRadio('show_products_services') || undefined,
      quantity_approximate: get('quantity_approximate') || undefined,
      info_level: getRadio('info_level') || undefined,
      has_domain: getRadio('has_domain') || undefined,
      domain_provider: getRadio('domain_provider') || undefined,
      has_hosting: getRadio('has_hosting') || undefined,
      hosting_preference: getRadio('hosting_preference') || undefined,
      project_type: getRadio('project_type') || undefined,
      current_site_url: get('current_site_url') || undefined,
      additional_functionality: getRadio('additional_functionality') || undefined,
      functionality_types: functionalityTypes.length ? functionalityTypes : undefined,
      functionality_description: get('functionality_description') || undefined,
      maintenance_plan: getRadio('maintenance_plan') || undefined,
      support_types: supportTypes.length ? supportTypes : undefined,
    }

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        setStatus('error')
        return
      }
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="w-[90%] max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white font-mono text-xs sm:text-sm tracking-[0.2em] uppercase hover:text-[#7dd3fc] transition-colors border-b border-white/60 pb-1.5 mb-10"
        >
          <span aria-hidden>←</span> Inicio
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light text-white leading-tight mb-4">
            Get in touch
          </h1>
          <p className="text-white/80 text-lg sm:text-xl leading-relaxed">
            Brief para cotización de sitio web. Tiempo estimado: 5–8 minutos. Con esta información te enviaremos una cotización clara.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10 lg:gap-y-12 items-start">
            {/* Columna izquierda: secciones 1, 3, 5, 7 */}
            <div className="space-y-10 lg:space-y-12">
              {/* Sección 1 — Información general */}
              <section>
                <h2 className={sectionTitleClass}>Información general</h2>
                <div className={sectionContentClass}>
                  <div>
                    <label htmlFor="company_name" className={labelClass}>Nombre de la empresa / proyecto *</label>
                    <input id="company_name" name="company_name" type="text" required className={inputClass} placeholder="Ej. Mi Marca" />
                  </div>
                  <div>
                    <label htmlFor="contact_name" className={labelClass}>Nombre de contacto *</label>
                    <input id="contact_name" name="contact_name" type="text" required className={inputClass} placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label htmlFor="social_networks" className={labelClass}>Tus redes sociales (si tienes)</label>
                    <input id="social_networks" name="social_networks" type="text" className={inputClass} placeholder="Ej. @marca" />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>Correo electrónico *</label>
                    <input id="email" name="email" type="email" required className={inputClass} placeholder="tu@email.com" />
                  </div>
                </div>
              </section>

              {/* Sección 3 — Objetivo del sitio */}
              <section>
                <h2 className={sectionTitleClass}>Objetivo del sitio</h2>
                <div className={sectionContentClass}>
                  <div>
                    <span className={labelClass}>¿Cuál es el objetivo principal del sitio? *</span>
                    <div className="space-y-2 mt-2">
                      {SITE_OBJECTIVE.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 text-base text-white/90 cursor-pointer">
                          <input type="radio" name="site_objective" value={opt.value} className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Sección 5 — Dominio y hosting */}
              <section>
                <h2 className={sectionTitleClass}>Dominio y hosting</h2>
                <p className="text-white/60 text-base mb-4">La contratación o renovación de dominios no está incluida en la cotización, salvo que se indique.</p>
                <div className={sectionContentClass}>
                  <div>
                    <span className={labelClass}>¿Actualmente cuentas con un dominio? *</span>
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2 text-base text-white/90 cursor-pointer">
                        <input type="radio" name="has_domain" value="si" className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                        Sí
                      </label>
                      <label className="flex items-center gap-2 text-base text-white/90 cursor-pointer">
                        <input type="radio" name="has_domain" value="no" className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                        No
                      </label>
                    </div>
                  </div>
                  <div>
                    <span className={labelClass}>¿Actualmente cuentas con hosting? *</span>
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2 text-base text-white/90 cursor-pointer">
                        <input type="radio" name="has_hosting" value="si" className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                        Sí
                      </label>
                      <label className="flex items-center gap-2 text-base text-white/90 cursor-pointer">
                        <input type="radio" name="has_hosting" value="no" className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                        No
                      </label>
                    </div>
                  </div>
                  <div>
                    <span className={labelClass}>En caso de contar con dominio, ¿quién es su proveedor?</span>
                    <div className="space-y-2 mt-2">
                      {DOMAIN_PROVIDER.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 text-base text-white/90 cursor-pointer">
                          <input type="radio" name="domain_provider" value={opt.value} className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className={labelClass}>¿Deseas mantener tu hosting actual o migrar?</span>
                    <div className="space-y-2 mt-2">
                      {HOSTING_PREFERENCE.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 text-base text-white/90 cursor-pointer">
                          <input type="radio" name="hosting_preference" value={opt.value} className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Sección 7 — Funcionalidades adicionales */}
              <section>
                <h2 className={sectionTitleClass}>Funcionalidades adicionales</h2>
                <div className={sectionContentClass}>
                  <div>
                    <span className={labelClass}>¿El sitio requiere alguna funcionalidad adicional? *</span>
                    <div className="space-y-2 mt-2">
                      {ADDITIONAL_FUNCTIONALITY.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 text-base text-white/90 cursor-pointer">
                          <input type="radio" name="additional_functionality" value={opt.value} className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className={labelClass}>¿Qué tipo de funcionalidades adicionales requieres?</span>
                    <div className="space-y-2 mt-2">
                      {FUNCTIONALITY_TYPES.map((opt) => (
                        <label key={opt} className="flex items-center gap-3 text-base text-white/90 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={functionalityTypes.includes(opt)}
                            onChange={() => toggleCheckbox(functionalityTypes, opt, setFunctionalityTypes)}
                            className="rounded border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="functionality_description" className={labelClass}>Describe brevemente la funcionalidad (si aplica)</label>
                    <p className="text-white/60 text-sm mb-2">No es necesario entrar en detalle técnico. Solo describe qué debería hacer el sitio.</p>
                    <textarea id="functionality_description" name="functionality_description" rows={4} className={inputClass} placeholder="Opcional" />
                  </div>
                </div>
              </section>
            </div>

            {/* Columna derecha: secciones 2, 4, 6, 8 */}
            <div className="space-y-10 lg:space-y-12">
              {/* Sección 2 — Estructura del sitio */}
              <section>
                <h2 className={sectionTitleClass}>Estructura del sitio</h2>
                <p className="text-white/70 text-base mb-4">Nuestra propuesta base contempla hasta 5 secciones (ej. Home, Nosotros, Servicios, FAQ, Contacto).</p>
                <div className={sectionContentClass}>
                  <div>
                    <label htmlFor="sections_needed" className={labelClass}>¿Qué secciones necesitas incluir? *</label>
                    <textarea id="sections_needed" name="sections_needed" rows={3} className={inputClass} placeholder="Ej. Home, Nosotros, Servicios, Contacto" />
                  </div>
                  <div>
                    <span className={labelClass}>¿Deseas agregar, eliminar o modificar alguna sección? *</span>
                    <div className="space-y-2 mt-2">
                      {SECTIONS_MODIFY.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 text-base text-white/90 cursor-pointer">
                          <input type="radio" name="sections_modify" value={opt.value} className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sections_specify" className={labelClass}>En caso de agregar o modificar secciones, especifícalas</label>
                    <textarea id="sections_specify" name="sections_specify" rows={2} className={inputClass} placeholder="Opcional" />
                  </div>
                  <div>
                    <span className={labelClass}>¿El sitio requerirá un blog?</span>
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2 text-base text-white/90 cursor-pointer">
                        <input type="radio" name="site_has_blog" value="si" className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                        Sí
                      </label>
                      <label className="flex items-center gap-2 text-base text-white/90 cursor-pointer">
                        <input type="radio" name="site_has_blog" value="no" className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                        No
                      </label>
                    </div>
                  </div>
                  <div>
                    <span className={labelClass}>¿Requieres un solo Google Analytics global? *</span>
                    <p className="text-white/60 text-sm mb-2">Permite medir interacciones clave del sitio y tomar decisiones basadas en datos.</p>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-base text-white/90 cursor-pointer">
                        <input type="radio" name="google_analytics_global" value="si" className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                        Sí
                      </label>
                      <label className="flex items-center gap-2 text-base text-white/90 cursor-pointer">
                        <input type="radio" name="google_analytics_global" value="no" className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                        No
                      </label>
                    </div>
                  </div>
                  <div>
                    <span className={labelClass}>¿Necesitas tags/eventos de medición adicionales?</span>
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2 text-base text-white/90 cursor-pointer">
                        <input type="radio" name="measurement_tags" value="formularios" className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                        Formularios
                      </label>
                      <label className="flex items-center gap-2 text-base text-white/90 cursor-pointer">
                        <input type="radio" name="measurement_tags" value="botones" className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                        Botones
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Sección 4 — Productos o Servicios */}
              <section>
                <h2 className={sectionTitleClass}>Productos o Servicios</h2>
                <div className={sectionContentClass}>
                  <div>
                    <span className={labelClass}>¿El sitio mostrará productos, servicios o ambos? *</span>
                    <div className="space-y-2 mt-2">
                      {SHOW_PRODUCTS_SERVICES.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 text-base text-white/90 cursor-pointer">
                          <input type="radio" name="show_products_services" value={opt.value} className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="quantity_approximate" className={labelClass}>Cantidad aproximada *</label>
                    <input id="quantity_approximate" name="quantity_approximate" type="text" className={inputClass} placeholder="Ej. 5 servicios / 20 productos" />
                  </div>
                  <div>
                    <span className={labelClass}>Nivel de información por producto o servicio</span>
                    <div className="space-y-2 mt-2">
                      {INFO_LEVEL.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 text-base text-white/90 cursor-pointer">
                          <input type="radio" name="info_level" value={opt.value} className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Sección 6 — Sobre el proyecto */}
              <section>
                <h2 className={sectionTitleClass}>Sobre el proyecto</h2>
                <div className={sectionContentClass}>
                  <div>
                    <span className={labelClass}>¿El proyecto es un sitio nuevo o uno existente? *</span>
                    <div className="space-y-2 mt-2">
                      {PROJECT_TYPE.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 text-base text-white/90 cursor-pointer">
                          <input type="radio" name="project_type" value={opt.value} className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="current_site_url" className={labelClass}>URL del sitio actual (si aplica)</label>
                    <input id="current_site_url" name="current_site_url" type="url" className={inputClass} placeholder="https://..." />
                  </div>
                </div>
              </section>

              {/* Sección 8 — Soporte y Mantenimiento */}
              <section>
                <h2 className={sectionTitleClass}>Soporte y Mantenimiento</h2>
                <div className={sectionContentClass}>
                  <div>
                    <span className={labelClass}>¿Te interesaría contar con un plan de mantenimiento posterior al lanzamiento? *</span>
                    <div className="space-y-2 mt-2">
                      {MAINTENANCE_PLAN.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 text-base text-white/90 cursor-pointer">
                          <input type="radio" name="maintenance_plan" value={opt.value} className="rounded-full border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]" />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className={labelClass}>¿Qué tipo de soporte consideras importante?</span>
                    <div className="space-y-2 mt-2">
                      {SUPPORT_TYPES.map((opt) => (
                        <label key={opt} className="flex items-center gap-3 text-base text-white/90 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={supportTypes.includes(opt)}
                            onChange={() => toggleCheckbox(supportTypes, opt, setSupportTypes)}
                            className="rounded border-gray-600 text-[#7dd3fc] focus:ring-[#7dd3fc]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-10 pt-4">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#7dd3fc]/15 text-[#7dd3fc] border border-[#7dd3fc]/40 font-medium text-base tracking-wide hover:bg-[#7dd3fc]/25 hover:border-[#7dd3fc]/60 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Enviando...' : status === 'done' ? 'Enviado' : status === 'error' ? 'Reintentar' : 'Enviar brief'}
            </button>
          </div>
        </form>

        {status === 'done' && (
          <p className="mt-8 text-white/80 text-center text-lg">
            Gracias. Con base en tus respuestas te enviaremos una cotización. Para dudas, escríbenos directamente.
          </p>
        )}

        <p className="mt-12 text-white/50 text-base text-center">
          La información se utiliza exclusivamente para la cotización. Cualquier cambio posterior en alcance podrá implicar ajustes en tiempos y costos.
        </p>
      </div>
    </div>
  )
}
