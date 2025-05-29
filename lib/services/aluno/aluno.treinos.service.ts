// src/lib/services/aluno/treino.service.ts
import api from "@/lib/api"
import { Paginacao, PlanoTreino } from "@/lib/types";

export const treinoService = {
    listar: async (): Promise<Paginacao<PlanoTreino>> => {
    const response = await api.get<Paginacao<PlanoTreino>>("/api/aluno/treinos/");
    return response.data;
  },
}