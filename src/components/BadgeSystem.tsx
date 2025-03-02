'use client'

import {useState, useEffect} from 'react'
import {supabase} from '@/utils/supabase'

interface Badge {
  id: number
  name: string
  description: string
  icon: string
  achieved: boolean
}

const sampleBadges: Badge[] = [
  {id: 1, name: "Early Bird", description: "Complete 5 habits", icon: "🌟", achieved: false},
  {id: 2, name: "Consistent", description: "7-day streak", icon: "🔥", achieved: false},
  {id: 3, name: "Achiever", description: "Complete all habits", icon: "🏆", achieved: false},
  {id: 4, name: "Master", description: "30-day streak", icon: "👑", achieved: false}
];

export default function BadgeSystem() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBadges()
  }, [])

  async function fetchBadges() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
      
      if (error) {
        console.error('Error fetching badges:', error)
        setBadges(sampleBadges)
      } else {
        setBadges(data || sampleBadges)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setBadges(sampleBadges)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className = "bg-white p-4 rounded-lg shadow">
        <h2 className = "text-xl font-semibold mb-4">
          Your Badges
        </h2>
        <p>Loading badges...</p>
      </div>
    )
  }
  return (
    <div className = "bg-white p-4 rounded-lg shadow">
      <h2 className = "text-xl font-semibold mb-4">
        Your Badges
      </h2>
      <div className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div key = {badge.id} className = {`p-2 text-center rounded-lg border ${badge.achieved ? 'bg-indigo-50 border-indigo-200' : 'opacity-50 border-gray-200'}`}>
            <div className = "text-4xl mb-2">{badge.icon}</div>
            <h3 className = "font-medium">{badge.name}</h3>
            <p className = "text-sm text-gray-600">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}