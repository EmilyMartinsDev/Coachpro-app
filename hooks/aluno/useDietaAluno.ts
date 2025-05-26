// src/hooks/aluno/useDieta.ts
import { dietaService } from "@/lib/services/aluno/aluno.dieta.service"
import { useQuery } from "@tanstack/react-query"


export function useDietaAluno() {
  const {data, error, isLoading, isPending}= useQuery({
      queryKey: ['aluno', 'dietas'],
      queryFn: () => dietaService.listar()
    })

  return {
    error,
    data,
    isLoading,
    isPending
  }
}