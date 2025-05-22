import api from "../api"
import type { Feedback, FotoFeedback, CreateFeedbackRequest } from "../types"

const FeedbackService = {
  getFeedbacks: async (): Promise<Feedback[]> => {
    const response = await api.get<Feedback[]>("/api/feedbacks")
    return response.data
  },

  getFeedbackById: async (id: string): Promise<Feedback> => {
    const response = await api.get<Feedback>(`/api/feedbacks/${id}`)
    return response.data
  },

  getFeedbacksByAlunoId: async (alunoId: string): Promise<Feedback[]> => {
    const response = await api.get<Feedback[]>(`/api/feedbacks/aluno/${alunoId}`)
    return response.data
  },

  createFeedback: async (data: CreateFeedbackRequest): Promise<Feedback> => {
    debugger
    const response = await api.post<{success: boolean, data: Feedback}>("/api/feedbacks", data)
    console.log("Response from createFeedback:", response)
    return response.data.data
  },

  // This would actually be a separate upload endpoint in a real implementation
uploadFeedbackPhoto: async (feedbackId: string, file: File): Promise<FotoFeedback> => {
  const formData = new FormData()
  formData.append("file", file) // deve ser exatamente isso

  const response = await api.post<{ success: boolean; data: FotoFeedback }>(
    `/api/feedbacks/${feedbackId}/photos`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data.data
},

  getFeedbackPhotos: async (feedbackId: string): Promise<FotoFeedback[]> => {
    const response = await api.get<FotoFeedback[]>(`/api/feedbacks/${feedbackId}/photos`)
    return response.data
  },

  updateFeedback: async (id: string, data: Partial<Feedback>): Promise<Feedback> => {
    const response = await api.put<{ success: boolean; data: Feedback }>(`/api/feedbacks/${id}/responder`, data)
    return response.data.data
  }
}

export default FeedbackService
