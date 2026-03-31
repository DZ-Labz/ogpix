import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Hello World'
  const description = searchParams.get('description') ?? ''
  const template = searchParams.get('template') ?? 'basic'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          width: '100%',
          height: '100%',
          padding: '60px',
          background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 16,
            fontWeight: 600,
            color: '#a78bfa',
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          OGPix
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#9ca3af',
              maxWidth: 800,
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
