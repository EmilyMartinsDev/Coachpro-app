import api from "@/lib/api";
import { Aluno, CreateAlunoRequest, Paginacao, PlanoAlimentar, PlanoTreino } from "@/lib/types";


interface ListarAlunosParams {
  search?: string;
  dataNascimento?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

class AlunoService {
  // Listar todos os alunos do coach com paginação
  async listarAlunos( params: ListarAlunosParams = {}): Promise<Paginacao<Aluno>> {
    const response = await api.get<Paginacao<Aluno>>(`/api/coach/alunos/`, { params });
    return response.data;
  }

  // Obter detalhes de um aluno específico
  async obterDetalhes(alunoId: string): Promise<Aluno> {
    const response = await api.get<Aluno>(`/api/coach/alunos/detalhes/${alunoId}`);
    return response.data;
  }

  // Cadastrar novo aluno
  async cadastrarAluno(dados: CreateAlunoRequest): Promise<Aluno> {
    const response = await api.post<Aluno>('/api/coach/alunos/', dados);
    return response.data;
  }

  // Anexar plano alimentar
  async anexarPlanoAlimentar(alunoId: string, file: File): Promise<PlanoAlimentar> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<PlanoAlimentar>(
      `/api/coach/alunos/${alunoId}/anexar-dieta/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  }

  // Anexar plano de treino
  async anexarPlanoTreino(alunoId: string, file: File): Promise<PlanoTreino> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<PlanoTreino>(
      `/api/coach/alunos/${alunoId}/anexar-treino/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  }
}

export const alunoService = new AlunoService();
