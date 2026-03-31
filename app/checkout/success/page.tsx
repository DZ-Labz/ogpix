import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="max-w-md text-center px-6">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold mb-4">Welcome to Pro!</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Payment confirmed. Your API key will be emailed to you shortly.
          You can use it as a query param <code className="bg-gray-800 px-1.5 py-0.5 rounded text-indigo-300">?key=your_key</code> or the{' '}
          <code className="bg-gray-800 px-1.5 py-0.5 rounded text-indigo-300">X-Api-Key</code> header.
        </p>
        <Link href="/create" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors inline-block">
          Start creating images →
        </Link>
      </div>
    </div>
  )
}
