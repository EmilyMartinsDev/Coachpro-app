
// User types
export interface User {
  id: string
  nome: string
  email: string
  role: "COACH" | "ALUNO"
}
export interface Paginacao<T> {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
}

export interface Coach extends User {
  telefone: string
  dataNascimento: string
  foto?: string | null
  createdAt?: string
  alunos?: Aluno[]
  planos?: Plano[]
}

export interface CoachDetailResponse {
  success: boolean
  data: Coach
}

export interface Aluno {
  id: string
  nome: string
  email: string
  telefone: string
  dataNascimento: string
  createdAt?: string
  coachId?: string
  coach?: CoachSummary
  anamnese?: Anamnese | null
  feedbacks?: Feedback[]
  planosAlimentar?: PlanoAlimentar[]
  planosTreino?: PlanoTreino[]
  assinaturas?: Assinatura[]
  diaFeedback?: string
}

export interface CoachSummary {
  id: string
  nome: string
  email: string
}

export interface AlunoDetailResponse {
  success: boolean
  data: Aluno
}

export interface AlunosResponse {
  sucess: boolean
  data: Aluno[]
}

export interface AlunoResponse {
  sucess: boolean
  data: Aluno
}

// Plano types
export interface Plano {
  id: string
  titulo: string
  descricao?: string
  coachId: string
  createdAt: string
  updatedAt: string
  parcelamento?: Parcelamento[]
}

export interface CreatePlanoRequest {
  titulo: string
  descricao?: string
  valor: number
  duracao: number
}

// Parcelamento types
export interface Parcelamento {
  id: string
  planoId: string
  valorParcela: number
  quantidadeParcela: number
  plano?: Plano
  assinaturas?: Assinatura[]
}



export interface Assinatura {
  id: string;
  alunoId: string;
  parcelamentoId: string;
  status: 'PENDENTE' | 'PENDENTE_APROVACAO' | 'ATIVA' | 'CANCELADA';
  comprovante_url?: string | null;
  dataInicio?: string; // Pode ser Date se estiver convertendo
  dataFim?: string;
  parcela: number;
  createdAt: string;
  updatedAt: string;
  parcelamento: Parcelamento;
}

export interface ComprovanteAssinatura {
  url: string;
  assinaturaId: string;
}

export interface ListAssinaturasParams {
  coachId?: string;
  alunoId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}


export interface CreateAssinaturaRequest {
  alunoId: string
  parcelamentoId: string
  dataInicio?: string
  dataFim?: string
  status: "PENDENTE_APROVACAO" | "PENDENTE" | "ATIVA" | "CANCELADA"
  parcela: number
  comprovante_url?: string
}

export interface CreatePagamentoRequest {
  assinaturaId: string
  valor: number
  dataPagamento: string
  metodo: string
  comprovante?: string
}

export interface Feedback {
  id: string;
  alunoId: string;
  coachId: string;
  peso?: string;
  diaFeedback: string;
  seguiuPlano: 'TOTALMENTE' | 'PARCIALMENTE' | 'NAO';
  comeuAMais?: string;
  refeicoesPerdidas?: string;
  refeicaoLivre?: string;
  digestaoIntestino?: string;
  dificuldadeAlimentos?: string;
  periodoMenstrual: boolean;
  horasSono?: string;
  qualidadeSono: 'OTIMA' | 'BOA' | 'REGULAR' | 'RUIM' | 'PESSIMA';
  acordouCansado: boolean;
  manteveProtocolo: 'TOTALMENTE' | 'PARCIALMENTE' | 'NAO';
  efeitosColaterais?: string;
  observacoes?: string;
  respondido: boolean;
  respostaCoach?: string;
  fotos?: FotoFeedback[];
  createdAt: Date;
  updatedAt: Date;
  aluno:{
    id:string
    nome:string
  }
}

export interface FotoFeedback {
  id: string;
  feedbackId: string;
  url: string;
  createdAt: Date;
}

export interface ListarFeedbacksParams {
  alunoId?: string;
  respondido?: boolean;
  page?: number;
  pageSize?: number;
  dataInicio?: string;
  dataFim?: string;
  search?:string
}


export interface ResponderFeedbackDTO {
  respostaCoach: string;
}

// Anamnese types
export interface Anamnese {
  id: string
  alunoId: string
  nomeCompleto: string
  instagram: string
  email: string
  cpf: string
  endereco: string
  dataNascimento: string
  dataPreenchimento: string
  altura?: string
  peso?: string
  rotina?: string
  objetivos?: string
  tempoTreino?: string
  modalidade?: string
  divisaoTreino?: string
  cardio?: string
  alimentacaoDiaria?: string
  alimentosPreferidos?: string
  possuiExames: boolean
  qtdRefeicoes?: string
  evolucaoRecente?: string
  dificuldades?: string
  createdAt: string
  updatedAt: string
  aluno?: Aluno
}

export interface CreateAnamneseRequest {
  alunoId: string
  nomeCompleto: string
  instagram: string
  email: string
  cpf: string
  endereco: string
  dataNascimento: string
  dataPreenchimento: string
  altura?: string
  peso?: string
  rotina?: string
  objetivos?: string
  tempoTreino?: string
  modalidade?: string
  divisaoTreino?: string
  cardio?: string
  alimentacaoDiaria?: string
  alimentosPreferidos?: string
  possuiExames: boolean
  qtdRefeicoes?: string
  evolucaoRecente?: string
  dificuldades?: string
}

// PlanoTreino types
export interface PlanoTreino {
  id: string
  alunoId: string
  coachId: string
  titulo: string
  descricao?: string
  arquivo_url?: string | null
  createdAt: string
  updatedAt: string
  aluno?: Aluno
  coach?: Coach
}

export interface CreatePlanoTreinoRequest {
  alunoId: string
  coachId: string
  titulo: string
  descricao?: string
  arquivo: any
}

// PlanoAlimentar types
export interface PlanoAlimentar {
  id: string
  alunoId: string
  coachId: string
  titulo: string
  descricao?: string
  arquivo_url?: string | null
  createdAt: string
  updatedAt: string
  aluno?: Aluno
  coach?: Coach
}

export interface CreatePlanoAlimentarRequest {
  alunoId: string
  coachId: string
  titulo: string
  descricao?: string
  arquivo_url?: any
}
