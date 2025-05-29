import api from "@/lib/api";
import { Feedback, ListarFeedbacksParams, Paginacao, ResponderFeedbackDTO } from "@/lib/types";

class FeedbackService {
  // Listar feedbacks com filtros
  async listar(params: ListarFeedbacksParams): Promise<Paginacao<Feedback>> {
    const response = await api.get<Paginacao<Feedback>>('/api/coach/feedbacks', { params });
    return response.data;
  }

  // Responder a um feedback
  async responder(feedbackId: string, data: ResponderFeedbackDTO): Promise<Feedback> {
    const response = await api.patch<Feedback>(`/api/coach/feedbacks/responder/${feedbackId}`, data);
    return response.data;
  }

  // Obter detalhes de um feedback
  async detalhes(feedbackId: string): Promise<Feedback> {
    const response = await api.get<Feedback>(`/api/coach/feedbacks/${feedbackId}`);
    return response.data;
  }
}

export const feedbackService = new FeedbackService();