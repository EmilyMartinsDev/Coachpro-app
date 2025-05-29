// src/lib/services/aluno/dieta.service.ts
import api from "@/lib/api"
import { Paginacao, PlanoAlimentar } from "@/lib/types";

export const dietaService = {
  listar: async (): Promise<Paginacao<PlanoAlimentar>> => {
    const response = await api.get<Paginacao<PlanoAlimentar>>("/api/aluno/dietas");
    return response.data;
  },
}