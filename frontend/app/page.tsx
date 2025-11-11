import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-6xl font-bold text-gray-900">
          🍔 Food Delivery App
        </h1>
        <p className="text-xl text-gray-600">
          Order delicious food from your favorite restaurants
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/customer"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Customer App
          </Link>
          <Link
            href="/restaurant"
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Restaurant Dashboard
          </Link>
          <Link
            href="/driver"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Driver App
          </Link>
          <Link
            href="/admin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </div>
  )
}

