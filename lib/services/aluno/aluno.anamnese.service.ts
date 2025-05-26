// src/lib/services/aluno/anamnese.service.ts
import api from "@/lib/api"
import { Anamnese, CreateAnamneseRequest } from "@/lib/types";

export const anamneseService = {
    enviarAnamnese: async (data: CreateAnamneseRequest): Promise<Anamnese> => {
    const response = await api.post<Anamnese>("/api/aluno/anamneses", data);
    return response.data;
  },
}