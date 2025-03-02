'use client'

import {useState, useEffect} from 'react'
import {supabase} from '@/utils/supabase'

interface Habit {
  id: number
  name: string
  completed: boolean
  streak: number
}

export default function ProgressVisualization() {
    const [level, setLevel] = useState(1)
    const [treeGrowth, setTreeGrowth] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchProgress()
    }, [])

    async function fetchProgress() {
        setLoading(true)
        try {
            const {data, error} = await supabase
                .from('habits')
                .select('completed')
                
            if (error) throw error
            if (data) {
                const completedHabits = data.filter(h => h.completed).length || 0
                const totalHabits = data.length || 1
                setLevel(Math.max(1, Math.floor(completedHabits / 5) + 1))
                setTreeGrowth(Math.min(completedHabits / Math.max(totalHabits, 1), 1))
            }
        } catch (error: any) {
            console.error('Error fetching progress:', error)
            setError('Failed to load progress data')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className = "bg-white p-4 rounded-lg shadow">
                <h2 className = "text-xl font-semibold mb-4">
                    Your Progress
                </h2>
                <p>Loading progress...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className = "bg-white p-4 rounded-lg shadow">
                <h2 className = "text-xl font-semibold mb-4">
                    Your Progress
                </h2>
                <p className = "text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className = "bg-white p-4 rounded-lg shadow">
            <h2 className = "text-xl font-semibold mb-4">
                Your Progress
            </h2>
            <div className = "flex justify-between items-end">
                <div className = "w-1/2">
                    <TreeVisualization growth = {treeGrowth}/>
                </div>
                <div className = "w-1/2 text-center">
                    <CharacterVisualization level = {level}/>
                    <p className = "mt-2">Level {level}</p>
                </div>
            </div>
        </div>
    )
}

function TreeVisualization({growth}: {readonly growth: number}) {
    const safeGrowth = Math.max(0, Math.min(1, growth || 0))
    return (
        <svg viewBox = "0 0 100 100" className = "w-full h-auto">
            <path
                d = {`M50 100 L50 ${100 - safeGrowth * 80} Q${50 - safeGrowth * 20} ${80 - safeGrowth * 60} ${50 - safeGrowth * 40} ${90 - safeGrowth * 80} Q${50 - safeGrowth * 20} ${100 - safeGrowth * 100} 50 ${100 - safeGrowth * 80}`}
                fill = "none"
                stroke = "green"
                strokeWidth = "2"
            />
            <path
                d = {`M50 100 L50 ${100 - safeGrowth * 80} Q${50 + safeGrowth * 20} ${80 - safeGrowth * 60} ${50 + safeGrowth * 40} ${90 - safeGrowth * 80} Q${50 + safeGrowth * 20} ${100 - safeGrowth * 100} 50 ${100 - safeGrowth * 80}`}
                fill = "none"
                stroke = "green"
                strokeWidth = "2"
            />
            <circle
                cx = "50"
                cy = {20 - safeGrowth * 15}
                r = {5 + safeGrowth * 10}
                fill = "green"
            />
        </svg>
    )
}

function CharacterVisualization({level}: {readonly level: number}) {
    const safeLevel = Math.max(1, level || 1)
    return (
        <svg viewBox = "0 0 100 100" className="w-full h-auto">
            <circle cx = "50" cy = "30" r = {15 + safeLevel} fill = "#FFD700"/>
            <circle cx = "50" cy = "30" r = {10 + safeLevel / 2} fill = "#FFA500"/>
            <rect x = "40" y = "50" width = "20" height = {30 + safeLevel * 2} fill = "#4169E1"/>
            <rect x = "35" y = "80" width = "10" height = {15 + safeLevel} fill = "#4169E1"/>
            <rect x = "55" y = "80" width = "10" height = {15 + safeLevel} fill = "#4169E1"/>
        </svg>
    )
}
