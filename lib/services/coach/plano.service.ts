
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

};