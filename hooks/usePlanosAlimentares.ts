"use client"

import { useState, useEffect } from "react"
import { AlimentarService } from "@/lib/services"
import type { PlanoAlimentar, CreatePlanoAlimentarRequest } from "@/lib/types"

export function usePlanosAlimentares(alunoId?: string) {
  const [planosAlimentares, setPlanosAlimentares] = useState<PlanoAlimentar[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)



  const createPlanoAlimentar = async (data: CreatePlanoAlimentarRequest) => {
    setLoading(true)
    setError(null)
    try {
      const newPlano = await AlimentarService.createPlanoAlimentar(data)
      setPlanosAlimentares((prev) => [...prev, newPlano])
      return newPlano
    } catch (err) {
      console.error("Error creating plano alimentar:", err)
      setError("Erro ao criar plano alimentar")
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    planosAlimentares,
    loading,
    error,
    createPlanoAlimentar,
  }
}
