'use client'

import {useEffect, useState} from 'react'

export default function NotificationSystem() {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
        if (typeof window !== 'undefined') {
            if ('Notification' in window) {
                Notification.requestPermission()
            }
            const interval = setInterval(checkAndNotify, 1000 * 60 * 60) 
            return () => clearInterval(interval)
        }
    }, [])

    function checkAndNotify() {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                const now = new Date()
                if (now.getHours() === 20) {
                    new Notification('Habit Tracker', {
                        body: 'Don\'t forget to complete your habits for today!',
                        icon: '/favicon.ico'
                    })
                }
            }
        }
    }
    return null
}