import { v4 as uuidv4 } from "uuid"
import type { Coach, Aluno, Plano, Assinatura, PlanoTreino, PlanoAlimentar, Feedback, FotoFeedback } from "./types"

// Simulação de armazenamento de dados
let mockCoach: Coach = {
  id: uuidv4(),
  nome: "João Silva",
  email: "joao.silva@exemplo.com",
  telefone: "(11) 99999-9999",
  dataNascimento: "1985-05-15",
  foto: "/placeholder.svg?height=200&width=200",
}

const mockAlunos: Aluno[] = [
  {
    id: uuidv4(),
    nome: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    telefone: "(11) 98888-8888",
    dataNascimento: "1990-10-20",
    coachId: mockCoach.id,
  },
  {
    id: uuidv4(),
    nome: "Pedro Santos",
    email: "pedro.santos@exemplo.com",
    telefone: "(11) 97777-7777",
    dataNascimento: "1988-03-25",
    coachId: mockCoach.id,
  },
  {
    id: uuidv4(),
    nome: "Ana Costa",
    email: "ana.costa@exemplo.com",
    telefone: "(11) 96666-6666",
    dataNascimento: "1995-07-12",
    coachId: mockCoach.id,
  },
]

const mockPlanos: Plano[] = [
  {
    id: uuidv4(),
    titulo: "Plano Básico",
  },
  {
    id: uuidv4(),
    titulo: "Plano Premium",
  },
  {
    id: uuidv4(),
    titulo: "Plano Anual",
  },
]

// Função para gerar data de vencimento das parcelas
const gerarDataVencimento = (dataInicio: string, parcela: number, totalParcelas: number) => {
  const inicio = new Date(dataInicio)
  const mesesPorParcela = Math.ceil(12 / totalParcelas)
  const novaData = new Date(inicio)
  novaData.setMonth(inicio.getMonth() + (parcela - 1) * mesesPorParcela)
  return novaData.toISOString()
}

// Adicionar pagamentos e parcelas às assinaturas
const mockAssinaturas: Assinatura[] = [
  // Assinatura ATIVA (todas as parcelas pagas e aprovadas)
  {
    id: uuidv4(),
    alunoId: mockAlunos[0].id,
    planoId: mockPlanos[1].id,
    criadoEm: new Date().toISOString(),
    comprovante_pagamento: "/placeholder.svg?height=300&width=200",
    status: "ATIVA",
    dataInicio: new Date().toISOString(),
    dataFim: new Date(new Date().setMonth(new Date().getMonth() + 4)).toISOString(),
    valor: 400,
    parcela: 2,
    totalParcelas: 2,
    pagamentos: [
      {
        id: uuidv4(),
        parcela: 1,
        data: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
        comprovante_url: "/placeholder.svg?height=300&width=200",
        aprovado: true,
        dataVencimento: gerarDataVencimento(new Date().toISOString(), 1, 2),
      },
      {
        id: uuidv4(),
        parcela: 2,
        data: new Date().toISOString(),
        comprovante_url: "/placeholder.svg?height=300&width=200",
        aprovado: true,
        dataVencimento: gerarDataVencimento(new Date().toISOString(), 2, 2),
      },
    ],
  },

  // Assinatura PENDENTE (parcela ainda não venceu)
  {
    id: uuidv4(),
    alunoId: mockAlunos[0].id,
    planoId: mockPlanos[1].id,
    criadoEm: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    comprovante_pagamento: "/placeholder.svg?height=300&width=200",
    status: "PENDENTE",
    dataInicio: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    dataFim: new Date(new Date().setMonth(new Date().getMonth() + 5)).toISOString(),
    valor: 600,
    parcela: 1,
    totalParcelas: 6,
    pagamentos: [
      {
        id: uuidv4(),
        parcela: 1,
        data: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
        comprovante_url: "/placeholder.svg?height=300&width=200",
        aprovado: true,
        dataVencimento: gerarDataVencimento(
          new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
          1,
          6,
        ),
      },
      // A próxima parcela ainda não venceu (vence em 30 dias)
      {
        id: uuidv4(),
        parcela: 2,
        data: null,
        comprovante_url: null,
        aprovado: false,
        dataVencimento: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      },
    ],
  },

  // Assinatura PENDENTE_APROVACAO (aluno pagou, aguardando aprovação do coach)
  {
    id: uuidv4(),
    alunoId: mockAlunos[0].id,
    planoId: mockPlanos[0].id,
    criadoEm: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    comprovante_pagamento: "/placeholder.svg?height=300&width=200",
    status: "PENDENTE_APROVACAO",
    dataInicio: new Date().toISOString(),
    dataFim: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    valor: 200,
    parcela: 0,
    totalParcelas: 2,
    pagamentos: [
      {
        id: uuidv4(),
        parcela: 1,
        data: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        comprovante_url: "/placeholder.svg?height=300&width=200",
        aprovado: false,
        dataVencimento: gerarDataVencimento(new Date().toISOString(), 1, 2),
      },
    ],
  },

  // Assinatura INATIVA (parcela vencida sem pagamento)
  {
    id: uuidv4(),
    alunoId: mockAlunos[0].id,
    planoId: mockPlanos[2].id,
    criadoEm: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
    comprovante_pagamento: "/placeholder.svg?height=300&width=200",
    status: "INATIVA",
    dataInicio: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
    dataFim: new Date(new Date().setMonth(new Date().getMonth() + 10)).toISOString(),
    valor: 1200,
    parcela: 1,
    totalParcelas: 12,
    pagamentos: [
      {
        id: uuidv4(),
        parcela: 1,
        data: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
        comprovante_url: "/placeholder.svg?height=300&width=200",
        aprovado: true,
        dataVencimento: gerarDataVencimento(
          new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
          1,
          12,
        ),
      },
      // A segunda parcela venceu há 15 dias e não foi paga
      {
        id: uuidv4(),
        parcela: 2,
        data: null,
        comprovante_url: null,
        aprovado: false,
        dataVencimento: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
      },
    ],
  },
]

