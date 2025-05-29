import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Assinatura, ComprovanteAssinatura, ListAssinaturasParams } from '@/lib/types';
import { assinaturaService } from '@/lib/services/coach/assinatura.service';

export function useAssinaturas() {
  const queryClient = useQueryClient();

  // Listar assinaturas
  const listarAssinaturas = (params: ListAssinaturasParams) => {
    return useQuery({
      queryKey: ['assinaturas', { ...params }],
      queryFn: () => assinaturaService.listar({ ...params }),
      placeholderData: (prev)=>prev
    });
  };

  // Detalhes da assinatura
  const useDetalhesAssinatura = (assinaturaId: string) => {
    return useQuery({
      queryKey: ['assinatura', assinaturaId],
      queryFn: () => assinaturaService.detalhes(assinaturaId),
      enabled: !!assinaturaId,
    });
  };

  // Criar assinatura
  const criarAssinatura = useMutation({
    mutationFn: ({ alunoId, parcelamentoId }: { alunoId: string; parcelamentoId: string }) =>
      assinaturaService.criar(alunoId, parcelamentoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] });
    },
  });

  // Enviar comprovante
  const enviarComprovante = useMutation({
    mutationFn: ({ assinaturaId, file }: { assinaturaId: string; file: File }) =>
      assinaturaService.enviarComprovante(assinaturaId, file),
    onSuccess: (_, { assinaturaId }) => {
      queryClient.invalidateQueries({ queryKey: ['assinatura', assinaturaId] });
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] });
    },
  });

  // Aprovar assinatura
  const aprovarAssinatura = useMutation({
    mutationFn: (assinaturaId: string) => assinaturaService.aprovar(assinaturaId),
    onSuccess: (_, assinaturaId) => {
      queryClient.invalidateQueries({ queryKey: ['assinatura', assinaturaId] });
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] });
    },
  });

  // Rejeitar assinatura
  const rejeitarAssinatura = useMutation({
    mutationFn: (assinaturaId: string) => assinaturaService.rejeitar(assinaturaId),
    onSuccess: (_, assinaturaId) => {
      queryClient.invalidateQueries({ queryKey: ['assinatura', assinaturaId] });
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] });
    },
  });

  return {
    listarAssinaturas,
    useDetalhesAssinatura,
    criarAssinatura,
    enviarComprovante,
    aprovarAssinatura,
    rejeitarAssinatura,
  };
}