"use client"

import { useState, useEffect } from "react"
import { FeedbackService } from "@/lib/services"
import type { Feedback, CreateFeedbackRequest } from "@/lib/types"

export function useFeedbacks(alunoId?: string) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!alunoId) {
        setLoading(false)
        return
      }

      try {
        const data = await FeedbackService.getFeedbacksByAlunoId(alunoId)
        setFeedbacks(data)
      } catch (err) {
        console.error("Error fetching feedbacks:", err)
        setError("Erro ao carregar feedbacks")
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [alunoId])

  const getFeedbackById = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const feedback = await FeedbackService.getFeedbackById(id)
      return feedback
    } catch (err) {
      console.error("Error fetching feedback:", err)
      setError("Erro ao carregar feedback")
      return null
    } finally {
      setLoading(false)
    }
  }

  const getFeedbackPhotos = async (feedbackId: string) => {
    try {
      const photos = await FeedbackService.getFeedbackPhotos(feedbackId)
      return photos
    } catch (err) {
      console.error("Error fetching feedback photos:", err)
      return []
    }
  }
const createFeedback = async (data: CreateFeedbackRequest, photos: File[] = []) => {
  setLoading(true)
  setError(null)

  try {
    const newFeedback = await FeedbackService.createFeedback(data)

    // Upload das fotos individualmente (com try interno para não travar tudo)
    for (const file of photos) {
      try {
        await FeedbackService.uploadFeedbackPhoto(newFeedback.id, file)
      } catch (err) {
        console.error("Erro ao fazer upload da foto:", err)
      }
    }

    return newFeedback
  } catch (err) {
    console.error("Erro ao criar feedback:", err)
    setError("Erro ao enviar feedback")
    return null
  } finally {
    setLoading(false)
  }
}
  const updateRespostaFeedback = async (id: string, data: Partial<Feedback>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedFeedback = await FeedbackService.updateFeedback(id, data)
      setFeedbacks((prev) => {
        const arr = Array.isArray(prev) ? prev : []
        return arr.map((feedback) => (feedback.id === id ? { ...feedback, ...updatedFeedback } : feedback))
      })
      return updatedFeedback
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar feedback")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    feedbacks,
    loading,
    error,
    getFeedbackById,
    getFeedbackPhotos,
    createFeedback,
    updateRespostaFeedback,
  }
}