const mockPlanosTreino: PlanoTreino[] = [
  {
    id: uuidv4(),
    titulo: "Treino de Hipertrofia - Iniciante",
    caminhoArquivo: "/placeholder.svg?height=500&width=400",
    criadoEm: new Date().toISOString(),
    alunoId: mockAlunos[0].id,
    coachId: mockCoach.id,
  },
  {
    id: uuidv4(),
    titulo: "Treino de Força - Intermediário",
    caminhoArquivo: "/placeholder.svg?height=500&width=400",
    criadoEm: new Date().toISOString(),
    alunoId: mockAlunos[1].id,
    coachId: mockCoach.id,
  },
  {
    id: uuidv4(),
    titulo: "Treino de Resistência - Avançado",
    caminhoArquivo: "/placeholder.svg?height=500&width=400",
    criadoEm: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    alunoId: mockAlunos[0].id,
    coachId: mockCoach.id,
  },
]

const mockPlanosAlimentares: PlanoAlimentar[] = [
  {
    id: uuidv4(),
    titulo: "Dieta de Definição",
    caminhoArquivo: "/placeholder.svg?height=500&width=400",
    criadoEm: new Date().toISOString(),
    alunoId: mockAlunos[0].id,
    coachId: mockCoach.id,
  },
  {
    id: uuidv4(),
    titulo: "Dieta de Ganho de Massa",
    caminhoArquivo: "/placeholder.svg?height=500&width=400",
    criadoEm: new Date().toISOString(),
    alunoId: mockAlunos[1].id,
    coachId: mockCoach.id,
  },
  {
    id: uuidv4(),
    titulo: "Dieta Low Carb",
    caminhoArquivo: "/placeholder.svg?height=500&width=400",
    criadoEm: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    alunoId: mockAlunos[0].id,
    coachId: mockCoach.id,
  },
]

