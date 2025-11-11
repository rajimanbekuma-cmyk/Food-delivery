'use client'

import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import { getUser, removeToken } from '@/lib/auth'
import { driverAPI, orderAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function DriverApp() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if (!userData || userData.role !== 'driver') {
        router.push('/login')
      } else {
        setUser(userData)
      }
    }
    fetchUser()
  }, [router])

  const { data: availableOrders, refetch: refetchAvailable } = useQuery(
    'available-orders',
    () => driverAPI.getAvailableOrders(),
    {
      enabled: !!user,
      refetchInterval: 5000,
    }
  )

  const { data: myDeliveries, refetch: refetchDeliveries } = useQuery(
    'my-deliveries',
    () => driverAPI.getMyDeliveries(),
    {
      enabled: !!user,
      refetchInterval: 5000,
    }
  )

  const { data: stats } = useQuery('driver-stats', () => driverAPI.getStats(), {
    enabled: !!user,
  })

  const acceptOrder = async (orderId: string) => {
    try {
      await driverAPI.acceptOrder(orderId)
      toast.success('Order accepted!')
      refetchAvailable()
      refetchDeliveries()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to accept order')
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderAPI.updateStatus(orderId, status)
      toast.success('Status updated!')
      refetchDeliveries()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const handleLogout = () => {
    removeToken()
    router.push('/')
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const activeDeliveries = myDeliveries?.data?.filter((d: any) =>
    ['assigned', 'picked_up', 'on_the_way'].includes(d.status)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Deliveries</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats?.data?.totalDeliveries || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Deliveries</h3>
            <p className="text-3xl font-bold text-orange-600">
              {stats?.data?.pendingDeliveries || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${stats?.data?.totalEarnings?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Active Deliveries */}
        {activeDeliveries && activeDeliveries.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Deliveries</h2>
            <div className="space-y-4">
              {activeDeliveries.map((delivery: any) => (
                <div
                  key={delivery._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Order #{delivery._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Restaurant: {delivery.restaurant?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Customer: {delivery.customer?.name} ({delivery.customer?.phone})
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        delivery.status === 'assigned'
                          ? 'bg-blue-100 text-blue-800'
                          : delivery.status === 'picked_up'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {delivery.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {delivery.status === 'assigned' && (
                      <button
                        onClick={() => updateOrderStatus(delivery._id, 'picked_up')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {delivery.status === 'picked_up' && (
                      <button
                        onClick={() => updateOrderStatus(delivery._id, 'on_the_way')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Start Delivery
                      </button>
                    )}
                    {delivery.status === 'on_the_way' && (
                      <button
                        onClick={() => updateOrderStatus(delivery._id, 'delivered')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Orders */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Orders</h2>
        {availableOrders?.data?.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No available orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableOrders?.data?.map((order: any) => (
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
                      Restaurant: {order.restaurant?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Customer: {order.customer?.name} ({order.customer?.phone})
                    </p>
                    <p className="text-sm text-gray-500">
                      Delivery Fee: ${order.deliveryFee?.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => acceptOrder(order._id)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Accept Delivery
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

