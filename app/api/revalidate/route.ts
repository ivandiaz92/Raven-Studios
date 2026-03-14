import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * Force Next.js to refetch home and portfolio from Strapi on the next request.
 * Call GET or POST /api/revalidate when projects don't show (e.g. after Strapi was unreachable and cache served empty).
 */
export async function GET() {
  try {
    revalidatePath('/')
    revalidatePath('/portfolio')
    return NextResponse.json({ ok: true, message: 'Revalidated / and /portfolio' })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  return GET()
}
