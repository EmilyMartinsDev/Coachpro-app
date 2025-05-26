// src/hooks/aluno/useAnamnese.ts
import { anamneseService } from "@/lib/services/aluno/aluno.anamnese.service"
import { useMutation } from "@tanstack/react-query"


export function useAnamneseAluno() {
  const enviarAnamnese = useMutation({
    mutationFn: (data: any) => anamneseService.enviarAnamnese(data)
  })

  return {
    enviarAnamnese
  }
}