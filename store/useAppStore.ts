import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  User, Coach, Aluno, Plano, Assinatura,
  Feedback, PlanoTreino, PlanoAlimentar, Anamnese
} from '@/lib/types'

interface AppState {
  user: User | null
  coach: Coach | null
  alunos: Aluno[]
  planos: Plano[]
  assinaturas: Assinatura[]
  feedbacks: Feedback[]
  planosTreino: PlanoTreino[]
  planosAlimentar: PlanoAlimentar[]
  anamneses: Anamnese[]

  setUser: (user: User | null) => void
  setCoach: (coach: Coach | null) => void

  setAlunos: (alunos: Aluno[]) => void
  addAluno: (aluno: Aluno) => void
  updateAluno: (aluno: Aluno) => void
  removeAluno: (id: string) => void

  setPlanos: (planos: Plano[]) => void
  addPlano: (plano: Plano) => void
  updatePlano: (plano: Plano) => void
  removePlano: (id: string) => void

  setAssinaturas: (assinaturas: Assinatura[]) => void
  addAssinatura: (assinatura: Assinatura) => void
  updateAssinatura: (assinatura: Assinatura) => void
  removeAssinatura: (id: string) => void

  clearStore: () => void
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      user: null,
      coach: null,
      alunos: [],
      planos: [],
      assinaturas: [],
      feedbacks: [],
      planosTreino: [],
      planosAlimentar: [],
      anamneses: [],

      setUser: (user) => set({ user }),
      setCoach: (coach) => set({ coach }),

      setAlunos: (alunos) => set({ alunos }),
      addAluno: (aluno) => set((state) => ({ alunos: [...state.alunos, aluno] })),
      updateAluno: (aluno) => set((state) => ({
        alunos: state.alunos.map((a) => (a.id === aluno.id ? aluno : a)),
      })),
      removeAluno: (id) => set((state) => ({
        alunos: state.alunos.filter((a) => a.id !== id),
      })),

      setPlanos: (planos) => set({ planos }),
      addPlano: (plano) => set((state) => ({ planos: [...state.planos, plano] })),
      updatePlano: (plano) => set((state) => ({
        planos: state.planos.map((p) => (p.id === plano.id ? plano : p)),
      })),
      removePlano: (id) => set((state) => ({
        planos: state.planos.filter((p) => p.id !== id),
      })),

      setAssinaturas: (assinaturas) => set({ assinaturas }),
      addAssinatura: (assinatura) => set((state) => ({
        assinaturas: [...state.assinaturas, assinatura],
      })),
      updateAssinatura: (assinatura) => set((state) => ({
        assinaturas: state.assinaturas.map((a) => (a.id === assinatura.id ? assinatura : a)),
      })),
      removeAssinatura: (id) => set((state) => ({
        assinaturas: state.assinaturas.filter((a) => a.id !== id),
      })),

      clearStore: () => set({
        user: null,
        coach: null,
        alunos: [],
        planos: [],
        assinaturas: [],
        feedbacks: [],
        planosTreino: [],
        planosAlimentar: [],
        anamneses: [],
      }),
    }),
    {
      name: 'app-storage', // chave do localStorage
    }
  )
)
