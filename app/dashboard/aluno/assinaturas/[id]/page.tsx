"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Upload,
  FileText,
  Ban,
  HourglassIcon,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useAluno } from "@/hooks/useAluno"
import { usePlanos } from "@/hooks/usePlanos"
import { useAssinaturas } from "@/hooks/useAssinaturas"
import type { Assinatura, Plano } from "@/lib/types"

export default function AssinaturaDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const assinaturaId = params.id as string

  const { user } = useAuth()
  const { aluno, loading: alunoLoading } = useAluno(user?.id)
  const { planos, loading: planosLoading } = usePlanos()
  const { updateAssinatura } = useAssinaturas(user?.id)

  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [comprovante, setComprovante] = useState<File | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Busca assinatura do aluno
  const assinatura = aluno?.assinaturas?.find((a) => a.id === assinaturaId) || null
  const plano = planos.find((p) => p.id === assinatura?.planoId) || null

  useEffect(() => {
    if (!alunoLoading && !planosLoading) {
      setLoading(false)
    }
  }, [alunoLoading, planosLoading])

  // Badge de status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ATIVA":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" /> Ativa
          </Badge>
        )
      case "PENDENTE":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="h-3 w-3 mr-1" /> Pendente
          </Badge>
        )
      case "INATIVA":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <Ban className="h-3 w-3 mr-1" /> Inativa
          </Badge>
        )
      case "PENDENTE_APROVACAO":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <HourglassIcon className="h-3 w-3 mr-1" /> Aguardando Aprovação
          </Badge>
        )
      case "CANCELADA":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <AlertCircle className="h-3 w-3 mr-1" /> Cancelada
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Calcular dias restantes e progresso da assinatura
  const calcularDiasRestantes = (dataFim: string) => {
    const hoje = new Date()
    const fimData = new Date(dataFim)
    const diffTempo = fimData.getTime() - hoje.getTime()
    return Math.ceil(diffTempo / (1000 * 60 * 60 * 24))
  }

  const calcularProgresso = (dataInicio: string, dataFim: string) => {
    const inicio = new Date(dataInicio).getTime()
    const fim = new Date(dataFim).getTime()
    const hoje = new Date().getTime()
    const total = fim - inicio
    const decorrido = hoje - inicio
    const progresso = Math.max(0, Math.min(100, (decorrido / total) * 100))
    return Math.round(progresso)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setComprovante(e.target.files[0])
    }
  }

  const handleEnviarComprovante = async () => {
    setError("")
    setSuccess("")
    setEnviando(true)
    try {
      if (!assinatura || !comprovante) {
        setError("Assinatura ou comprovante não encontrado.")
        setEnviando(false)
        return
      }
      // Monta o FormData para upload real do arquivo
      const formData = new FormData()
      formData.append("comprovante_pagamento", comprovante)
      formData.append("status", "PENDENTE_APROVACAO")
      formData.append("assinaturaId", assinatura.id)
      await updateAssinatura(assinatura.id, formData)
      setSuccess("Comprovante enviado! Aguarde aprovação do coach.")
      setDialogOpen(false)
      setComprovante(null)
    } catch (err) {
      setError("Erro ao enviar comprovante. Tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  const isLoading = loading || alunoLoading || planosLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!assinatura || !plano) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg text-gray-500 mb-4">Assinatura não encontrada.</p>
        <Button onClick={() => router.push("/dashboard/aluno/assinaturas")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para assinaturas
        </Button>
      </div>
    )
  }

  const diasRestantes = calcularDiasRestantes(assinatura.dataFim)
  const progresso = calcularProgresso(assinatura.dataInicio, assinatura.dataFim)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="mr-4"
            onClick={() => router.push("/dashboard/aluno/assinaturas")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detalhes da Assinatura</h1>
            <p className="text-gray-500">{plano.titulo}</p>
          </div>
        </div>
        <div>{getStatusBadge(assinatura.status)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Assinatura</CardTitle>
            <CardDescription>Detalhes gerais da sua assinatura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Plano:</span>
              <span className="font-medium">{plano.titulo}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Status:</span>
              {getStatusBadge(assinatura.status)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Valor Total:</span>
              <span className="font-medium">R$ {assinatura.valor.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Data de Início:</span>
              <span className="font-medium">{new Date(assinatura.dataInicio).toLocaleDateString("pt-BR")}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Data de Término:</span>
              <span className="font-medium">{new Date(assinatura.dataFim).toLocaleDateString("pt-BR")}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Criada em:</span>
              <span className="font-medium">{new Date(assinatura.createdAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status da Assinatura</CardTitle>
            <CardDescription>Acompanhe o status atual da sua assinatura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {assinatura.status === "ATIVA" && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Progresso:</span>
                    <span className="font-medium">{progresso}%</span>
                  </div>
                  <Progress value={progresso} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Dias Restantes:</span>
                  <span className={`font-medium ${diasRestantes <= 7 ? "text-red-600" : ""}`}>
                    {diasRestantes > 0 ? `${diasRestantes} dias` : "Vencida"}
                  </span>
                </div>

            

                {diasRestantes <= 0 && (
                  <div className="bg-red-50 p-3 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium">Assinatura vencida</p>
                      <p className="text-red-700 text-sm">
                        Sua assinatura está vencida. Renove agora para continuar com acesso aos serviços.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {assinatura.status === "PENDENTE" && (
              <>
                <div className="bg-blue-50 p-3 rounded-md flex items-start">
                  <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-medium">Assinatura pendente de pagamento</p>
                    <p className="text-blue-700 text-sm">
                      Envie o comprovante de pagamento para ativar sua assinatura.
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-2" onClick={() => setDialogOpen(true)}>
                  Enviar comprovante de pagamento
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enviar Comprovante</DialogTitle>
                      <DialogDescription>Selecione o arquivo do comprovante para upload.</DialogDescription>
                    </DialogHeader>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
                    {success && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{success}</div>}
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="comprovante">Comprovante de Pagamento</Label>
                        <Input id="comprovante" type="file" accept="image/*,.pdf" onChange={handleFileChange} />
                        <p className="text-xs text-gray-500">Formatos aceitos: imagens e PDF.</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleEnviarComprovante} disabled={!comprovante || enviando}>
                        {enviando ? "Enviando..." : "Enviar Comprovante"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {assinatura.status === "PENDENTE_APROVACAO" && (
              <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800 flex items-start">
                <HourglassIcon className="h-4 w-4 mr-2 mt-0.5" />
                <p>Aguardando aprovação pelo coach.</p>
              </div>
            )}

            {assinatura.status === "CANCELADA" && (
              <div className="bg-red-50 p-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Assinatura cancelada</p>
                  <p className="text-red-700 text-sm">
                    Esta assinatura foi cancelada. Entre em contato com seu coach para mais informações.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
