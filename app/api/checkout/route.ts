import { NextRequest, NextResponse } from 'next/server'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY?.trim()
const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID?.trim()
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').trim()

export async function GET(req: NextRequest) {
  if (!STRIPE_SECRET_KEY || !STRIPE_PRO_PRICE_ID) {
    return NextResponse.json(
      {
        error: 'Stripe not configured',
        message: 'Set STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID environment variables to enable Pro checkout.',
      },
      { status: 503 }
    )
  }

  const email = new URL(req.url).searchParams.get('email') ?? undefined

  try {
    const body = new URLSearchParams()
    body.append('mode', 'payment')
    body.append('line_items[0][price]', STRIPE_PRO_PRICE_ID)
    body.append('line_items[0][quantity]', '1')
    body.append('success_url', `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`)
    body.append('cancel_url', `${APP_URL}/#pricing`)
    body.append('metadata[source]', 'ogpix')
    if (email) body.append('customer_email', email)

    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    const data = await resp.json()

    if (!resp.ok) {
      console.error('Stripe API error:', data)
      return NextResponse.json(
        {
          error: 'Checkout failed',
          message: data?.error?.message ?? 'Stripe returned an error',
        },
        { status: 500 }
      )
    }

    return NextResponse.redirect(data.url)
  } catch (err: unknown) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      {
        error: 'Checkout failed',
        message: 'Could not connect to payment provider. Please try again.',
      },
      { status: 500 }
    )
  }
}
