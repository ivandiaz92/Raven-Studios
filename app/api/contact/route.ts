import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'ivandiazmtz@proton.me'
const CONTACT_FROM = process.env.CONTACT_FROM || 'Raven Studios <onboarding@resend.dev>'

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Contact form is not configured (missing RESEND_API_KEY)' },
      { status: 503 }
    )
  }
  const to = CONTACT_EMAIL_TO.trim()
  if (!to) {
    return NextResponse.json(
      { error: 'Contact form is not configured (missing CONTACT_EMAIL_TO)' },
      { status: 503 }
    )
  }

  let body: { name?: string; email?: string; service?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const service = String(body.service ?? '').trim()
  const message = String(body.message ?? '').trim()

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Name and email are required' },
      { status: 400 }
    )
  }

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Service of interest:</strong> ${escapeHtml(service) || '—'}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(message) || '—'}</pre>
  `

  const { data, error } = await resend.emails.send({
    from: CONTACT_FROM,
    to: [to],
    subject: `[Raven Studios] Contact from ${name}`,
    html,
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
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
