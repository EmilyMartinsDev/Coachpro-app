
import { treinoService } from "@/lib/services/aluno/aluno.treinos.service"
import { useQuery } from "@tanstack/react-query"


export function useTreinoAluno() {
  const {data, isLoading, error} =  useQuery({
      queryKey: ['aluno', 'treinos'],
      queryFn: () => treinoService.listar()
    })

  return {
    data,
    error,
    isLoading
  }
}