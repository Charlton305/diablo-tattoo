import type { Env } from './types'

export async function handleContact(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const formData = await request.formData()

  // Honeypot — bots fill hidden fields, humans don't
  const honeypot = formData.get('website') as string
  if (honeypot) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const name = (formData.get('name') as string | null)?.trim()
  const email = (formData.get('email') as string | null)?.trim()
  const phone = (formData.get('phone') as string | null)?.trim() || 'Not provided'
  const artist = (formData.get('artist') as string | null)?.trim() || 'No preference'
  const message = (formData.get('message') as string | null)?.trim()

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Name, email, and message are required.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Collect up to 3 image attachments
  type Attachment = { filename: string; content: string }
  const attachments: Attachment[] = []
  for (let i = 0; i < 3; i++) {
    const file = formData.get(`image${i}`)
    if (file instanceof File && file.size > 0) {
      const buffer = await file.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let binary = ''
      const chunkSize = 8192
      for (let j = 0; j < bytes.length; j += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(j, j + chunkSize))
      }
      attachments.push({ filename: file.name, content: btoa(binary) })
    }
  }

  // TODO: swap onboarding@resend.dev for a verified client domain address before going live
  const FROM = 'onboarding@resend.dev'
  const STUDIO_EMAIL = 'rayhunttattoo@gmail.com'

  const notificationHtml = `
    <h2>New Booking Enquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Artist requested:</strong> ${artist}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${message}</p>
    ${attachments.length > 0 ? `<p><strong>Attachments:</strong> ${attachments.length} image(s) attached</p>` : ''}
  `

  const confirmationHtml = `
    <p>Hi ${name},</p>
    <p>Thanks for getting in touch with Diablo Tattoo! We've received your enquiry and will get back to you as soon as possible.</p>
    ${artist !== 'No preference' ? `<p>You requested to work with <strong>${artist}</strong>.</p>` : ''}
    <p>In the meantime, feel free to browse our artists' work on our website.</p>
    <p>Talk soon,<br/>The Diablo Tattoo Team</p>
  `

  try {
    const [notifyRes, confirmRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM,
          to: [STUDIO_EMAIL],
          reply_to: email,
          subject: `New Booking Enquiry — ${name}`,
          html: notificationHtml,
          attachments: attachments.map(a => ({ filename: a.filename, content: a.content })),
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM,
          to: [email],
          subject: 'We\'ve received your enquiry — Diablo Tattoo',
          html: confirmationHtml,
        }),
      }),
    ])

    if (!notifyRes.ok) {
      const err = await notifyRes.text()
      console.error('Resend notification error:', err)
      return new Response(JSON.stringify({ error: 'Failed to send email. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Log but don't fail if confirmation to customer bounces
    if (!confirmRes.ok) {
      console.error('Resend confirmation error:', await confirmRes.text())
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Contact handler error:', err)
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}
