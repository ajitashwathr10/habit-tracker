'use client'

import {useState} from 'react'
import {supabase} from '@/utils/supabase'

export default function AddHabit() {
    const [habitName, setHabitName] = useState('')
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        if(!habitName.trim()) {
            setError('Habit name cannot be empty')
            return
        }
        try {
            const {data, error} = await supabase
                .from('habits')
                .insert([{name: habitName, completed: false, streak: 0}])
                .select()
            if(error) {
                console.error('Supabase error: ', error)
                setError(`Error adding habit: ${error.message}`)
            } else {
                console.log('Habit added successfully: ', data)
                setHabitName('')
                //Trigger a refresh of the HabitList here
            }
        } catch(err) {
            console.error('Unexpected error: ', err)
            setError('An unexpected error occurred')
        }
    }
    return (
        <form onSubmit={handleSubmit} className = "mb-4">
            <div className = 'flex flex-col space-y-2'>
                <div className = 'flex'>
                    <input
                        type = 'text'
                        value = {habitName}
                        onChange = {(e) => setHabitName(e.target.value)}
                        placeholder = "Enter a new habit"
                        className = "flex-grow px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type = "submit"
                        className = "px-4 py-2 text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Add Habit
                    </button>
                </div>
                {error && <p className = 'text-red-500 text-sm'>{error}</p>}
            </div>
        </form>
    )
}