const mockFeedbacks: Feedback[] = [
  {
    id: uuidv4(),
    alunoId: mockAlunos[0].id,
    peso: "65",
    diaFeedback: "domingo",
    seguiuPlano: "PARCIALMENTE",
    comeuAMais: "Chocolate no sábado",
    refeicoesPerdidas: "Nenhuma",
    refeicaoLivre: "Pizza no domingo",
    digestaoIntestino: "Normal",
    dificuldadeAlimentos: "Nenhuma",
    periodoMenstrual: true,
    horasSono: "7",
    qualidadeSono: "BOA",
    acordouCansado: false,
    manteveProtocolo: "TOTALMENTE",
    efeitosColaterais: "Nenhum",
    observacoes: "Semana produtiva",
    createdAt: new Date().toISOString(),
    respondido: true,
  },
  {
    id: uuidv4(),
    alunoId: mockAlunos[1].id,
    peso: "80",
    diaFeedback: "domingo",
    seguiuPlano: "TOTALMENTE",
    comeuAMais: "Nada",
    refeicoesPerdidas: "Nenhuma",
    refeicaoLivre: "Nenhuma",
    digestaoIntestino: "Normal",
    dificuldadeAlimentos: "Nenhuma",
    periodoMenstrual: false,
    horasSono: "8",
    qualidadeSono: "OTIMA",
    acordouCansado: false,
    manteveProtocolo: "TOTALMENTE",
    efeitosColaterais: "Nenhum",
    observacoes: "Semana excelente",
    createdAt: new Date().toISOString(),
    respondido: false,
  },
  {
    id: uuidv4(),
    alunoId: mockAlunos[0].id,
    peso: "64.5",
    diaFeedback: "domingo",
    seguiuPlano: "PARCIALMENTE",
    comeuAMais: "Sorvete na sexta-feira",
    refeicoesPerdidas: "Café da manhã na quinta-feira",
    refeicaoLivre: "Hambúrguer no sábado",
    digestaoIntestino: "Um pouco de desconforto após o hambúrguer",
    dificuldadeAlimentos: "Dificuldade com vegetais crus",
    periodoMenstrual: true,
    horasSono: "6",
    qualidadeSono: "REGULAR",
    acordouCansado: true,
    manteveProtocolo: "PARCIALMENTE",
    efeitosColaterais: "Leve dor de cabeça após suplemento de proteína",
    observacoes: "Semana mais difícil, com mais compromissos",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    respondido: true,
  },
]

const mockFotosFeedback: FotoFeedback[] = [
  {
    id: uuidv4(),
    feedbackId: mockFeedbacks[0].id,
    url: "/placeholder.svg?height=300&width=200",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    feedbackId: mockFeedbacks[0].id,
    url: "/placeholder.svg?height=300&width=200",
    createdAt: new Date().toISOString(),
  },
]

// Variáveis para simular autenticação
let isLoggedIn = false
let currentUserType: "coach" | "aluno" | null = null
let currentUserId: string | null = null

// Funções de mock para autenticação
export const mockLogin = async (email: string, password: string, userType: "coach" | "aluno"): Promise<boolean> => {
  // Simulação de verificação de credenciais
  if (userType === "coach" && email === mockCoach.email) {
    isLoggedIn = true
    currentUserType = "coach"
    currentUserId = mockCoach.id
    return true
  } else if (userType === "aluno") {
    // Para fins de teste, vamos sempre logar como o primeiro aluno
    isLoggedIn = true
    currentUserType = "aluno"
    currentUserId = mockAlunos[0].id
    return true
  }

  return false
}

export const mockLogout = (): void => {
  isLoggedIn = false
  currentUserType = null
  currentUserId = null
}

export const mockRegister = async (userData: any, userType: "coach" | "aluno"): Promise<boolean> => {
  // Simulação de registro
  const id = uuidv4()

  if (userType === "coach") {
    mockCoach = {
      id,
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone,
      dataNascimento: userData.dataNascimento,
    }
  } else {
    mockAlunos.push({
      id,
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone,
      dataNascimento: userData.dataNascimento,
      coachId: mockCoach.id,
    })
  }

  return true
}

export const getUserType = (): "coach" | "aluno" | null => {
  return currentUserType
}

// Funções de mock para obtenção de dados
export const mockGetCoachData = async (): Promise<Coach> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCoach)
    }, 500)
  })
}

export const mockGetAlunoData = async (): Promise<Aluno> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentUserType === "aluno" && currentUserId) {
        const aluno = mockAlunos.find((a) => a.id === currentUserId)
        if (aluno) {
          resolve(aluno)
        } else {
          reject(new Error("Aluno não encontrado"))
        }
      } else {
        reject(new Error("Usuário não autenticado como aluno"))
      }
    }, 500)
  })
}

export const mockGetAlunoById = async (id: string): Promise<Aluno | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const aluno = mockAlunos.find((a) => a.id === id)
      resolve(aluno || null)
    }, 500)
  })
}

export const mockGetAlunos = async (): Promise<Aluno[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAlunos)
    }, 500)
  })
}

export const mockGetPlanos = async (): Promise<Plano[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPlanos)
    }, 500)
  })
}

export const mockGetPlanoById = async (id: string): Promise<Plano | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plano = mockPlanos.find((p) => p.id === id)
      resolve(plano || null)
    }, 500)
  })
}

export const mockGetAssinaturas = async (): Promise<Assinatura[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (currentUserType === "aluno" && currentUserId) {
        const assinaturas = mockAssinaturas.filter((a) => a.alunoId === currentUserId)
        resolve(assinaturas)
      } else {
        resolve(mockAssinaturas)
      }
    }, 500)
  })
}

