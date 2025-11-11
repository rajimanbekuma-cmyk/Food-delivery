'use client'

import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import { getUser, removeToken } from '@/lib/auth'
import { orderAPI, restaurantAPI, menuAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function RestaurantDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [restaurant, setRestaurant] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if (!userData || userData.role !== 'restaurant') {
        router.push('/login')
      } else {
        setUser(userData)
        // Fetch restaurant
        const restaurants = await restaurantAPI.getAll()
        const userRestaurant = restaurants.data.data.find(
          (r: any) => r.owner._id === userData.id
        )
        if (userRestaurant) {
          setRestaurant(userRestaurant)
        }
      }
    }
    fetchUser()
  }, [router])

  const { data: orders, refetch } = useQuery(
    'restaurant-orders',
    () => orderAPI.getAll({ status: 'pending,accepted,preparing,ready' }),
    {
      enabled: !!restaurant,
      refetchInterval: 5000, // Refetch every 5 seconds
    }
  )

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderAPI.updateStatus(orderId, status)
      toast.success('Order status updated')
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const handleLogout = () => {
    removeToken()
    router.push('/')
  }

  if (!user || !restaurant) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const pendingOrders = orders?.data?.filter((o: any) =>
    ['pending', 'accepted', 'preparing', 'ready'].includes(o.status)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{restaurant.name}</span>
              <Link
                href="/restaurant/menu"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Manage Menu
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {pendingOrders?.filter((o: any) => o.status === 'pending').length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-orange-600">
              {pendingOrders?.filter((o: any) =>
                ['accepted', 'preparing'].includes(o.status)
              ).length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Ready for Pickup</h3>
            <p className="text-3xl font-bold text-green-600">
              {pendingOrders?.filter((o: any) => o.status === 'ready').length || 0}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Orders</h2>

        {pendingOrders?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No active orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingOrders?.map((order: any) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Customer: {order.customer?.name} ({order.customer?.phone})
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'accepted'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'preparing'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {order.status.toUpperCase()}
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
                  <p className="text-lg font-bold text-gray-900">
                    Total: ${order.total?.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'accepted')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {order.status === 'accepted' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'preparing')}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order._id, 'ready')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Mark Ready
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

