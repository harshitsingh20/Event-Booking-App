"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUsers, getTimeSlots, saveUsers, saveTimeSlots, type User, type TimeSlot, EventCategory } from "../utils/eventUtils"
import UserPreferences from "./components/UserPreferences"
import CalendarView from "./components/CalendarView"
import AdminView from "./components/AdminView"

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const loadedUsers = getUsers()
    const loadedTimeSlots = getTimeSlots()
    setUsers(loadedUsers)
    setTimeSlots(loadedTimeSlots)
    if (loadedUsers.length > 0) {
      setCurrentUser(loadedUsers[0])
    }
  }, [])

  const updateUserPreferences = (userId: string, preferences: EventCategory[]) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, preferences } : user))
    setUsers(updatedUsers)
    saveUsers(updatedUsers)
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, preferences })
    }
  }

  const bookTimeSlot = (slotId: string, userId: string) => {
    const updatedSlots = timeSlots.map((slot) => (slot.id === slotId ? { ...slot, userId } : slot))
    setTimeSlots(updatedSlots)
    saveTimeSlots(updatedSlots)
  }

  const cancelBooking = (slotId: string) => {
    const updatedSlots = timeSlots.map((slot) => (slot.id === slotId ? { ...slot, userId: null } : slot))
    setTimeSlots(updatedSlots)
    saveTimeSlots(updatedSlots)
  }

  const addTimeSlot = (newSlot: TimeSlot) => {
    const updatedSlots = [...timeSlots, newSlot]
    setTimeSlots(updatedSlots)
    saveTimeSlots(updatedSlots)
  }

  const editTimeSlot = (editedSlot: TimeSlot) => {
    const updatedSlots = timeSlots.map((slot) => (slot.id === editedSlot.id ? editedSlot : slot))
    setTimeSlots(updatedSlots)
    saveTimeSlots(updatedSlots)
  }

  const deleteTimeSlot = (slotId: string) => {
    const updatedSlots = timeSlots.filter((slot) => slot.id !== slotId)
    setTimeSlots(updatedSlots)
    saveTimeSlots(updatedSlots)
  }

  const handleUserChange = (userId: string) => {
    const selectedUser = users.find((user) => user.id === userId)
    if (selectedUser) {
      setCurrentUser(selectedUser)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Event Booking App</h1>
        <div className="mb-6">
          <Select onValueChange={handleUserChange} value={currentUser?.id}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Tabs defaultValue="calendar" className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="preferences">User Preferences</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar">
            <CalendarView
              timeSlots={timeSlots}
              currentUser={currentUser}
              bookTimeSlot={bookTimeSlot}
              cancelBooking={cancelBooking}
            />
          </TabsContent>
          <TabsContent value="preferences">
            <UserPreferences currentUser={currentUser} updatePreferences={updateUserPreferences} />
          </TabsContent>
          <TabsContent value="admin">
            <AdminView
              timeSlots={timeSlots}
              users={users}
              addTimeSlot={addTimeSlot}
              editTimeSlot={editTimeSlot}
              deleteTimeSlot={deleteTimeSlot}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

