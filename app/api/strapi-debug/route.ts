import axios from 'axios'
import { NextResponse } from 'next/server'

/**
 * Returns the raw Strapi API response for the first project.
 * Open http://localhost:3001/api/strapi-debug to see exact field names and structure
 * (e.g. how the image field is named and populated).
 */
export async function GET() {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api'
  const token = process.env.STRAPI_API_TOKEN

  try {
    const { data } = await axios.get(`${apiUrl}/projects`, {
      params: { 'pagination[limit]': 1, populate: '*' },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return NextResponse.json(data)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
