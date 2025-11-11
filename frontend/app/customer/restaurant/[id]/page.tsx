'use client'

import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams, useRouter } from 'next/navigation'
import { restaurantAPI, menuAPI } from '@/lib/api'
import { getUser } from '@/lib/auth'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function RestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.id as string
  const [user, setUser] = useState<any>(null)
  const [cart, setCart] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')

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

  const { data: restaurant } = useQuery(
    ['restaurant', restaurantId],
    () => restaurantAPI.getById(restaurantId),
    { enabled: !!restaurantId }
  )

  const { data: menu } = useQuery(
    ['menu', restaurantId, selectedCategory],
    () =>
      menuAPI.getByRestaurant(restaurantId, {
        category: selectedCategory,
        isAvailable: true,
      }),
    { enabled: !!restaurantId }
  )

  const addToCart = (item: any) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.menuItem === item._id && cartItem.restaurantId === restaurantId
    )

    let newCart
    if (existingItem) {
      newCart = cart.map((cartItem) =>
        cartItem.menuItem === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    } else {
      newCart = [
        ...cart,
        {
          menuItem: item._id,
          restaurantId,
          restaurantName: restaurant?.data?.name,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        },
      ]
    }

    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    toast.success('Added to cart!')
  }

  const categories = Array.from(
    new Set(menu?.data?.map((item: any) => item.category) || [])
  )

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/customer" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <Link
              href="/customer/cart"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 relative"
            >
              Cart ({cart.length})
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Restaurant Info */}
        {restaurant?.data && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {restaurant.data.name}
            </h1>
            <p className="text-gray-600 mb-4">{restaurant.data.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="font-medium">
                  {restaurant.data.rating?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <span className="text-gray-500">
                {restaurant.data.estimatedDeliveryTime} min delivery
              </span>
              <span className="text-gray-500">
                ${restaurant.data.deliveryFee} delivery fee
              </span>
            </div>
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === ''
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map((category: any) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu?.data?.map((item: any) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-red-600">${item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {menu?.data?.length === 0 && (
          <div className="text-center py-12 text-gray-500">No menu items available</div>
        )}
      </div>
    </div>
  )
}

