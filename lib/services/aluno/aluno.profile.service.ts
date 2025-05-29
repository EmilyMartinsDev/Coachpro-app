import api from "@/lib/api"
import { Aluno } from "@/lib/types"


class AlunoService {
  async detalhesAluno(): Promise<Aluno> {
    const response = await api.get<Aluno>("/api/aluno/profile/")
    return response.data
  }
}

export const alunoService = new AlunoService()
