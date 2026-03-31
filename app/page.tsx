import Link from 'next/link'
import { TEMPLATES } from '@/lib/types'

const DEMO_PARAMS = [
  'template=blog-cover&title=How+to+Build+a+SaaS+in+a+Weekend&subtitle=Ship+fast%2C+iterate+faster&author=Alex+Morgan&theme=dark',
  'template=product-launch&productName=OGPix+Pro&tagline=Beautiful+OG+images+in+seconds&features=6+Templates|API+Access|Unlimited+Images|Fast+Rendering&theme=ocean',
  'template=github-card&repoName=acme%2Fawesome-project&description=The+most+useful+open+source+library&stars=12400&forks=1200&language=TypeScript&theme=slate',
  'template=podcast-episode&showName=Dev+%26+Coffee&episodeTitle=Shipping+Your+First+SaaS&episodeNumber=24&theme=sunset',
]

const STEPS = [
  { num: '01', title: 'Pick a template', desc: 'Choose from 6 professionally designed templates for blogs, products, podcasts, events, and more.' },
  { num: '02', title: 'Customize it', desc: 'Add your title, subtitle, colors, and theme. Watch the preview update in real time.' },
  { num: '03', title: 'Download or use the API', desc: 'Download a PNG directly, or use the API URL in your meta tags for dynamic OG images.' },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['10 images/day', 'All 6 templates', 'Web UI generator', 'PNG downloads', '1200×630, Twitter, Square sizes'],
    cta: 'Start for free',
    href: '/create',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '£1',
    period: 'one-time',
    features: ['Unlimited images', 'API access', 'All 6 templates', 'PNG + JPEG output', 'Priority support'],
    cta: 'Upgrade to Pro',
    href: '/api/checkout',
    highlighted: true,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-xl font-bold text-white">OGPix</span>
        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
          <Link href="/create" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Try for free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 text-indigo-300 text-sm px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
          Generate beautiful OG images in seconds
        </div>
        <h1 className="text-6xl font-extrabold tracking-tight leading-tight mb-6 max-w-3xl mx-auto">
          Beautiful Open Graph images,{' '}
          <span className="text-indigo-400">without the design work</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Pick a template, fill in your content, and get a pixel-perfect OG image. Use the web UI or the API — works with any framework.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/create" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors">
            Create your first image →
          </Link>
          <a href="#how-it-works" className="text-gray-400 hover:text-white text-lg transition-colors">
            See how it works
          </a>
        </div>

        {/* Hero preview grid */}
        <div className="mt-16 grid grid-cols-2 gap-4 max-w-4xl mx-auto">
          {DEMO_PARAMS.map((params, i) => (
            <div key={i} className="rounded-xl overflow-hidden ring-1 ring-gray-700 bg-gray-800 aspect-[1200/630]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/og?${params}`}
                alt="OG image example"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-gray-800 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">How it works</h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">Three steps from idea to image, no design tools required.</p>
          <div className="grid grid-cols-3 gap-10">
            {STEPS.map((s) => (
              <div key={s.num} className="flex flex-col gap-4">
                <div className="text-5xl font-extrabold text-indigo-600/40 leading-none">{s.num}</div>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates showcase */}
      <section className="border-t border-gray-800 py-24 bg-gray-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">6 templates, ready to go</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">For blogs, products, podcasts, events, GitHub repos, and more.</p>
          <div className="grid grid-cols-3 gap-4">
            {TEMPLATES.map((t) => (
              <Link key={t.id} href="/create" className="group rounded-xl overflow-hidden ring-1 ring-gray-700 hover:ring-indigo-600 bg-gray-800 transition-all">
                <div className="aspect-[1200/630] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/og?template=${t.id}&title=Example&theme=dark`}
                    alt={`${t.name} template`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 border-t border-gray-700">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">{t.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-gray-800 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">Simple, honest pricing</h2>
          <p className="text-gray-400 text-center mb-16">Start for free. Upgrade when you need the API.</p>
          <div className="grid grid-cols-2 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 flex flex-col gap-6 ${
                  plan.highlighted
                    ? 'bg-indigo-600 ring-2 ring-indigo-400'
                    : 'bg-gray-800 ring-1 ring-gray-700'
                }`}
              >
                <div>
                  <div className={`text-sm font-semibold uppercase tracking-wider mb-2 ${plan.highlighted ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold">{plan.price}</span>
                    <span className={`text-sm ${plan.highlighted ? 'text-indigo-200' : 'text-gray-500'}`}>{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlighted ? 'text-indigo-100' : 'text-gray-300'}`}>
                      <span className={`text-base ${plan.highlighted ? 'text-indigo-200' : 'text-indigo-400'}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center font-semibold py-3 rounded-xl transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800 py-20 bg-indigo-950/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to build better link previews?</h2>
          <p className="text-gray-400 mb-8">Start for free. No credit card required.</p>
          <Link href="/create" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-colors inline-block">
            Get started — it&apos;s free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <span>© {new Date().getFullYear()} OGPix</span>
          <div className="flex gap-6">
            <Link href="/create" className="hover:text-gray-400 transition-colors">Generator</Link>
            <a href="#pricing" className="hover:text-gray-400 transition-colors">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
