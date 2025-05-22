import api from "../api"
import type { Assinatura, CreateAssinaturaRequest } from "../types"

// Ajuste: backend retorna { success: boolean, data: ... }
const AssinaturaService = {
  getAssinaturas: async (): Promise<Assinatura[]> => {
    const response = await api.get<{ success: boolean; data: Assinatura[] }>("/api/assinaturas")
    return response.data.data
  },

  getAssinaturaById: async (id: string): Promise<Assinatura> => {
    const response = await api.get<{ success: boolean; data: Assinatura }>(`/api/assinaturas/${id}`)
    return response.data.data
  },

  getAssinaturasByAlunoId: async (alunoId: string): Promise<Assinatura[]> => {
    const response = await api.get<{ success: boolean; data: Assinatura[] }>(`/api/assinaturas/aluno/${alunoId}`)
    return response.data.data
  },

  getAssinaturasPendentes: async (): Promise<Assinatura[]> => {
    const response = await api.get<{ success: boolean; data: Assinatura[] }>("/api/assinaturas/pendentes")
    return response.data.data
  },

  getAssinaturasAguardandoAprovacao: async (): Promise<Assinatura[]> => {
    const response = await api.get<{ success: boolean; data: Assinatura[] }>("/api/assinaturas/aguardando-aprovacao")
    return response.data.data
  },

createAssinatura: async (data: CreateAssinaturaRequest | FormData): Promise<Assinatura> => {
  if (data instanceof FormData) {
    const response = await api.post<{ success: boolean; data: Assinatura }>('/api/assinaturas', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } else {
    // Caso não seja FormData, envie como JSON normal
    const response = await api.post<{ success: boolean; data: Assinatura }>('/api/assinaturas', data);
    return response.data.data;
  }
},
  updateAssinatura: async (id: string, data: Partial<Assinatura> | FormData): Promise<Assinatura> => {
    if (data instanceof FormData) {
      const response = await api.put<{ success: boolean; data: Assinatura }>(`/api/assinaturas/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data.data
    } else {
      // Envia como JSON normal
      const response = await api.put<{ success: boolean; data: Assinatura }>(`/api/assinaturas/${id}`, {...data })
      return response.data.data
    }
  },
}

export default AssinaturaService
