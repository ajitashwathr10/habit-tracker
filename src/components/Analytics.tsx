'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/utils/supabase'
import { Chart, ChartConfiguration } from 'chart.js/auto'

export default function Analytics() {
    const [currentStreak, setCurrentStreak] = useState(0)
    const [longestStreak, setLongestStreak] = useState(0)
    const [completionRate, setCompletionRate] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const chartRef = useRef<HTMLCanvasElement>(null)
    const chartInstance = useRef<Chart | null>(null)
    useEffect(() => {
        fetchAnalytics()
    }, [])

    async function fetchAnalytics() {
        try {
            const { data, error } = await supabase
                .from('habits')
                .select('*')
            if (error) throw error
            updateAnalytics(data)
            createCompletionChart(data)
        } catch (error: any) {
            console.error('Error fetching analytics:', error)
            setError('Failed to load analytics. Please ensure the habits table exists in your database.')
        }
    }

    function updateAnalytics(habits: any[]) {
        if (!habits || habits.length === 0) {
            setCurrentStreak(0)
            setLongestStreak(0)
            setCompletionRate(0)
            return
        }

        const streak = calculateStreak(habits)
        setCurrentStreak(streak)
        setLongestStreak(Math.max(streak, longestStreak))

        const totalHabits = habits.length
        const completedHabits = habits.filter(h => h.completed).length
        setCompletionRate(Math.round((completedHabits / totalHabits) * 100))
    }

    function calculateStreak(habits: any[]) {
        let streak = 0
        for (const habit of habits) {
            if (habit.completed) {
                streak++
            } else {
                break
            }
        }
        return streak
    }

    function createCompletionChart(habits: any[]) {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy()
            }

            const ctx = chartRef.current.getContext('2d')
            if (ctx) {
                const completedHabits = habits.filter(h => h.completed).length
                const incompleteHabits = habits.length - completedHabits

                const config: ChartConfiguration = {
                    type: 'doughnut',
                    data: {
                        labels: ['Completed', 'Incomplete'],
                        datasets: [{
                            data: [completedHabits, incompleteHabits],
                            backgroundColor: ['#4CAF50', '#FFA000']
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                }

                chartInstance.current = new Chart(ctx, config)
            }
        }
    }

    if (error) {
        return (
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">Habit Completion</h3>
                    <canvas ref={chartRef}></canvas>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">Streak Information</h3>
                    <p>Current Streak: {currentStreak} days</p>
                    <p>Longest Streak: {longestStreak} days</p>
                    <p>Completion Rate: {completionRate}%</p>
                </div>
            </div>
        </div>
    )
}
