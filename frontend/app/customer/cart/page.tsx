'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { orderAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function CartPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

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

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [router])

  const updateQuantity = (menuItemId: string, change: number) => {
    const newCart = cart
      .map((item) =>
        item.menuItem === menuItemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
      .filter((item) => item.quantity > 0)

    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeItem = (menuItemId: string) => {
    const newCart = cart.filter((item) => item.menuItem !== menuItemId)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    toast.success('Item removed from cart')
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = cart.length > 0 ? 5 : 0 // Assuming $5 delivery fee
  const tax = subtotal * 0.1
  const total = subtotal + deliveryFee + tax

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }

    if (!user?.address?.street) {
      toast.error('Please update your delivery address in profile')
      return
    }

    setLoading(true)

    try {
      // Group items by restaurant
      const restaurantGroups = cart.reduce((acc: any, item: any) => {
        if (!acc[item.restaurantId]) {
          acc[item.restaurantId] = {
            restaurantId: item.restaurantId,
            items: [],
          }
        }
        acc[item.restaurantId].items.push({
          menuItem: item.menuItem,
          quantity: item.quantity,
        })
        return acc
      }, {})

      // Create order for each restaurant
      for (const group of Object.values(restaurantGroups) as any[]) {
        await orderAPI.create({
          restaurant: group.restaurantId,
          items: group.items,
          paymentMethod: 'cash', // Default to cash, can be changed
          deliveryAddress: user.address,
        })
      }

      // Clear cart
      localStorage.removeItem('cart')
      setCart([])
      toast.success('Order placed successfully!')
      router.push('/customer/orders')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/customer"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.menuItem}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.restaurantName}</p>
                    <p className="text-lg font-bold text-red-600">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.menuItem, -1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItem, 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.menuItem)}
                    className="px-4 py-2 text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

