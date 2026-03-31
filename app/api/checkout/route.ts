import { NextRequest, NextResponse } from 'next/server'

// Stripe integration requires STRIPE_SECRET_KEY to be set.
// Until credentials are provided, this endpoint returns a 503.
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

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

  // Dynamic import so the module only loads when Stripe is configured
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2026-03-25.dahlia' as const })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: STRIPE_PRO_PRICE_ID, quantity: 1 }],
    customer_email: email,
    success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/#pricing`,
    metadata: { source: 'ogpix' },
  })

  return NextResponse.redirect(session.url!)
}
