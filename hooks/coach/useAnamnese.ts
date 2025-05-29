import { useMutation, useQuery } from "@tanstack/react-query";
import { anamneseService, ListarAnamnesesParams } from "@/lib/services/coach/anamnese.service";

export function useListarAnamneses(params?: ListarAnamnesesParams) {
  return useQuery({
    queryKey: ["coach", "anamneses", params],
    queryFn: () => anamneseService.listar(params),
    placeholderData: (previousData) => previousData
  });
}

export function useDetalhesAnamnese(anamneseId: string) {
  return useQuery({
    queryKey: ["coach", "anamnese", anamneseId],
    queryFn: () => anamneseService.detalhes(anamneseId),
    enabled: !!anamneseId
  });
}

