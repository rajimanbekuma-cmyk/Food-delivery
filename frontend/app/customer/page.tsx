'use client'

import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { restaurantAPI } from '@/lib/api'
import { getUser, removeToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CustomerPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if (!userData) {
        router.push('/login')
      } else {
        setUser(userData)
      }
    }
    fetchUser()
  }, [router])

  const { data: restaurants, isLoading } = useQuery(
    ['restaurants', search, selectedCuisine],
    () =>
      restaurantAPI.getAll({
        search,
        cuisine: selectedCuisine,
        isOpen: true,
      }),
    {
      enabled: !!user,
    }
  )

  const handleLogout = () => {
    removeToken()
    router.push('/')
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">🍔 Food Delivery</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Link
                href="/customer/cart"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cart
              </Link>
              <Link
                href="/customer/orders"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Restaurant List */}
        {isLoading ? (
          <div className="text-center py-12">Loading restaurants...</div>
        ) : restaurants?.data?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No restaurants found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants?.data?.map((restaurant: any) => (
              <Link
                key={restaurant._id}
                href={`/customer/restaurant/${restaurant._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {restaurant.image && (
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{restaurant.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-medium">
                        {restaurant.rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {restaurant.estimatedDeliveryTime} min
                    </span>
                  </div>
                  {restaurant.cuisine && restaurant.cuisine.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {restaurant.cuisine.slice(0, 3).map((c: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

