import api from "../api"
import type { PlanoTreino, CreatePlanoTreinoRequest } from "../types"

// Ajuste: backend retorna { success: boolean, data: ... }
const TreinoService = {

  createPlanoTreino: async (data: CreatePlanoTreinoRequest): Promise<PlanoTreino> => {
    const response = await api.post<{ success: boolean; data: PlanoTreino }>("/api/treinos", data)
    return response.data.data
  },
}

export default TreinoService
