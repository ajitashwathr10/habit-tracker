'use client'

import {useEffect} from 'react'

export default function NotificationSystem() {
    useEffect(() => {
        if('Notification' in window) {
            Notification.requestPermission()
        }
        const interval = setInterval(checkAndNotify, 1000 * 60 * 60)
        return () => clearInterval(interval)
    }, [])

    function checkAndNotify() {
        if(Notification.permission === 'granted') {
            const now = new Date()
            if(now.getHours() === 20) {
                new Notification('Habit Tracker', {
                    body: 'Don\'t forgot to complete your habits for today!',
                    icon: '/path/icon.png'
                })
            }
        }
    }
    return null
}