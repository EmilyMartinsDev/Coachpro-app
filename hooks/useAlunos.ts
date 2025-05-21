"use client"

import { useState, useEffect } from "react"
import { AlunoService } from "@/lib/services"
import type { Aluno } from "@/lib/types"

export function useAlunos(coachId?: string) {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        let data: Aluno[]
        if (coachId) {
          data = await AlunoService.getAlunosByCoachId(coachId)
        } else {
          data = []
        }
        setAlunos(data)
      } catch (err) {
        console.error("Error fetching alunos:", err)
        setError("Erro ao carregar alunos")
      } finally {
        setLoading(false)
      }
    }

    fetchAlunos()
  }, [coachId])

  // Corrigido: não altera loading global ao buscar aluno individual
  const getAlunoById = async (id: string) => {
    try {
      const aluno = await AlunoService.getAlunoById(id)
      return aluno
    } catch (err) {
      console.error("Error fetching aluno:", err)
      setError("Erro ao carregar aluno")
      return null
    }
  }

  const updateAluno = async (id: string, data: Partial<Aluno>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedAluno = await AlunoService.updateAluno(id, data)
      setAlunos((prevAlunos) => prevAlunos.map((aluno) => (aluno.id === id ? updatedAluno : aluno)))
      return updatedAluno
    } catch (err) {
      console.error("Error updating aluno:", err)
      setError("Erro ao atualizar aluno")
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    alunos,
    loading,
    error,
    getAlunoById,
    updateAluno,
  }
}
