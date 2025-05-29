// src/lib/services/aluno/anamnese.service.ts
import api from "@/lib/api"
import { Anamnese, CreateAnamneseRequest } from "@/lib/types";

export const anamneseService = {
    enviarAnamnese: async (data: CreateAnamneseRequest): Promise<Anamnese> => {
    const response = await api.post<Anamnese>("/api/aluno/anamneses", data);
    return response.data;
  },
    enviarFotoAnamnese: async (data: {file:File, anamneseId:string}): Promise<Anamnese> => {
    const formData = new FormData();
    formData.append('file', data.file);
    const response = await api.post<Anamnese>("/api/aluno/anamneses/"+data.anamneseId,   
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
}