export const mockGetAssinaturaById = async (id: string): Promise<Assinatura | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const assinatura = mockAssinaturas.find((a) => a.id === id)
      resolve(assinatura || null)
    }, 500)
  })
}

export const mockGetAssinaturasByAlunoId = async (alunoId: string): Promise<Assinatura[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const assinaturas = mockAssinaturas.filter((a) => a.alunoId === alunoId)
      resolve(assinaturas)
    }, 500)
  })
}

export const mockCriarAssinatura = async (dados: any): Promise<Assinatura> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const novaAssinatura: Assinatura = {
        id: uuidv4(),
        alunoId: currentUserId || mockAlunos[0].id,
        planoId: dados.planoId,
        criadoEm: new Date().toISOString(),
        comprovante_pagamento: "/placeholder.svg?height=300&width=200",
        status: "PENDENTE_APROVACAO",
        dataInicio: dados.dataInicio,
        dataFim: dados.dataFim,
        valor: dados.valor,
        parcela: 0,
        totalParcelas: dados.parcelas || 1,
        pagamentos: [
          {
            id: uuidv4(),
            parcela: 1,
            data: new Date().toISOString(),
            comprovante_url: "/placeholder.svg?height=300&width=200",
            aprovado: false,
            dataVencimento: gerarDataVencimento(dados.dataInicio, 1, dados.parcelas || 1),
          },
        ],
      }

      mockAssinaturas.push(novaAssinatura)
      resolve(novaAssinatura)
    }, 500)
  })
}

export const mockEnviarComprovante = async (
  assinaturaId: string,
  comprovante: File,
  parcela: number,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const assinaturaIndex = mockAssinaturas.findIndex((a) => a.id === assinaturaId)

      if (assinaturaIndex === -1) {
        reject(new Error("Assinatura não encontrada"))
        return
      }

      const assinatura = mockAssinaturas[assinaturaIndex]

      // Verificar se a parcela é válida
      if (parcela > assinatura.totalParcelas) {
        reject(new Error("Parcela inválida"))
        return
      }

      // Adicionar novo pagamento
      const novoPagamento = {
        id: uuidv4(),
        parcela,
        data: new Date().toISOString(),
        comprovante_url: "/placeholder.svg?height=300&width=200", // Simulação de URL
        aprovado: false,
        dataVencimento: gerarDataVencimento(assinatura.dataInicio, parcela, assinatura.totalParcelas),
      }

      if (!assinatura.pagamentos) {
        assinatura.pagamentos = []
      }

      assinatura.pagamentos.push(novoPagamento)

      // Atualizar status da assinatura para pendente de aprovação
      assinatura.status = "PENDENTE_APROVACAO"

      mockAssinaturas[assinaturaIndex] = assinatura

      resolve(true)
    }, 500)
  })
}

export const mockAprovarComprovante = async (assinaturaId: string, pagamentoId: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const assinaturaIndex = mockAssinaturas.findIndex((a) => a.id === assinaturaId)

      if (assinaturaIndex === -1) {
        reject(new Error("Assinatura não encontrada"))
        return
      }

      const assinatura = mockAssinaturas[assinaturaIndex]

      if (!assinatura.pagamentos) {
        reject(new Error("Pagamentos não encontrados"))
        return
      }

      const pagamentoIndex = assinatura.pagamentos.findIndex((p) => p.id === pagamentoId)

      if (pagamentoIndex === -1) {
        reject(new Error("Pagamento não encontrado"))
        return
      }

      // Aprovar o pagamento
      assinatura.pagamentos[pagamentoIndex].aprovado = true

      // Atualizar a parcela atual
      assinatura.parcela = assinatura.pagamentos[pagamentoIndex].parcela

      // Verificar se há mais parcelas a serem pagas
      if (assinatura.parcela < assinatura.totalParcelas) {
        // Se ainda há parcelas, o status é PENDENTE
        assinatura.status = "PENDENTE"
      } else {
        // Se todas as parcelas foram pagas, o status é ATIVA
        assinatura.status = "ATIVA"
      }

      mockAssinaturas[assinaturaIndex] = assinatura

      resolve(true)
    }, 500)
  })
}

