"use client"

import { useState, useEffect } from "react"
import { PlanoService } from "@/lib/services"
import type { Plano, CreatePlanoRequest } from "@/lib/types"

export function usePlanos() {
  const [planos, setPlanos] = useState<Plano[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const data = await PlanoService.getPlanos()
        setPlanos(data)
      } catch (err) {
        console.error("Error fetching planos:", err)
        setError("Erro ao carregar planos")
      } finally {
        setLoading(false)
      }
    }

    fetchPlanos()
  }, [])

  const getPlanoById = async (id: string) => {
    try {
      const plano = await PlanoService.getPlanoById(id)
      return plano
    } catch (err) {
      console.error("Error fetching plano:", err)
      return null
    }
  }

  const createPlano = async (data: CreatePlanoRequest) => {
    setLoading(true)
    setError(null)
    try {
      const newPlano = await PlanoService.createPlano(data)
      setPlanos((prev) => [...prev, newPlano])
      return newPlano
    } catch (err) {
      console.error("Error creating plano:", err)
      setError("Erro ao criar plano")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updatePlano = async (id: string, data: Partial<Plano>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedPlano = await PlanoService.updatePlano(id, data)
      setPlanos((prev) => prev.map((plano) => (plano.id === id ? updatedPlano : plano)))
      return updatedPlano
    } catch (err) {
      console.error("Error updating plano:", err)
      setError("Erro ao atualizar plano")
      return null
    } finally {
      setLoading(false)
    }
  }

  const deletePlano = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await PlanoService.deletePlano(id)
      setPlanos((prev) => prev.filter((plano) => plano.id !== id))
      return true
    } catch (err) {
      console.error("Error deleting plano:", err)
      setError("Erro ao excluir plano")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    planos,
    loading,
    error,
    getPlanoById,
    createPlano,
    updatePlano,
    deletePlano,
  }
}
