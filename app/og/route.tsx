import { ImageResponse } from 'next/og'

export function GET(request: Request) {
  let url = new URL(request.url)
  let title = url.searchParams.get('title') || 'Stoic Park, blog'
  let tags = url.searchParams.get('tags') || ''
  let tagList = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full p-16"
        style={{ backgroundColor: '#1c1b1b' }}
      >
        {/* Top branding */}
        <div tw="flex items-center mb-auto">
          <span
            tw="text-sm font-bold tracking-widest uppercase"
            style={{ color: '#8a8584', letterSpacing: '0.2em' }}
          >
            Stoic Park
          </span>
        </div>

        {/* Title */}
        <div tw="flex flex-col mt-auto mb-8">
          <h1
            tw="text-6xl font-bold tracking-tight leading-tight"
            style={{
              color: '#f0edec',
              lineHeight: 1.15,
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Tags */}
        {tagList.length > 0 && (
          <div tw="flex flex-wrap mb-8" style={{ gap: '8px' }}>
            {tagList.map((tag) => (
              <span
                key={tag}
                tw="flex items-center px-4 py-1 text-sm"
                style={{
                  color: '#8a8584',
                  border: '1px solid #3a3736',
                  borderRadius: '9999px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom accent line */}
        <div
          tw="flex w-full mt-auto"
          style={{
            height: '2px',
            background: 'linear-gradient(to right, #f0edec, transparent)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
