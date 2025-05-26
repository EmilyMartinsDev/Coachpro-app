
import api from '@/lib/api';
import { CreatePlanoRequest, Plano } from '@/lib/types';

export const planoService = {
  async cadastrarPlano(dados: CreatePlanoRequest) {
    const response = await api.post('/api/coach/planos/', dados);
    return response.data;
  },

  async listarPlanos() {
    const response = await api.get(`/api/coach/planos/`);
    return response.data;
  },

//   async atualizarPlano(id: string, dados: Partial<Plano>) {
//     const response = await axios.put(`/api/coach/planos/${id}`, dados);
//     return response.data;
//   },

//   async deletarPlano(id: string) {
//     const response = await axios.delete(`/api/coach/planos/${id}`);
//     return response.data;
//   }
};