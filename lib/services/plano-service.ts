import api from "../api"
import type { Plano, CreatePlanoRequest } from "../types"

// Ajuste: backend retorna { success: boolean, data: ... }
const PlanoService = {
  getPlanos: async (): Promise<Plano[]> => {
    const response = await api.get<{ success: boolean; data: Plano[] }>("/api/planos")
    return response.data.data
  },

  getPlanoById: async (id: string): Promise<Plano> => {
    const response = await api.get<{ success: boolean; data: Plano }>(`/api/planos/${id}`)
    return response.data.data
  },

  createPlano: async (data: CreatePlanoRequest): Promise<Plano> => {
    const response = await api.post<{ success: boolean; data: Plano }>("/api/planos", data)
    return response.data.data
  },

  updatePlano: async (id: string, data: Partial<Plano>): Promise<Plano> => {
    const response = await api.put<{ success: boolean; data: Plano }>(`/api/planos/${id}`, data)
    return response.data.data
  },

  deletePlano: async (id: string): Promise<void> => {
    await api.delete(`/api/planos/${id}`)
  },
}

export default PlanoService
