import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createQuoteRequest, type QuoteRequestPayload } from '@/lib/strapi'

const resend = new Resend(process.env.RESEND_API_KEY)
const QUOTE_EMAIL_TO = process.env.CONTACT_EMAIL_TO || process.env.QUOTE_EMAIL_TO || ''
const QUOTE_FROM = process.env.CONTACT_FROM || 'Raven Studios <onboarding@resend.dev>'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildQuoteEmailHtml(payload: QuoteRequestPayload): string {
  const line = (label: string, value: string | undefined) =>
    value ? `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>` : ''
  const list = (label: string, arr: string[] | undefined) =>
    arr?.length ? `<p><strong>${escapeHtml(label)}:</strong> ${arr.map((x) => escapeHtml(x)).join(', ')}</p>` : ''
  return `
    <h2>Nueva solicitud de cotización (brief)</h2>
    ${line('Empresa / proyecto', payload.company_name)}
    ${line('Contacto', payload.contact_name)}
    ${line('Email', payload.email)}
    ${line('Redes sociales', payload.social_networks)}
    <hr style="border-color:#333; margin:1em 0;" />
    ${line('Secciones necesarias', payload.sections_needed)}
    ${line('¿Agregar/eliminar/modificar secciones?', payload.sections_modify)}
    ${line('Especificar secciones', payload.sections_specify)}
    ${line('¿Sitio con blog?', payload.site_has_blog)}
    ${line('Google Analytics global', payload.google_analytics_global)}
    ${line('Tags/eventos de medición', payload.measurement_tags)}
    ${line('Objetivo del sitio', payload.site_objective)}
    ${line('Productos/servicios/ambos', payload.show_products_services)}
    ${line('Cantidad aproximada', payload.quantity_approximate)}
    ${line('Nivel de información', payload.info_level)}
    ${line('¿Tiene dominio?', payload.has_domain)}
    ${line('Proveedor de dominio', payload.domain_provider)}
    ${line('¿Tiene hosting?', payload.has_hosting)}
    ${line('Preferencia de hosting', payload.hosting_preference)}
    ${line('Tipo de proyecto', payload.project_type)}
    ${line('URL sitio actual', payload.current_site_url)}
    ${line('Funcionalidad adicional', payload.additional_functionality)}
    ${list('Tipos de funcionalidad', payload.functionality_types)}
    ${line('Descripción de funcionalidad', payload.functionality_description)}
    ${line('Plan de mantenimiento', payload.maintenance_plan)}
    ${list('Tipos de soporte', payload.support_types)}
  `
}

export async function POST(request: Request) {
  const required = ['company_name', 'contact_name', 'email'] as const
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  for (const key of required) {
    const val = body[key]
    if (val == null || String(val).trim() === '') {
      return NextResponse.json(
        { error: `Missing or empty required field: ${key}` },
        { status: 400 }
      )
    }
  }

  const payload: QuoteRequestPayload = {
    company_name: String(body.company_name).trim(),
    contact_name: String(body.contact_name).trim(),
    email: String(body.email).trim(),
    social_networks: body.social_networks != null ? String(body.social_networks).trim() : undefined,
    sections_needed: body.sections_needed != null ? String(body.sections_needed).trim() : undefined,
    sections_modify: body.sections_modify != null ? String(body.sections_modify).trim() : undefined,
    sections_specify: body.sections_specify != null ? String(body.sections_specify).trim() : undefined,
    site_has_blog: body.site_has_blog != null ? String(body.site_has_blog).trim() : undefined,
    google_analytics_global: body.google_analytics_global != null ? String(body.google_analytics_global).trim() : undefined,
    measurement_tags: body.measurement_tags != null ? String(body.measurement_tags).trim() : undefined,
    site_objective: body.site_objective != null ? String(body.site_objective).trim() : undefined,
    show_products_services: body.show_products_services != null ? String(body.show_products_services).trim() : undefined,
    quantity_approximate: body.quantity_approximate != null ? String(body.quantity_approximate).trim() : undefined,
    info_level: body.info_level != null ? String(body.info_level).trim() : undefined,
    has_domain: body.has_domain != null ? String(body.has_domain).trim() : undefined,
    domain_provider: body.domain_provider != null ? String(body.domain_provider).trim() : undefined,
    has_hosting: body.has_hosting != null ? String(body.has_hosting).trim() : undefined,
    hosting_preference: body.hosting_preference != null ? String(body.hosting_preference).trim() : undefined,
    project_type: body.project_type != null ? String(body.project_type).trim() : undefined,
    current_site_url: body.current_site_url != null ? String(body.current_site_url).trim() : undefined,
    additional_functionality: body.additional_functionality != null ? String(body.additional_functionality).trim() : undefined,
    functionality_types: Array.isArray(body.functionality_types) ? body.functionality_types.map(String) : undefined,
    functionality_description: body.functionality_description != null ? String(body.functionality_description).trim() : undefined,
    maintenance_plan: body.maintenance_plan != null ? String(body.maintenance_plan).trim() : undefined,
    support_types: Array.isArray(body.support_types) ? body.support_types.map(String) : undefined,
  }

  const result = await createQuoteRequest(payload)
  if (!result) {
    return NextResponse.json(
      { error: 'Could not save quote request. Check Strapi connection and permissions.' },
      { status: 503 }
    )
  }

  // Send email notification (same Resend config as contact form)
  const to = QUOTE_EMAIL_TO.trim()
  if (process.env.RESEND_API_KEY && to) {
    try {
      await resend.emails.send({
        from: QUOTE_FROM,
        to: [to],
        subject: `[Raven Studios] Nueva cotización: ${payload.company_name}`,
        html: buildQuoteEmailHtml(payload),
      })
    } catch (err) {
      console.error('Quote email notification failed:', err)
      // Don't fail the request — submission is already in Strapi
    }
  }

  return NextResponse.json({ ok: true, id: result.id })
}
