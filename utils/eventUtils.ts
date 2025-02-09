import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns"

export type EventCategory = "Cat 1" | "Cat 2" | "Cat 3"

export interface TimeSlot {
  id: string
  category: EventCategory
  start: Date
  end: Date
  userId: string | null
}

export interface User {
  id: string
  name: string
  preferences: EventCategory[]
}

// Initialize with multiple users
const initialUsers: User[] = [
  {
    id: "1",
    name: "GrzegorzJan",
    preferences: ["Cat 1", "Cat 2"],
  },
  {
    id: "2",
    name: "Harshit Singh",
    preferences: ["Cat 1","Cat 2", "Cat 3"],
  },
  {
    id: "3",
    name: "Alice Johnson",
    preferences: ["Cat 1", "Cat 2","Cat 3"],
  },
]

const initialTimeSlots: TimeSlot[] = []

// Helper functions
export const getTimeSlots = (): TimeSlot[] => {
  const storedSlots = localStorage.getItem("timeSlots")
  if (storedSlots) {
    return JSON.parse(storedSlots, (key, value) => {
      if (key === "start" || key === "end") {
        return new Date(value)
      }
      return value
    })
  }
  return initialTimeSlots
}

export const saveTimeSlots = (slots: TimeSlot[]) => {
  localStorage.setItem("timeSlots", JSON.stringify(slots))
}

export const getUsers = (): User[] => {
  const storedUsers = localStorage.getItem("users")
  return storedUsers ? JSON.parse(storedUsers) : initialUsers
}

export const saveUsers = (users: User[]) => {
  localStorage.setItem("users", JSON.stringify(users))
}

export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }) // Start week on Monday
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
}

export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd")
}

