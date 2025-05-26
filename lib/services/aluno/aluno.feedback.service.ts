// src/lib/services/aluno/feedback.service.ts
import api from "@/lib/api"
import { Feedback, FotoFeedback, Paginacao } from "@/lib/types";

export const feedbackService = {
  alunoListarFeedbacks: async (): Promise<Paginacao<Feedback>> => {
    const response = await api.get<Paginacao<Feedback>>("/api/aluno/feedbacks");
    return response.data;
  },
  alunoDetalhesFeedback: async (feedbackId: string): Promise<Feedback> => {
    const response = await api.get<Feedback>(`/api/aluno/feedbacks/${feedbackId}`);
    return response.data;
  },
  alunoEnviarFeedback: async (data: Partial<Feedback>): Promise<Feedback> => {
    const response = await api.post<Feedback>("/api/aluno/feedbacks", data);
    return response.data;
  },
  alunoEnviarFotosFeedback: async (feedbackId: string, file: File): Promise<FotoFeedback> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post<FotoFeedback>(`/api/aluno/feedbacks/${feedbackId}/fotos`, formData);
    return response.data;
  },
}