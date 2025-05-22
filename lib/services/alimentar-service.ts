import api from "../api"
import type { PlanoAlimentar, CreatePlanoAlimentarRequest } from "../types"

const AlimentarService = {



  getPlanosAlimentar: async () : Promise<PlanoAlimentar[]> => {
    const response = await api.get<{ success: boolean; data: PlanoAlimentar[] }>("/api/planos-alimentares/")
    return response.data.data
  },

  createPlanoAlimentar: async (data: CreatePlanoAlimentarRequest & { arquivo: File }) : Promise<PlanoAlimentar> => {
    const formData = new FormData()
    formData.append("arquivo", data.arquivo)
    formData.append("titulo", data.titulo)
    if (data.descricao) formData.append("descricao", data.descricao)
    formData.append("alunoId", data.alunoId)
    const response = await api.post<{ success: boolean; data: PlanoAlimentar }>("/api/planos-alimentares/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data.data
  },

downloadPlanoAlimentar: async (id: string): Promise<Blob> => {
  const response = await api.get(`/api/planos-alimentares/download/${id}`);
  return response.data; // Aqui já é o Blob!
}
}

export default AlimentarService
