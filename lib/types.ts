// User types
export interface User {
  id: string
  nome: string
  email: string
  tipo: "coach" | "aluno"
}

export interface Coach extends User {
  telefone: string
  dataNascimento: string
  foto?: string | null
  createdAt?: string
  alunos?: Aluno[] // Novo: coach traz alunos aninhados
  planos?:Plano[]
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

// Plan types
export interface Plano {
  id: string
  titulo: string
  descricao?: string
  valor: number
  duracao: number
  coachId: string
  createdAt: string
  updatedAt: string
}

export interface CreatePlanoRequest {
  titulo: string
  descricao?: string
  valor: number
  duracao: number
}

// Subscription types
export interface Assinatura {
  id: string
  alunoId: string
  planoId: string
  dataInicio: string
  dataFim: string
  valor: number
  status: "PENDENTE_APROVACAO" | "PENDENTE" | "ATIVA" | "INATIVA" | "CANCELADA"
  parcela: number
  totalParcelas: number
  comprovante_url?: string
  createdAt: string
  updatedAt: string
  aluno?: Aluno
  plano?: Plano
}

export interface CreateAssinaturaRequest {
  alunoId: string
  planoId: string
  dataInicio: string
  dataFim: string
  valor: number
  status: "PENDENTE_APROVACAO" | "PENDENTE" | "ATIVA"  | "CANCELADA"
  parcela: number
  total_parcelas: number
  comprovante_url?: string
}



export interface CreatePagamentoRequest {
  assinaturaId: string
  valor: number
  dataPagamento: string
  metodo: string
  comprovante?: string
}

// Feedback types
export interface Feedback {
  id: string
  alunoId: string
  peso?: string
  diaFeedback: string
  seguiuPlano: "TOTALMENTE" | "PARCIALMENTE" | "NAO"
  comeuAMais?: string
  refeicoesPerdidas?: string
  refeicaoLivre?: string
  digestaoIntestino?: string
  dificuldadeAlimentos?: string
  periodoMenstrual: boolean
  horasSono?: string
  qualidadeSono: "OTIMA" | "BOA" | "REGULAR" | "RUIM" | "PESSIMA"
  acordouCansado: boolean
  manteveProtocolo: "TOTALMENTE" | "PARCIALMENTE" | "NAO"
  efeitosColaterais?: string
  observacoes?: string
  createdAt: string
  updatedAt: string
  aluno?: Aluno
  resposta?: string
  respondido?: boolean
  fotos?: FotoFeedback[]
}

export interface CreateFeedbackRequest {
  alunoId: string
  peso?: string
  diaFeedback: string
  seguiuPlano: "TOTALMENTE" | "PARCIALMENTE" | "NAO"
  comeuAMais?: string
  refeicoesPerdidas?: string
  refeicaoLivre?: string
  digestaoIntestino?: string
  dificuldadeAlimentos?: string
  periodoMenstrual: boolean
  horasSono?: string
  qualidadeSono: "OTIMA" | "BOA" | "REGULAR" | "RUIM" | "PESSIMA"
  acordouCansado: boolean
  manteveProtocolo: "TOTALMENTE" | "PARCIALMENTE" | "NAO"
  efeitosColaterais?: string
  observacoes?: string
}

export interface FotoFeedback {
  id: string
  feedbackId: string
  url: string
  createdAt: string
  updatedAt: string
}

// Anamnesis types
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

// Training plan types
export interface PlanoTreino {
  id: string
  alunoId: string
  coachId: string
  titulo: string
  descricao?: string
  arquivo_url: string
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
  arquivo_url: any
}

// Meal plan types
export interface PlanoAlimentar {
  id: string
  alunoId: string
  coachId: string
  titulo: string
  descricao?: string
  arquivo_url?: string
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
