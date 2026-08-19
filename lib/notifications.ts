export interface AppNotification {
    id: string
    title: string
    message: string
    time: string
    read: boolean
  }
  
  // Get all notifications for the user
  export const getNotifications = (email: string): AppNotification[] => {
    if (typeof window === "undefined" || !email) return []
    try {
      const data = localStorage.getItem(`notifications_${email}`)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  export const clearNotifications = (email: string) => {
    if (typeof window === "undefined" || !email) return
    localStorage.removeItem(`notifications_${email}`)
  }
  
  // Add a new notification
  export const addNotification = (email: string, title: string, message: string) => {
    if (typeof window === "undefined" || !email) return
    const current = getNotifications(email)
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    }
    localStorage.setItem(`notifications_${email}`, JSON.stringify([newNotif, ...current]))
  }
  
  // Mark all as read
  export const markNotificationsAsRead = (email: string) => {
    if (typeof window === "undefined" || !email) return
    const current = getNotifications(email)
    const updated = current.map(n => ({ ...n, read: true }))
    localStorage.setItem(`notifications_${email}`, JSON.stringify(updated))
  }