export const mockRejeitarComprovante = async (assinaturaId: string, pagamentoId: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const assinaturaIndex = mockAssinaturas.findIndex((a) => a.id === assinaturaId)

      if (assinaturaIndex === -1) {
        reject(new Error("Assinatura não encontrada"))
        return
      }

      const assinatura = mockAssinaturas[assinaturaIndex]

      if (!assinatura.pagamentos) {
        reject(new Error("Pagamentos não encontrados"))
        return
      }

      const pagamentoIndex = assinatura.pagamentos.findIndex((p) => p.id === pagamentoId)

      if (pagamentoIndex === -1) {
        reject(new Error("Pagamento não encontrado"))
        return
      }

      // Remover o pagamento rejeitado
      assinatura.pagamentos.splice(pagamentoIndex, 1)

      // Atualizar o status da assinatura
      if (assinatura.parcela < assinatura.totalParcelas) {
        assinatura.status = "PENDENTE"
      } else {
        assinatura.status = "ATIVA"
      }

      mockAssinaturas[assinaturaIndex] = assinatura

      resolve(true)
    }, 500)
  })
}

// Função para verificar e atualizar status de assinaturas
export const mockVerificarStatusAssinaturas = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hoje = new Date()

      mockAssinaturas.forEach((assinatura, index) => {
        const dataFim = new Date(assinatura.dataFim)

        // Verificar se a assinatura está vencida
        if (dataFim < hoje && assinatura.status !== "CANCELADA") {
          mockAssinaturas[index].status = "INATIVA"
        }

        // Verificar status das parcelas
        if (assinatura.pagamentos && assinatura.pagamentos.length > 0) {
          // Verificar se há pagamentos pendentes de aprovação
          const temPagamentoPendente = assinatura.pagamentos.some((p) => !p.aprovado)

          if (temPagamentoPendente) {
            mockAssinaturas[index].status = "PENDENTE_APROVACAO"
          }
          // Se não há pagamentos pendentes de aprovação, verificar parcelas pendentes
          else if (assinatura.parcela < assinatura.totalParcelas) {
            // Verificar se a próxima parcela está vencida
            const proximaParcela = assinatura.parcela + 1
            const dataVencimento = assinatura.pagamentos.find((p) => p.parcela === proximaParcela)?.dataVencimento

            if (dataVencimento) {
              const vencimento = new Date(dataVencimento)

              // Se a data de vencimento ainda não chegou, é PENDENTE
              if (vencimento > hoje) {
                mockAssinaturas[index].status = "PENDENTE"
              }
              // Se a data de vencimento já passou, é INATIVA
              else {
                mockAssinaturas[index].status = "INATIVA"
              }
            } else {
              // Se não tem data de vencimento definida para a próxima parcela, calcular
              const dataInicio = new Date(assinatura.dataInicio)
              const mesesPorParcela = Math.ceil(12 / assinatura.totalParcelas)
              const proximoVencimento = new Date(dataInicio)
              proximoVencimento.setMonth(dataInicio.getMonth() + (proximaParcela - 1) * mesesPorParcela)

              // Se a data de vencimento ainda não chegou, é PENDENTE
              if (proximoVencimento > hoje) {
                mockAssinaturas[index].status = "PENDENTE"
              }
              // Se a data de vencimento já passou, é INATIVA
              else {
                mockAssinaturas[index].status = "INATIVA"
              }
            }
          } else {
            // Se todas as parcelas foram pagas, é ATIVA
            mockAssinaturas[index].status = "ATIVA"
          }
        }
      })

      resolve()
    }, 500)
  })
}

export const mockGerarComprovante = async (assinaturaId: string, pagamentoId: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simular tempo de processamento
    setTimeout(() => {
      // Retornar URL fictícia do comprovante
      resolve(`/comprovantes/${assinaturaId}/${pagamentoId}.pdf`)
    }, 1500)
  })
}

export const mockGetPlanosTreino = async (): Promise<PlanoTreino[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (currentUserType === "aluno" && currentUserId) {
        const planos = mockPlanosTreino.filter((p) => p.alunoId === currentUserId)
        resolve(planos)
      } else {
        resolve(mockPlanosTreino)
      }
    }, 500)
  })
}

export const mockGetPlanosTreinoByAlunoId = async (alunoId: string): Promise<PlanoTreino[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const planos = mockPlanosTreino.filter((p) => p.alunoId === alunoId)
      resolve(planos)
    }, 500)
  })
}

export const mockGetPlanosAlimentares = async (): Promise<PlanoAlimentar[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (currentUserType === "aluno" && currentUserId) {
        const planos = mockPlanosAlimentares.filter((p) => p.alunoId === currentUserId)
        resolve(planos)
      } else {
        resolve(mockPlanosAlimentares)
      }
    }, 500)
  })
}

