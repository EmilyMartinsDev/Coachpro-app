import api from "@/lib/api";


export interface ListarAnamnesesParams {
  search?: string;
  page?: number;
  alunoId?: string;
  dataInicio?: string;
  dataFim?: string;
  page_size?: number;
  analisado?: boolean;
}

export interface Anamnese {
  id: string;
  alunoId: string;
  data: string;
  analisado: boolean;
  [key: string]: any;
}

export interface Paginacao<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
}

export const anamneseService = {
  listar: async (params?: ListarAnamnesesParams): Promise<Paginacao<Anamnese>> => {
    const response = await api.get<Paginacao<Anamnese>>("/api/coach/anamneses/", { params });
    return response.data;
  },

  detalhes: async (anamneseId: string): Promise<Anamnese> => {
    const response = await api.get<Anamnese>(`/api/coach/anamneses/${anamneseId}`);
    return response.data;
  },
  

};
