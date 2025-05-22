"use client"

import { useState, useEffect } from "react"
import { TreinoService } from "@/lib/services"
import type { PlanoTreino, CreatePlanoTreinoRequest } from "@/lib/types"

export function useTreinos(alunoId?: string) {
  const [treinos, setTreinos] = useState<PlanoTreino[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlanos = async () => {
  
      setLoading(true)
      setError(null)
      try {
        const data = await TreinoService.getTreinos()
        setTreinos(data)
      } catch (err) {
        console.error("Error fetching planos alimentares:", err)
        setError("Erro ao carregar planos alimentares")
      } finally {
        setLoading(false)
      }
    }

    fetchPlanos()
  }, [alunoId])
  const createPlanoTreino = async (data: Omit<CreatePlanoTreinoRequest, 'arquivo'> & { arquivo: File }) => {
    setLoading(true)
    setError(null)
    try {
      const newTreino = await TreinoService.createPlanoTreino({ ...data, arquivo: data.arquivo })
      setTreinos((prev) => [...prev, newTreino])
      return newTreino
    } catch (err) {
      console.error("Error creating treino:", err)
      setError("Erro ao criar plano de treino")
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    treinos,
    loading,
    error,
    createPlanoTreino,
  }
}
