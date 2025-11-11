'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { orderAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function RateOrderPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const [user, setUser] = useState<any>(null)
  const [order, setOrder] = useState<any>(null)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if (!userData) {
        router.push('/login')
      } else {
        setUser(userData)
        fetchOrder()
      }
    }
    fetchUser()
  }, [router, orderId])

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(orderId)
      setOrder(response.data.data)
    } catch (error: any) {
      toast.error('Failed to load order')
      router.push('/customer/orders')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await orderAPI.rate(orderId, { rating, review })
      toast.success('Thank you for your feedback!')
      router.push('/customer/orders')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit rating')
    } finally {
      setLoading(false)
    }
  }

  if (!user || !order) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/customer/orders" className="text-gray-600 hover:text-gray-900">
            ← Back to Orders
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Rate Your Order</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {order.restaurant?.name}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Items:</h3>
            <ul className="space-y-1">
              {order.items?.map((item: any, idx: number) => (
                <li key={idx} className="text-sm text-gray-600">
                  {item.quantity}x {item.menuItem?.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">Selected: {rating} stars</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder="Share your experience..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      </div>
    </div>
  )
}

