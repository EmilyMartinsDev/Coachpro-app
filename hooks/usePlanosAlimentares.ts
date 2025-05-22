"use client"

import { useState, useEffect } from "react"
import { AlimentarService } from "@/lib/services"
import type { PlanoAlimentar, CreatePlanoAlimentarRequest } from "@/lib/types"

export function usePlanosAlimentares(alunoId?: string) {
  const [planosAlimentares, setPlanosAlimentares] = useState<PlanoAlimentar[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlanos = async () => {
   
      setLoading(true)
      setError(null)
      try {
        const data = await AlimentarService.getPlanosAlimentar()
        setPlanosAlimentares(data)
      } catch (err) {
        console.error("Error fetching planos alimentares:", err)
        setError("Erro ao carregar planos alimentares")
      } finally {
        setLoading(false)
      }
    }

    fetchPlanos()
  }, [alunoId])



  const createPlanoAlimentar = async (data: Omit<CreatePlanoAlimentarRequest, 'arquivo'> & { arquivo: File }) => {
    setLoading(true)
    setError(null)
    try {
      const newPlano = await AlimentarService.createPlanoAlimentar({ ...data, arquivo: data.arquivo })
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

  const downloadPlanoAlimentar = async (planoId: string) => {
    setLoading(true)
    setError(null)
    try {
      const blob = await AlimentarService.downloadPlanoAlimentar(planoId)
      if (!(blob instanceof Blob)) {
        throw new Error("Resposta do backend não é um arquivo válido para download.")
      }
      console.log(blob)
      const url = window.URL.createObjectURL(blob)
      // Força download com nome amigável
      const a = document.createElement("a")
      a.href = url
      a.download = `plano_alimentar_${planoId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => window.URL.revokeObjectURL(url), 10000)
    } catch (err) {
      console.error("Error downloading plano alimentar:", err)
      setError("Erro ao baixar plano alimentar")
    } finally {
      setLoading(false)
    }
  }

  return {
    planosAlimentares,
    loading,
    error,
    createPlanoAlimentar,
    downloadPlanoAlimentar,
  }
}
