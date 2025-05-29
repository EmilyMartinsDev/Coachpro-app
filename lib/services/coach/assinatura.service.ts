import api from "@/lib/api";
import { Assinatura, ComprovanteAssinatura, ListAssinaturasParams, Paginacao } from "@/lib/types";

class AssinaturaService {
  // Listar assinaturas com filtros
  async listar(params: ListAssinaturasParams): Promise<Paginacao<Assinatura>> {
    const response = await api.get<Paginacao<Assinatura>>('/api/coach/assinaturas', { params });
    return response.data;
  }

  // Criar assinatura
  async criar(alunoId: string, parcelamentoId: string): Promise<Assinatura> {
    const response = await api.post<Assinatura>('/api/coach/assinaturas/aluno/' + alunoId, {
      parcelamentoId
    });
    return response.data;
  }

  // Enviar comprovante
  async enviarComprovante(assinaturaId: string, file: File): Promise<ComprovanteAssinatura> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ComprovanteAssinatura>(
      `/api/coach/assinaturas/${assinaturaId}/comprovante`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // Aprovar assinatura
  async aprovar(assinaturaId: string): Promise<Assinatura> {
    const response = await api.put<Assinatura>(`/api/coach/assinaturas/${assinaturaId}/aprovar`);
    return response.data;
  }

  // Rejeitar assinatura
  async rejeitar(assinaturaId: string): Promise<Assinatura> {
    const response = await api.put<Assinatura>(`/api/coach/assinaturas/${assinaturaId}/rejeitar`);
    return response.data;
  }

  // Detalhes da assinatura
  async detalhes(assinaturaId: string): Promise<Assinatura> {
    const response = await api.get<Assinatura>(`/api/coach/assinaturas/${assinaturaId}`);
    return response.data;
  }
}

export const assinaturaService = new AssinaturaService();