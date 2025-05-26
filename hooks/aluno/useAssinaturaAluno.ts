// src/hooks/aluno/useAssinaturas.ts
import { assinaturaService } from "@/lib/services/aluno/aluno.assinatura.service"
import { useQuery, useMutation } from "@tanstack/react-query"


export function useAssinaturasAluno() {
  const {data, error, isLoading} =  useQuery({
      queryKey: ['aluno', 'assinaturas'],
      queryFn: () => assinaturaService.listar(),
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