import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Aluno, PlanoAlimentar, PlanoTreino } from '@/lib/types';
import { alunoService } from '@/lib/services/coach/alunos.service';

interface ListarAlunosParams {
  search?: string;
  dataNascimento?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
  coachId?: string; // Adicionado coachId nos params
}

interface ListarAlunosResponse {
  total: number;
  page: number;
  pageSize: number;
  data: Aluno[];
}

export function useAlunos(params: ListarAlunosParams = {}) {
  const queryClient = useQueryClient();

  // Listar alunos com paginação e filtros
  const { 
    data: response, 
    isLoading, 
    isFetching 
  } = useQuery<ListarAlunosResponse>({
    queryKey: ['alunos', params],
    queryFn: () => alunoService.listarAlunos(params),
    placeholderData: (previousData) => previousData
  });

  const alunos = response?.data || [];
  const total = response?.total || 0;
  const page = response?.page || 1;
  const pageSize = response?.pageSize || 10;

  // Detalhes do aluno
  const useDetalhesAluno = (alunoId: string) => {
    return useQuery<Aluno>({
      queryKey: ['aluno', alunoId],
      queryFn: () => alunoService.obterDetalhes(alunoId),
      enabled: !!alunoId,
    });
  };

  // Cadastrar aluno
  const cadastrarAluno = useMutation({
    mutationFn: (dados: Omit<Aluno, 'id'> & { coachId: string }) => 
      alunoService.cadastrarAluno(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['alunos', { coachId: params.coachId }] 
      });
    },
  });



  // Anexar plano alimentar
  const anexarPlanoAlimentar = useMutation({
    mutationFn: ({ alunoId, file }: { alunoId: string; file: File }) =>
      alunoService.anexarPlanoAlimentar(alunoId, file),
    onSuccess: (_, { alunoId }) => {
      queryClient.invalidateQueries({ queryKey: ['aluno', alunoId] });
    },
  });

  // Anexar plano de treino
  const anexarPlanoTreino = useMutation({
    mutationFn: ({ alunoId, file }: { alunoId: string; file: File }) =>
      alunoService.anexarPlanoTreino(alunoId, file),
    onSuccess: (_, { alunoId }) => {
      queryClient.invalidateQueries({ queryKey: ['aluno', alunoId] });
    },
  });

  return {
    alunos,
    total,
    page,
    pageSize,
    isLoading,
    isFetching,
    useDetalhesAluno,
    cadastrarAluno,

    anexarPlanoAlimentar,
    anexarPlanoTreino,
  };
}