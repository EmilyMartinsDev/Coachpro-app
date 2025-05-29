import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePlanoRequest, Plano } from '@/lib/types';
import { planoService } from '@/lib/services/coach/plano.service';

export function usePlanos() {
  const queryClient = useQueryClient();

  // Listar planos
  const { 
    data: planos, 
    isLoading, 
    isError ,
    error,
  } = useQuery<Plano[]>({
    queryKey: ['planos'],
    queryFn: () => planoService.listarPlanos(),
  });

  // Cadastrar plano
  const cadastrarPlano = useMutation({
    mutationFn: (dados: CreatePlanoRequest) => planoService.cadastrarPlano(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planos'] });
    },
  });


  return {
    planos,
    isLoading,
    isError,
    cadastrarPlano,
 error

  };
}