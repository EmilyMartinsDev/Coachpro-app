import api from "../api"
import type { Coach } from "../types"

// Ajuste: backend retorna { success: boolean, data: ... }
const CoachService = {
  getAllCoachs: async (): Promise<Coach[]> => {
    const response = await api.get<{ success: boolean; data: Coach[] }>("/api/coachs")
    return response.data.data
  },

  getCoachById: async (id: string): Promise<Coach> => {
    const response = await api.get<{ success: boolean; data: Coach }>(`/api/coachs/${id}`)
    return response.data.data
  },

  updateCoach: async (id: string, data: Partial<Coach>): Promise<Coach> => {
    const response = await api.put<{ success: boolean; data: Coach }>(`/api/coachs/${id}`, data)
    return response.data.data
  },
}

export default CoachService
