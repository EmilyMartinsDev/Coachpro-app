// src/hooks/aluno/useFeedback.ts
import { feedbackService } from "@/lib/services/aluno/aluno.feedback.service"
import { useQuery, useMutation } from "@tanstack/react-query"
import type { ListarFeedbacksParams, Feedback, Paginacao } from "@/lib/types"

export function useFeedbackAluno(params: ListarFeedbacksParams = {}) {
  const { data, error, isLoading } = useQuery<Paginacao<Feedback>>({
    queryKey: ['aluno', 'feedbacks', params],
    queryFn: () => feedbackService.alunoListarFeedbacks(params)
  })

  const detalhesFeedback = (feedbackId: string) => {
    return useQuery<Feedback>({
      queryKey: ['aluno', 'feedback', feedbackId],
      queryFn: () => feedbackService.alunoDetalhesFeedback(feedbackId),
      enabled: !!feedbackId
    })
  }

  const enviarFeedback = useMutation({
    mutationFn: (data: any) => feedbackService.alunoEnviarFeedback(data)
  })

  const enviarFotosFeedback = useMutation({
    mutationFn: ({ feedbackId, file }: { feedbackId: string; file: File }) =>
      feedbackService.alunoEnviarFotosFeedback(feedbackId, file)
  })

  const createFeedback = async (formData: any, photos: File[]) => {
    const feedback = await enviarFeedback.mutateAsync(formData)

    if (!feedback || !feedback.id) {
      throw new Error("Feedback inválido: id não encontrado");
    }

    if (photos.length > 0) {
      await Promise.all(
        photos.map(file =>
          enviarFotosFeedback.mutateAsync({
            feedbackId: feedback.id,
            file
          })
        )
      )
    }

    return feedback
  }

  return {
    data,
    error,
    isLoading,
    detalhesFeedback,
    enviarFeedback,
    enviarFotosFeedback,
    createFeedback
  }
}
