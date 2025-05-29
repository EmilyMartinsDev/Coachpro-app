import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Feedback, ListarFeedbacksParams, ResponderFeedbackDTO } from '@/lib/types';
import { feedbackService } from '@/lib/services/coach/feedback.service';

export function useFeedbacks() {
  const queryClient = useQueryClient();

  // Listar feedbacks
  const listarFeedbacks = (params: Omit<ListarFeedbacksParams, 'coachId'>) => {
    return useQuery({
      queryKey: ['feedbacks', { ...params}],
      queryFn: () => feedbackService.listar({ ...params }),
        placeholderData: (previousData) => previousData
    });
  };

  // Detalhes do feedback
  const useDetalhesFeedback = (feedbackId: string) => {
    return useQuery({
      queryKey: ['feedback', feedbackId],
      queryFn: () => feedbackService.detalhes(feedbackId),
      enabled: !!feedbackId,
    });
  };

  // Responder feedback
  const responderFeedback = useMutation({
    mutationFn: ({ feedbackId, data }: { feedbackId: string; data: ResponderFeedbackDTO }) =>
      feedbackService.responder(feedbackId, data),
    onSuccess: (_, { feedbackId }) => {
      queryClient.invalidateQueries({ queryKey: ['feedback', feedbackId] });
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    },
  });

  return {
    listarFeedbacks,
    useDetalhesFeedback,
    responderFeedback,
  };
}