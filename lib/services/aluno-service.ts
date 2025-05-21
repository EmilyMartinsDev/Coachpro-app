import api from "../api"
import type { Aluno, AlunoResponse, AlunosResponse } from "../types"

// Ajuste: backend retorna { success: boolean, data: ... }
const AlunoService = {
  getAlunoById: async (id: string): Promise<Aluno> => {
    const response = await api.get<{ success: boolean; data: Aluno }>(`/api/alunos/${id}`)
    return response.data.data
  },

  getAlunosByCoachId: async (coachId: string): Promise<Aluno[]> => {
    const response = await api.get<{ success: boolean; data: Aluno[] }>(`/api/alunos/coach/${coachId}`)
    return response.data.data
  },

  updateAluno: async (id: string, data: Partial<Aluno>): Promise<Aluno> => {
    const response = await api.put<{ success: boolean; data: Aluno }>(`/api/alunos/${id}`, data)
    return response.data.data
  },
}

export default AlunoService
