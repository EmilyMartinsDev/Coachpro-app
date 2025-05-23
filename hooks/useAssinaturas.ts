"use client"

import { useState, useEffect } from "react"
import { AssinaturaService } from "@/lib/services"
import type { Assinatura, CreateAssinaturaRequest } from "@/lib/types"

export function useAssinaturas(alunoId?: string) {
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([])
    const [assinatura, setAssinatura] = useState<Assinatura>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssinaturas = async () => {
      setLoading(true)
      try {
        let data: Assinatura[]
        if (alunoId) {
          data = await AssinaturaService.getAssinaturasByAlunoId(alunoId)
        } else {
          data = await AssinaturaService.getAssinaturas()
        }
        setAssinaturas(data)
      } catch (err) {
        console.error("Error fetching assinaturas:", err)
        setError("Erro ao carregar assinaturas")
      } finally {
        setLoading(false)
      }
    }

    fetchAssinaturas()
  }, [alunoId])

  const getAssinaturaById = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const assinatura = await AssinaturaService.getAssinaturaById(id)
      setAssinatura(assinatura)
      return assinatura
    } catch (err) {
      console.error("Error fetching assinatura:", err)
      setError("Erro ao carregar assinatura")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createAssinatura = async (data: CreateAssinaturaRequest | FormData) => {
    setLoading(true)
    setError(null)
 
    try {
      const newAssinatura = await AssinaturaService.createAssinatura(data)
      setAssinaturas((prev) => [...prev, newAssinatura])
      return newAssinatura
    } catch (err) {
      console.error("Error creating assinatura:", err)
      setError("Erro ao criar assinatura")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateAssinatura = async (id: string, data: Partial<Assinatura> | FormData) => {
    setLoading(true)
    setError(null)
    try {
      const updatedAssinatura = await AssinaturaService.updateAssinatura(id, data)
      setAssinaturas((prev) => prev.map((assinatura) => (assinatura.id === id ? updatedAssinatura : assinatura)))
      setAssinatura(updatedAssinatura)
      return updatedAssinatura
    } catch (err) {
      console.error("Error updating assinatura:", err)
      setError("Erro ao atualizar assinatura")
      return null
    } finally {
      setLoading(false)
    }
  }



  return {
    assinaturas,
    loading,
    error,
    assinatura,
    getAssinaturaById,
    createAssinatura,
    updateAssinatura,
  }
}
