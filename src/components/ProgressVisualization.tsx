'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function ProgressVisualization() {
    const [level, setLevel] = useState(1)
    const [treeGrowth, setTreeGrowth] = useState(0)

    useEffect(() => {
        fetchProgress()
    }, [])

    async function fetchProgress() {
        const { data, error } = await supabase
            .from('habits')
            .select('completed')
        if (error) console.error('Error fetching progress:', error)
        else {
            const completedHabits = data?.filter(h => h.completed).length || 0
            const totalHabits = data?.length || 1
            setLevel(Math.floor(completedHabits / 5) + 1)
            setTreeGrowth(Math.min(completedHabits / totalHabits, 1))
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
            <div className="flex justify-between items-end">
                <div className="w-1/2">
                    <TreeVisualization growth={treeGrowth} />
                </div>
                <div className="w-1/2 text-center">
                    <CharacterVisualization level={level} />
                    <p className="mt-2">Level {level}</p>
                </div>
            </div>
        </div>
    )
}

function TreeVisualization({ growth }: { readonly growth: number }) {
    return (
        <svg viewBox="0 0 100 100" className="w-full h-auto">
            <path
                d={`M50 100 L50 ${100 - growth * 80} Q${50 - growth * 20} ${80 - growth * 60} ${50 - growth * 40} ${90 - growth * 80} Q${50 - growth * 20} ${100 - growth * 100} 50 ${100 - growth * 80}`}
                fill="none"
                stroke="green"
                strokeWidth="2"
            />
            <path
                d={`M50 100 L50 ${100 - growth * 80} Q${50 + growth * 20} ${80 - growth * 60} ${50 + growth * 40} ${90 - growth * 80} Q${50 + growth * 20} ${100 - growth * 100} 50 ${100 - growth * 80}`}
                fill="none"
                stroke="green"
                strokeWidth="2"
            />
            <circle
                cx="50"
                cy={20 - growth * 15}
                r={5 + growth * 10}
                fill="green"
            />
        </svg>
    )
}

function CharacterVisualization({ level }: { readonly level: number }) {
    return (
        <svg viewBox="0 0 100 100" className="w-full h-auto">
            <circle cx="50" cy="30" r={15 + level} fill="#FFD700" />
            <circle cx="50" cy="30" r={10 + level / 2} fill="#FFA500" />
            <rect x="40" y="50" width="20" height={30 + level * 2} fill="#4169E1" />
            <rect x="35" y="80" width="10" height={15 + level} fill="#4169E1" />
            <rect x="55" y="80" width="10" height={15 + level} fill="#4169E1" />
        </svg>
    )
}

