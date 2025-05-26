// src/hooks/aluno/useFeedback.ts
import { feedbackService } from "@/lib/services/aluno/aluno.feedback.service"
import { useQuery, useMutation } from "@tanstack/react-query"


export function useFeedbackAluno() {
  const {data, error, isLoading} =  useQuery({
      queryKey: ['aluno', 'feedbacks'],
      queryFn: () => feedbackService.alunoListarFeedbacks()
    })

  const detalhesFeedback = (feedbackId: string) => {
    return useQuery({
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

  return {
    data,
    error,
    isLoading,
    detalhesFeedback,
    enviarFeedback,
    enviarFotosFeedback
  }

}