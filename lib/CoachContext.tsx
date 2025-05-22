import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useAuth } from "@/hooks/useAuth"
import CoachService from "@/lib/services/coach-service"
import type { Coach } from "@/lib/types"

interface CoachContextType {
  coach: Coach | null
  loading: boolean
  error: string | null
  reload: () => void
}

const CoachContext = createContext<CoachContextType>({
  coach: null,
  loading: true,
  error: null,
  reload: () => {},
})

export const useCoachContext = () => useContext(CoachContext)

export const CoachProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [coach, setCoach] = useState<Coach | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCoach = async () => {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    try {
      const data = await CoachService.getCoachById(user.id)
      setCoach(data)
    } catch (err) {
      setError("Erro ao carregar dados do coach.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoach()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  return (
    <CoachContext.Provider value={{ coach, loading, error, reload: fetchCoach }}>
      {children}
    </CoachContext.Provider>
  )
}
