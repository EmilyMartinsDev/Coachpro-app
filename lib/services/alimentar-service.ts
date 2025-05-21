import api from "../api"
import type { PlanoAlimentar, CreatePlanoAlimentarRequest } from "../types"

// Ajuste: backend retorna { success: boolean, data: ... }
const AlimentarService = {
  createPlanoAlimentar: async (data: CreatePlanoAlimentarRequest): Promise<PlanoAlimentar> => {
    const response = await api.post<{ success: boolean; data: PlanoAlimentar }>("/api/alimentares", data)
    return response.data.data
  },
}

export default AlimentarService
