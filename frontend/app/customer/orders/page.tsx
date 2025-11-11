'use client'

import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import { orderAPI } from '@/lib/api'
import { getUser } from '@/lib/auth'
import Link from 'next/link'

export default function OrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

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

  const { data: orders, isLoading } = useQuery(
    'customer-orders',
    () => orderAPI.getAll(),
    {
      enabled: !!user,
      refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    }
  )

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-purple-100 text-purple-800',
      assigned: 'bg-indigo-100 text-indigo-800',
      picked_up: 'bg-pink-100 text-pink-800',
      on_the_way: 'bg-cyan-100 text-cyan-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/customer" className="text-gray-600 hover:text-gray-900">
            ← Back to Restaurants
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

        {isLoading ? (
          <div className="text-center py-12">Loading orders...</div>
        ) : orders?.data?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No orders yet</p>
            <Link
              href="/customer"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.data?.map((order: any) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {order.restaurant?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                  <ul className="space-y-1">
                    {order.items?.map((item: any, idx: number) => (
                      <li key={idx} className="text-sm text-gray-600">
                        {item.quantity}x {item.menuItem?.name} - ${item.price}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">
                      Subtotal: ${order.subtotal?.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Delivery: ${order.deliveryFee?.toFixed(2)}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      Total: ${order.total?.toFixed(2)}
                    </p>
                  </div>
                  {order.status === 'delivered' && !order.rating && (
                    <Link
                      href={`/customer/orders/${order._id}/rate`}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Rate Order
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

