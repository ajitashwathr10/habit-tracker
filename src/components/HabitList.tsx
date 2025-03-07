'use client'

import {useState, useEffect} from 'react'
import {supabase} from '@/utils/supabase'
import {useRouter} from 'next/navigation'

interface Habit {
    id: number
    name: string
    completed: boolean
    streak: number
}

export default function HabitList() {
    const [habits, setHabits] = useState<Habit[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchHabits()
    }, [])

    async function fetchHabits() {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('habits')
                .select('*')
                .order('id', { ascending: true })
            if (error) throw error
            setHabits(data || [])
        } catch (error: any) {
            console.error('Error fetching habits:', error)
            setError('Failed to load habits. Please ensure the habits table exists in your database.')
        } finally {
            setLoading(false)
        }
    }

    async function toggleHabit(habit: Habit) {
        try {
            const updatedHabit = {
                ...habit,
                completed: !habit.completed,
                streak: habit.completed ? 0 : habit.streak + 1
            }
            
            const { error } = await supabase
                .from('habits')
                .update(updatedHabit)
                .eq('id', habit.id)
                
            if (error) throw error
            setHabits(habits.map(h => h.id === habit.id ? updatedHabit : h))
            router.refresh()
        } catch (error: any) {
            console.error('Error updating habit:', error)
            setError('Failed to update habit. Please try again.')
        }
    }

    if (error) {
        return (
            <div className = "bg-white p-4 rounded-lg shadow">
                <h2 className = "text-xl font-semibold mb-4">
                    Your Habits
                </h2>
                <p className = "text-red-500">{error}</p>
                <button 
                    onClick = {fetchHabits}
                    className = "mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className = "bg-white p-4 rounded-lg shadow">
            <div className = "flex justify-between items-center mb-4">
                <h2 className = "text-xl font-semibold">
                    Your Habits
                </h2>
                <button 
                    onClick = {fetchHabits}
                    className = "text-sm text-indigo-600 hover:text-indigo-800"
                >
                    Refresh
                </button>
            </div>
            
            {loading ? (
                <p>Loading habits...</p>
            ) : habits.length === 0 ? (
                <p>No habits added yet. Start by adding a new habit!</p>
            ) : (
                <ul>
                    {habits.map(habit => (
                        <li key = {habit.id} className = "mb-4 flex items-center justify-between">
                            <label className = "flex items-center space-x-2">
                                <input
                                    type = "checkbox"
                                    checked = {habit.completed}
                                    onChange = {() => toggleHabit(habit)}
                                    className = "form-checkbox h-5 w-5 text-indigo-600"
                                />
                                <span className = {habit.completed ? 'line-through' : ''}>{habit.name}</span>
                            </label>
                            <span className = "text-sm font-medium bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full">
                                {habit.streak} day streak
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
