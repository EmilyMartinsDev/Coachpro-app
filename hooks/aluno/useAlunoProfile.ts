
import { alunoService } from "@/lib/services/aluno/aluno.profile.service"
import { Aluno } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"


export function useAluno() {
  const { data, error, isLoading, refetch } = useQuery<Aluno>({
    queryKey: ['aluno', 'detalhes'],
    queryFn: () => alunoService.detalhesAluno()
  })

  return {
    data,
    error,
    isLoading,
    refetch
  }
}
