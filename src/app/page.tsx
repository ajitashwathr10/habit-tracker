import HabitList from '@/components/HabitList'
import ProgressVisualization from '@/components/ProgressVisualization'
import Analytics from '@/components/Analytics'
import BadgeSystem from '@/components/BadgeSystem'
import AddHabit from '@/components/AddHabit'

export default function Home() {
  return (
    <div className = "space-y-8">
      <div className = "bg-white p-6 rounded-lg shadow">
        <h2 className = "text-2xl font-bold mb-4">Welcome to Habit Tracker!</h2>
        <p className = "text-gray-600">Track your habits, earn badges, and level up your life.</p>
      </div>

      <AddHabit />
      <div className = "grid grid-cols-1 md:grid-cols-2 gap-8">
        <HabitList />
        <ProgressVisualization />
      </div>
      <BadgeSystem />
      <Analytics />
    </div>
  )
}