export const mockGetPlanosAlimentaresByAlunoId = async (alunoId: string): Promise<PlanoAlimentar[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const planos = mockPlanosAlimentares.filter((p) => p.alunoId === alunoId)
      resolve(planos)
    }, 500)
  })
}

export const mockGetFeedbacks = async (): Promise<Feedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (currentUserType === "aluno" && currentUserId) {
        const feedbacks = mockFeedbacks.filter((f) => f.alunoId === currentUserId)
        resolve(feedbacks)
      } else {
        resolve(mockFeedbacks)
      }
    }, 500)
  })
}

export const mockGetFeedbackById = async (id: string): Promise<Feedback | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const feedback = mockFeedbacks.find((f) => f.id === id)
      resolve(feedback || null)
    }, 500)
  })
}

export const mockGetFeedbacksByAlunoId = async (alunoId: string): Promise<Feedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const feedbacks = mockFeedbacks.filter((f) => f.alunoId === alunoId)
      resolve(feedbacks)
    }, 500)
  })
}

export const mockGetFotosFeedbackByFeedbackId = async (feedbackId: string): Promise<FotoFeedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fotos = mockFotosFeedback.filter((f) => f.feedbackId === feedbackId)
      resolve(fotos)
    }, 500)
  })
}

export const mockEnviarFeedback = async (dados: any): Promise<Feedback> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const novoFeedback: Feedback = {
        id: uuidv4(),
        alunoId: currentUserId || mockAlunos[0].id,
        peso: dados.peso,
        diaFeedback: dados.diaFeedback,
        seguiuPlano: dados.seguiuPlano,
        comeuAMais: dados.comeuAMais,
        refeicoesPerdidas: dados.refeicoesPerdidas,
        refeicaoLivre: dados.refeicaoLivre,
        digestaoIntestino: dados.digestaoIntestino,
        dificuldadeAlimentos: dados.dificuldadeAlimentos,
        periodoMenstrual: dados.periodoMenstrual,
        horasSono: dados.horasSono,
        qualidadeSono: dados.qualidadeSono,
        acordouCansado: dados.acordouCansado,
        manteveProtocolo: dados.manteveProtocolo,
        efeitosColaterais: dados.efeitosColaterais,
        observacoes: dados.observacoes,
        createdAt: new Date().toISOString(),
        respondido: false,
      }

      mockFeedbacks.push(novoFeedback)

      // Adicionar fotos do feedback, se houver
      if (dados.fotos && dados.fotos.length > 0) {
        dados.fotos.forEach((foto: File) => {
          mockFotosFeedback.push({
            id: uuidv4(),
            feedbackId: novoFeedback.id,
            url: "/placeholder.svg?height=300&width=200",
            createdAt: new Date().toISOString(),
          })
        })
      }

      resolve(novoFeedback)
    }, 500)
  })
}

export const mockGetProximosFeedbacks = async (): Promise<{ data: string; status: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulação de próximos feedbacks
      const hoje = new Date()
      const proximosFeedbacks = [
        {
          data: new Date(hoje.setDate(hoje.getDate() + 7)).toISOString(),
          status: "pendente",
        },
        {
          data: new Date(hoje.setDate(hoje.getDate() + 14)).toISOString(),
          status: "pendente",
        },
        {
          data: new Date(hoje.setDate(hoje.getDate() - 7)).toISOString(),
          status: "concluido",
        },
      ]

      resolve(proximosFeedbacks)
    }, 500)
  })
}

export const mockGetFeedbacksRecentes = async (): Promise<Feedback[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Ordenar por data de criação (mais recentes primeiro)
      const feedbacksOrdenados = [...mockFeedbacks].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

      resolve(feedbacksOrdenados)
    }, 500)
  })
}

export const mockGetPlanosTreinoRecentes = async (): Promise<PlanoTreino[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Ordenar por data de criação (mais recentes primeiro)
      const planosOrdenados = [...mockPlanosTreino].sort(
        (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
      )

      resolve(planosOrdenados)
    }, 500)
  })
}

export const mockGetPlanosAlimentaresRecentes = async (): Promise<PlanoAlimentar[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Ordenar por data de criação (mais recentes primeiro)
      const planosOrdenados = [...mockPlanosAlimentares].sort(
        (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
      )

      resolve(planosOrdenados)
    }, 500)
  })
}
