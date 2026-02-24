import type { Env } from './types'
import { handleContact } from './contact'
import { handleGallery } from './gallery'
import { verifyTinaToken } from './auth'

export type { Env }

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(request.url)
    const { pathname } = url

    if (pathname === '/contact') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405, headers: corsHeaders })
      }
      return handleContact(request, env, corsHeaders)
    }

    if (pathname === '/gallery') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405, headers: corsHeaders })
      }

      const clientId = url.searchParams.get('clientID') ?? env.TINA_CLIENT_ID
      const token = request.headers.get('Authorization') ?? ''

      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorised' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const isValid = await verifyTinaToken(token, clientId)
      if (!isValid) {
        return new Response(JSON.stringify({ error: 'Unauthorised' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return handleGallery(request, env, corsHeaders)
    }

    return new Response('Not found', { status: 404, headers: corsHeaders })
  },
}

export default handler
