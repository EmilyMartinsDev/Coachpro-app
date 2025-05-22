import api from "../api"
import type { PlanoTreino, CreatePlanoTreinoRequest } from "../types"

const TreinoService = {

   getTreinos: async () : Promise<PlanoTreino[]> => {
      const response = await api.get<{ success: boolean; data: PlanoTreino[] }>("/api/planos-treino/")
      return response.data.data
    },
  
  createPlanoTreino: async (data: CreatePlanoTreinoRequest & { arquivo: File }) : Promise<PlanoTreino> => {
    const formData = new FormData()
    formData.append("arquivo", data.arquivo)
    formData.append("titulo", data.titulo)
    if (data.descricao) formData.append("descricao", data.descricao)
    formData.append("alunoId", data.alunoId)
    const response = await api.post<{ success: boolean; data: PlanoTreino }>("/api/planos-treino/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data.data
  },
}

export default TreinoService
