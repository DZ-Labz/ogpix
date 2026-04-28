import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Simple JSON file store for MVP — replace with a real DB in production.
const DB_PATH = join(process.cwd(), 'data', 'customers.json')

interface Customer {
  email: string
  stripeCustomerId: string
  stripePaymentIntentId: string
  apiKey: string
  createdAt: string
}

function loadDb(): Customer[] {
  if (!existsSync(DB_PATH)) return []
  try {
    return JSON.parse(readFileSync(DB_PATH, 'utf-8'))
  } catch {
    return []
  }
}

function saveDb(customers: Customer[]) {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) {
    const { mkdirSync } = require('fs')
    mkdirSync(dir, { recursive: true })
  }
  writeFileSync(DB_PATH, JSON.stringify(customers, null, 2))
}

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY?.trim()
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET?.trim()

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2026-03-25.dahlia' as const })

  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  const body = await req.text()
  let event: import('stripe').Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as import('stripe').Stripe.Checkout.Session

    if (session.mode === 'payment' && session.customer_email) {
      const customers = loadDb()
      const existing = customers.find((c) => c.email === session.customer_email)

      if (!existing) {
        const apiKey = `ogpix_${randomBytes(24).toString('hex')}`
        customers.push({
          email: session.customer_email,
          stripeCustomerId: String(session.customer),
          stripePaymentIntentId: String(session.payment_intent),
          apiKey,
          createdAt: new Date().toISOString(),
        })
        saveDb(customers)

        // TODO: send API key to customer via email (integrate email provider)
        console.log(`New Pro customer: ${session.customer_email}, API key: ${apiKey}`)
      }
    }
  }

  return NextResponse.json({ received: true })
}
