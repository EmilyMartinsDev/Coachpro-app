"use client"

import { useState, useEffect } from "react"
import { AlunoService } from "@/lib/services"
import type { Aluno } from "@/lib/types"

export function useAluno(id?: string) {
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [loading, setLoading] = useState<boolean>(!!id)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setAluno(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    AlunoService.getAlunoById(id)
      .then(setAluno)
      .catch(() => {
        setError("Erro ao carregar aluno")
        setAluno(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  return { aluno, loading, error }
}
