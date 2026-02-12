import { getProjects } from '@/lib/strapi'
import { NextResponse } from 'next/server'

export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api'
  const hasToken = !!process.env.STRAPI_API_TOKEN

  try {
    const projects = await getProjects(5)
    return NextResponse.json({
      ok: true,
      message: 'Strapi connection OK',
      strapiUrl: apiUrl,
      hasToken,
      projectCount: projects.length,
      projectIds: projects.map((p) => p.id),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        ok: false,
        message: 'Strapi request failed',
        error: message,
        strapiUrl: apiUrl,
        hasToken,
      },
      { status: 502 }
    )
  }
}
