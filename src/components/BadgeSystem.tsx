'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

interface Badge {
  id: number
  name: string
  description: string
  icon: string
  achieved: boolean
}

export default function BadgeSystem() {
  const [badges, setBadges] = useState<Badge[]>([])

  useEffect(() => {
    fetchBadges()
  }, [])

  async function fetchBadges() {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
    if (error) console.error('Error fetching badges:', error)
    else setBadges(data || [])
  }

  return (
    <div className = "bg-white p-4 rounded-lg shadow">
      <h2 className = "text-xl font-semibold mb-4">Your Badges</h2>
      <div className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div key = {badge.id} className = {`p-2 text-center ${badge.achieved ? 'opacity-100' : 'opacity-50'}`}>
            <div className = "text-4xl mb-2">{badge.icon}</div>
            <h3 className = "font-medium">{badge.name}</h3>
            <p className = "text-sm text-gray-600">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

