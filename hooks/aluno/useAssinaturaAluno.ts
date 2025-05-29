// src/hooks/aluno/useAssinaturas.ts
import { assinaturaService } from "@/lib/services/aluno/aluno.assinatura.service"
import { useQuery, useMutation } from "@tanstack/react-query"

export interface AlunoListAssinaturasParams {
  page?: number;
  pageSize?: number;
  status?: "PENDENTE" | "PENDENTE_APROVACAO" | "CANCELADA" | "ATIVA";
  alunoId?: string;
}


export function useAssinaturasAluno(params:AlunoListAssinaturasParams = {}) {
  const {data, error, isLoading} =  useQuery({
      queryKey: ['aluno', 'assinaturas', params],
      queryFn: () => assinaturaService.listar(params),
    })

  const detalhesAssinatura = (assinaturaId: string) => {
    return useQuery({
      queryKey: ['aluno', 'assinatura', assinaturaId],
      queryFn: () => assinaturaService.alunoDetalhesAssinatura(assinaturaId),
      enabled: !!assinaturaId
    })
  }

  const enviarComprovante = useMutation({
    mutationFn: ({ assinaturaId, file }: { assinaturaId: string; file: File }) => 
      assinaturaService.alunoEnviarComprovante({assinaturaId, file})
  })

  return {
    data,
    error,
    isLoading,
    detalhesAssinatura,
    enviarComprovante
  }
}