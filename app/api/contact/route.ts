import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'ivandiazmtz@proton.me'
const CONTACT_FROM = process.env.CONTACT_FROM || 'Aspect <onboarding@resend.dev>'

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'El formulario de contacto no está configurado (falta RESEND_API_KEY)' },
      { status: 503 }
    )
  }
  const to = CONTACT_EMAIL_TO.trim()
  if (!to) {
    return NextResponse.json(
      { error: 'El formulario de contacto no está configurado (falta CONTACT_EMAIL_TO)' },
      { status: 503 }
    )
  }
  const resend = new Resend(apiKey)

  let body: { name?: string; email?: string; service?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const service = String(body.service ?? '').trim()
  const message = String(body.message ?? '').trim()

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Nombre y correo son obligatorios' },
      { status: 400 }
    )
  }

  const html = `
    <h2>Nuevo mensaje del formulario de contacto</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
    <p><strong>Servicio de interés:</strong> ${escapeHtml(service) || '—'}</p>
    <p><strong>Mensaje:</strong></p>
    <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(message) || '—'}</pre>
  `

  const { data, error } = await resend.emails.send({
    from: CONTACT_FROM,
    to: [to],
    subject: `[Aspect] Contacto de ${name}`,
    html,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json(
      { error: error.message || 'No se pudo enviar el correo' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, id: data?.id })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
