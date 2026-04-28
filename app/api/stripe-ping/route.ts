import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return NextResponse.json({ error: 'No key' }, { status: 503 })

  try {
    // Raw https request to Stripe API
    const https = await import('https')
    const result = await new Promise<{ status: number; body: string }>((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.stripe.com',
          port: 443,
          path: '/v1/products?limit=1',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${key}`,
            'User-Agent': 'ogpix-test/1.0',
          },
          timeout: 10000,
        },
        (res) => {
          let body = ''
          res.on('data', (chunk: Buffer) => { body += chunk.toString() })
          res.on('end', () => resolve({ status: res.statusCode ?? 0, body: body.substring(0, 500) }))
        }
      )
      req.on('error', reject)
      req.on('timeout', () => { req.destroy(); reject(new Error('ETIMEDOUT')) })
      req.end()
    })

    return NextResponse.json({
      connected: true,
      status: result.status,
      keyPrefix: key.substring(0, 7),
      body: result.status === 200 ? 'ok' : result.body.substring(0, 200),
    })
  } catch (err) {
    return NextResponse.json({
      connected: false,
      error: String(err),
      keyPrefix: key.substring(0, 7),
    }, { status: 500 })
  }
}
