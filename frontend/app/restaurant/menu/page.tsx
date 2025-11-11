'use client'

import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import { getUser, removeToken } from '@/lib/auth'
import { restaurantAPI, menuAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function RestaurantMenuPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [restaurant, setRestaurant] = useState<any>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true,
    preparationTime: 15,
  })

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if (!userData || userData.role !== 'restaurant') {
        router.push('/login')
      } else {
        setUser(userData)
        const restaurants = await restaurantAPI.getAll()
        const userRestaurant = restaurants.data.data.find(
          (r: any) => r.owner._id === userData.id
        )
        if (userRestaurant) {
          setRestaurant(userRestaurant)
        } else {
          toast.error('Please create a restaurant first')
          router.push('/restaurant')
        }
      }
    }
    fetchUser()
  }, [router])

  const { data: menu, refetch } = useQuery(
    ['menu', restaurant?._id],
    () => menuAPI.getByRestaurant(restaurant._id),
    {
      enabled: !!restaurant?._id,
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await menuAPI.update(editingItem._id, {
          ...formData,
          price: parseFloat(formData.price),
          preparationTime: parseInt(formData.preparationTime),
        })
        toast.success('Menu item updated!')
      } else {
        await menuAPI.create({
          ...formData,
          restaurant: restaurant._id,
          price: parseFloat(formData.price),
          preparationTime: parseInt(formData.preparationTime),
        })
        toast.success('Menu item added!')
      }
      setShowAddForm(false)
      setEditingItem(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        isAvailable: true,
        preparationTime: 15,
      })
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save menu item')
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image: item.image || '',
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime || 15,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return
    try {
      await menuAPI.delete(id)
      toast.success('Menu item deleted!')
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete menu item')
    }
  }

  const toggleAvailability = async (item: any) => {
    try {
      await menuAPI.update(item._id, {
        isAvailable: !item.isAvailable,
      })
      toast.success('Availability updated!')
      refetch()
    } catch (error: any) {
      toast.error('Failed to update availability')
    }
  }

  if (!user || !restaurant) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/restaurant" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Link>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm)
                setEditingItem(null)
                setFormData({
                  name: '',
                  description: '',
                  price: '',
                  category: '',
                  image: '',
                  isAvailable: true,
                  preparationTime: 15,
                })
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              {showAddForm ? 'Cancel' : 'Add Menu Item'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Menu</h1>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preparation Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) =>
                      setFormData({ ...formData, preparationTime: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Available</label>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                {editingItem ? 'Update' : 'Add'} Menu Item
              </button>
            </form>
          </div>
        )}

        {/* Menu Items List */}
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
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      item.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-lg font-bold text-orange-600 mb-4">${item.price}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleAvailability(item)}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    {item.isAvailable ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {menu?.data?.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No menu items yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Add Your First Menu Item
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

