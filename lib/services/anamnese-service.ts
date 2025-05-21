import api from "../api"
import type { Anamnese, CreateAnamneseRequest } from "../types"
import axios from "axios"

// Ajuste: backend retorna { success: boolean, data: ... }
const AnamneseService = {
  getAnamneseByAlunoId: async (alunoId: string): Promise<Anamnese | null> => {
    try {
      const response = await api.get<{ success: boolean; data: Anamnese }>(`/api/anamnese/aluno/${alunoId}`)
      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null // Aluno doesn't have anamnese yet
      }
      throw error
    }
  },

  createAnamnese: async (data: CreateAnamneseRequest): Promise<Anamnese> => {
    const response = await api.post<{ success: boolean; data: Anamnese }>("/api/anamnese", data)
    return response.data.data
  },
}

export default AnamneseService
