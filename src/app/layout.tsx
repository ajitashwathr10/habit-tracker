import './globals.css'
import {Inter} from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Habit Track',
  description: 'Gamification of Habit Tracker',
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang = "en">
      <body className = {inter.className}>
        <div className = "min-h-screen bg-gray-100">
          <header className = "bg-indigo-600 text-white p-4">
            <div className = "container mx-auto flex justify-between items-center">
              <h1 className = "text-2xl font-bold">Habit Tracker</h1>
              <nav>
                <ul className = "flex space-x-4">
                  <li><Link href = "/" className = "hover:text-indigo-200">Dashboard</Link></li>
                  <li><Link href = "/profile" className = "hover:text-indigo-200">Profile</Link></li>
                </ul>
              </nav>
            </div>
          </header>
          <main className = "container mx-auto p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

