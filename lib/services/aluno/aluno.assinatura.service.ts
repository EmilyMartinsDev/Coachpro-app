// src/lib/services/aluno/assinatura.service.ts
import api from "@/lib/api"
import { Assinatura, ComprovanteAssinatura, ListAssinaturasParams, Paginacao } from "@/lib/types";

export const assinaturaService = {
  listar: async (params?: ListAssinaturasParams): Promise<Paginacao<Assinatura>> => {
    const response = await api.get<Paginacao<Assinatura>>("/api/aluno/assinaturas/", { params });
    return response.data;
  },
  alunoDetalhesAssinatura: async (assinaturaId: string): Promise<Assinatura> => {
    const response = await api.get<Assinatura>(`/api/aluno/assinaturas/${assinaturaId}`);
    return response.data;
  },
  alunoEnviarComprovante:async (data: {file:File, assinaturaId:string}): Promise<Assinatura> => {
    const formData = new FormData();
    formData.append('file', data.file);
    const response = await api.post<Assinatura>(`/api/aluno/assinaturas/${data.assinaturaId}/comprovante`,
        formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}