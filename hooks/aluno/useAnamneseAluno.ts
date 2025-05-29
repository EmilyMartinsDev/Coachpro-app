// src/hooks/aluno/useAnamnese.ts
import { anamneseService } from "@/lib/services/aluno/aluno.anamnese.service"
import { useMutation } from "@tanstack/react-query"


export function useAnamneseAluno() {
  const enviarAnamnese = useMutation({
    mutationFn: (data: any) => anamneseService.enviarAnamnese(data)
  })

  const enviarFotosAnamnese = useMutation({
    mutationFn: ({ anamneseId, file }: { anamneseId: string; file: File }) =>
      anamneseService.enviarFotoAnamnese({anamneseId, file})
  })


  const createAnamnese = async (formData: any, photos: File[]) => {
    const anamnese = await enviarAnamnese.mutateAsync(formData)

    if (!anamnese || !anamnese.id) {
      throw new Error("Feedback inválido: id não encontrado");
    }

    if (photos.length > 0) {
      await Promise.all(
        photos.map(file =>
          enviarFotosAnamnese.mutateAsync({
            anamneseId: anamnese.id,
            file
          })
        )
      )
    }

    return createAnamnese
  }

  return {
    createAnamnese,
    enviarAnamnese
  }
}