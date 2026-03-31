import { NextRequest, NextResponse } from 'next/server'
import { renderImage } from '@/lib/render'
import { TemplateProps, OutputSize, RenderOptions, TemplateId, TEMPLATES } from '@/lib/types'
import { checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const VALID_TEMPLATES = new Set<TemplateId>(TEMPLATES.map((t) => t.id))
const VALID_SIZES = new Set<OutputSize>(['og', 'twitter', 'instagram'])
const VALID_FORMATS = new Set(['png', 'jpeg'])

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}

function parseFeatures(raw: string | null): string[] | undefined {
  if (!raw) return undefined
  return raw.split('|').map((s) => s.trim()).filter(Boolean)
}

function buildTemplateProps(params: URLSearchParams): TemplateProps {
  const template = params.get('template') ?? 'generic'

  switch (template) {
    case 'blog-cover':
      return {
        template: 'blog-cover',
        title: params.get('title') ?? 'Untitled',
        subtitle: params.get('subtitle') ?? undefined,
        author: params.get('author') ?? undefined,
        theme: params.get('theme') ?? undefined,
      }
    case 'product-launch':
      return {
        template: 'product-launch',
        productName: params.get('productName') ?? params.get('title') ?? 'Product',
        tagline: params.get('tagline') ?? params.get('subtitle') ?? undefined,
        features: parseFeatures(params.get('features')),
        theme: params.get('theme') ?? undefined,
      }
    case 'podcast-episode':
      return {
        template: 'podcast-episode',
        showName: params.get('showName') ?? params.get('title') ?? 'My Podcast',
        episodeTitle: params.get('episodeTitle') ?? params.get('subtitle') ?? 'Episode',
        episodeNumber: params.get('episodeNumber') ? Number(params.get('episodeNumber')) : undefined,
        theme: params.get('theme') ?? undefined,
      }
    case 'event':
      return {
        template: 'event',
        eventName: params.get('eventName') ?? params.get('title') ?? 'Event',
        date: params.get('date') ?? undefined,
        location: params.get('location') ?? undefined,
        speaker: params.get('speaker') ?? undefined,
        theme: params.get('theme') ?? undefined,
      }
    case 'github-card':
      return {
        template: 'github-card',
        repoName: params.get('repoName') ?? params.get('title') ?? 'repo',
        description: params.get('description') ?? params.get('subtitle') ?? undefined,
        stars: params.get('stars') ? Number(params.get('stars')) : undefined,
        forks: params.get('forks') ? Number(params.get('forks')) : undefined,
        language: params.get('language') ?? undefined,
        theme: params.get('theme') ?? undefined,
      }
    default:
      return {
        template: 'generic',
        title: params.get('title') ?? 'Hello World',
        subtitle: params.get('subtitle') ?? undefined,
        theme: params.get('theme') ?? undefined,
      }
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  // ── Rate limiting ──────────────────────────────────────────────────────────
  const ip = getClientIp(req)
  const apiKey = searchParams.get('key') ?? req.headers.get('x-api-key')
  const rl = checkRateLimit(ip, apiKey)

  if (!rl.allowed) {
    const retryAfterSec = Math.ceil(rl.retryAfterMs / 1000)
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `Free tier allows 10 requests per day. Resets in ${Math.ceil(rl.retryAfterMs / 3600000)}h. Upgrade to Pro for unlimited requests: https://ogpix.app/pricing`,
        retryAfter: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil((Date.now() + rl.retryAfterMs) / 1000)),
        },
      }
    )
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  const template = (searchParams.get('template') ?? 'generic') as TemplateId
  if (!VALID_TEMPLATES.has(template)) {
    const validList = TEMPLATES.map((t) => t.id)
    return NextResponse.json(
      {
        error: 'Invalid template',
        message: `Unknown template "${template}". Valid options: ${validList.join(', ')}`,
        validTemplates: validList,
      },
      { status: 400 }
    )
  }

  // Title is required for most templates (fallbacks are used, but warn on generic/blog)
  const title = searchParams.get('title')
  if (!title && (template === 'generic' || template === 'blog-cover')) {
    return NextResponse.json(
      { error: 'Missing required parameter', message: '`title` is required for this template.' },
      { status: 400 }
    )
  }

  const sizeParam = searchParams.get('size') ?? 'og'
  if (!VALID_SIZES.has(sizeParam as OutputSize)) {
    return NextResponse.json(
      {
        error: 'Invalid size',
        message: `Unknown size "${sizeParam}". Valid options: og, twitter, instagram`,
      },
      { status: 400 }
    )
  }

  const formatParam = searchParams.get('format') ?? 'png'
  if (!VALID_FORMATS.has(formatParam)) {
    return NextResponse.json(
      { error: 'Invalid format', message: 'Valid options: png, jpeg' },
      { status: 400 }
    )
  }

  const size = sizeParam as OutputSize
  const format = formatParam as 'png' | 'jpeg'
  const templateProps = buildTemplateProps(searchParams)
  const options: RenderOptions = { size, format, quality: 90 }

  try {
    const buffer = await renderImage(templateProps, options)
    const contentType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
    const remaining = rl.tier === 'free' ? String(rl.remaining) : 'unlimited'

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-RateLimit-Limit': rl.tier === 'free' ? '10' : 'unlimited',
        'X-RateLimit-Remaining': remaining,
        'X-RateLimit-Tier': rl.tier,
      },
    })
  } catch (err) {
    console.error('OG render error:', err)
    return NextResponse.json({ error: 'Failed to render image', message: String(err) }, { status: 500 })
  }
}
