"use client"

import { useState, useEffect } from "react"
import { AnamneseService } from "@/lib/services"
import type { Anamnese, CreateAnamneseRequest } from "@/lib/types"
import axios from "axios"

export function useAnamnese(alunoId?: string) {
  const [anamnese, setAnamnese] = useState<Anamnese | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (alunoId) {
      fetchAnamneseForAluno(alunoId)
    } else {
      setLoading(false)
    }
  }, [alunoId])

  const fetchAnamneseForAluno = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await AnamneseService.getAnamneseByAlunoId(id)
      setAnamnese(data)
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setAnamnese(null)
        // Não seta error, pois é esperado para aluno novo
      } else {
        console.error("Error fetching anamnese:", err)
        setError("Erro ao carregar anamnese")
      }
    } finally {
      setLoading(false)
    }
  }

  const createAnamnese = async (data: CreateAnamneseRequest) => {
    setLoading(true)
    setError(null)
    try {
      const newAnamnese = await AnamneseService.createAnamnese(data)
      setAnamnese(newAnamnese)
      return newAnamnese
    } catch (err) {
      console.error("Error creating anamnese:", err)
      setError("Erro ao criar anamnese")
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    anamnese,
    loading,
    error,
    createAnamnese,
  }
}
