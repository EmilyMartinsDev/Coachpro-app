"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useAluno } from "@/hooks/useAluno"

export default function ProgressoPage() {
  const { user } = useAuth()
  const { aluno, loading, error } = useAluno(user?.id)
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([])
  const [currentView, setCurrentView] = useState<"lista" | "comparacao">("lista")
  const [comparacaoTipo, setComparacaoTipo] = useState<"frente" | "lado" | "costas">("frente")

  // Usa os feedbacks aninhados do aluno
  const feedbacks = aluno?.feedbacks || []

  // Fotos aninhadas em cada feedback (feedback.fotos)
  const fotosPorFeedback: Record<string, any[]> = {}
  feedbacks.forEach(fb => { fotosPorFeedback[fb.id] = fb.fotos || [] })

  useEffect(() => {
    // Selecionar os dois feedbacks mais recentes por padrão
    const feedbacksOrdenados = [...feedbacks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    if (feedbacksOrdenados.length >= 2) {
      setSelectedFeedbacks([feedbacksOrdenados[0].id, feedbacksOrdenados[1].id])
    } else if (feedbacksOrdenados.length === 1) {
      setSelectedFeedbacks([feedbacksOrdenados[0].id])
    }
  }, [feedbacks])

  const handleToggleFeedbackSelection = (feedbackId: string) => {
    if (selectedFeedbacks.includes(feedbackId)) {
      setSelectedFeedbacks(selectedFeedbacks.filter((id) => id !== feedbackId))
    } else {
      // Limitar a 2 seleções
      if (selectedFeedbacks.length < 2) {
        setSelectedFeedbacks([...selectedFeedbacks, feedbackId])
      } else {
        // Substituir o mais antigo
        setSelectedFeedbacks([selectedFeedbacks[1], feedbackId])
      }
    }
  }

  const getFeedbackById = (id: string) => feedbacks.find((feedback) => feedback.id === id)

  const getFotosPorTipo = (feedbackId: string, tipo: string) => {
    const fotos = fotosPorFeedback[feedbackId] || []
    if (fotos.length === 0) return null

    // Para fins de demonstração, vamos usar a primeira foto para cada tipo
    if (tipo === "frente" && fotos.length > 0) return fotos[0]
    if (tipo === "lado" && fotos.length > 1) return fotos[1]
    if (tipo === "costas" && fotos.length > 2) return fotos[2]

    return fotos[0] // Fallback para a primeira foto
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }
  if (error || !aluno) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Erro ao carregar dados do aluno.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Progresso</h1>
          <p className="text-gray-500">Acompanhe sua evolução ao longo do tempo</p>
        </div>
        <div>
          <Link href="/dashboard/aluno/feedbacks">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Feedbacks
            </Button>
          </Link>
        </div>
      </div>

      <Tabs
        value={currentView}
        onValueChange={(value) => setCurrentView(value as "lista" | "comparacao")}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="lista">Lista de Fotos</TabsTrigger>
          <TabsTrigger value="comparacao">Comparação</TabsTrigger>
        </TabsList>

        {/* Rest of the component implementation */}
        {/* This is a placeholder for the rest of the component */}
        <div className="text-center py-8">
          <p>Implementação completa da visualização de progresso será adicionada em breve.</p>
        </div>
      </Tabs>
    </div>
  )
}
