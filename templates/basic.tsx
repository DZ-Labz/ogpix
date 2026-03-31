import { OGConfig } from '@/lib/types'

export function BasicTemplate({ title, description, siteName }: OGConfig) {
  return (
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
      {siteName && (
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
          {siteName}
        </div>
      )}
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
  )
}
