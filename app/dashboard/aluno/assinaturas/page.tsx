"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, AlertCircle, Clock, Ban, HourglassIcon } from "lucide-react"
import { useAssinaturasAluno } from "@/hooks/aluno/useAssinaturaAluno"
import { useRouter } from "next/navigation"


export default function AssinaturasPage() {
  const router = useRouter()
  const { data: assinaturasResponse, isLoading } = useAssinaturasAluno()


  const [activeTab, setActiveTab] = useState("todas")

  // Extrai a lista de assinaturas da resposta
  const assinaturas = assinaturasResponse?.data || []

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

    // Garantir que o progresso esteja entre 0 e 100
    const progresso = Math.max(0, Math.min(100, (decorrido / total) * 100))
    return Math.round(progresso)
  }

  // Filtrar assinaturas com base na tab ativa
  const filteredAssinaturas = assinaturas.filter((assinatura) => {
    if (activeTab === "todas") return true
    if (activeTab === "ativas") return assinatura.status === "ATIVA"
    if (activeTab === "aguardando") return assinatura.status === "PENDENTE_APROVACAO"
    if (activeTab === "canceladas") return assinatura.status === "CANCELADA"
    return true
  })

  if (isLoading ) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas Assinaturas</h1>
          <p className="text-gray-500">Gerencie suas assinaturas de planos</p>
        </div>
      </div>

      {/* Adicionar card explicativo dos status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Status das Assinaturas</CardTitle>
          <CardDescription>Entenda os diferentes status das suas assinaturas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mt-1">
                <CheckCircle className="h-3 w-3 mr-1" /> Ativa
              </Badge>
              <span className="text-sm">Parcelas pagas e aprovadas pelo coach</span>
            </div>
            <div className="flex items-start space-x-2">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mt-1">
                <Clock className="h-3 w-3 mr-1" /> Pendente
              </Badge>
              <span className="text-sm">Parcelas cujo prazo de pagamento ainda não venceu</span>
            </div>
            <div className="flex items-start space-x-2">
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 mt-1">
                <HourglassIcon className="h-3 w-3 mr-1" /> Aguardando Aprovação
              </Badge>
              <span className="text-sm">Parcelas pagas aguardando aprovação do coach</span>
            </div>
            <div className="flex items-start space-x-2">
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 mt-1">
                <Ban className="h-3 w-3 mr-1" /> Inativa
              </Badge>
              <span className="text-sm">Parcelas cujo prazo de pagamento já venceu</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="ativas">Ativas</TabsTrigger>
          <TabsTrigger value="aguardando">Aguardando</TabsTrigger>
          <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredAssinaturas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssinaturas.map((assinatura) => {
                const diasRestantes = calcularDiasRestantes(assinatura.dataFim)
                const progresso = calcularProgresso(assinatura.dataInicio, assinatura.dataFim)

                return (
                  <Card
                    key={assinatura.id}
                    className={
                      assinatura.status === "PENDENTE_APROVACAO"
                        ? "border-yellow-300 cursor-pointer hover:shadow-lg"
                        : assinatura.status === "CANCELADA"
                        ? "border-red-300 cursor-pointer hover:shadow-lg"
                        : assinatura.status === "PENDENTE"
                        ? "border-blue-300 cursor-pointer hover:shadow-lg"
                        : "cursor-pointer hover:shadow-lg"
                    }
                    onClick={() => router.push(`/dashboard/aluno/assinaturas/${assinatura.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") router.push(`/dashboard/aluno/assinaturas/${assinatura.id}`) }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{assinatura.parcelamento?.plano?.titulo || "Plano"}</CardTitle>
                        {getStatusBadge(assinatura.status)}
                      </div>
                      <CardDescription>
                        Assinatura criada em {new Date(assinatura.createdAt).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Valor:</span>
                        <span className="font-medium">R$ {assinatura.parcelamento.valorParcela.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <p className="text-sm">
                            <span className="text-gray-500">Início:</span>{" "}
                            {new Date(assinatura.dataInicio).toLocaleDateString("pt-BR")}
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500">Término:</span>{" "}
                            {new Date(assinatura.dataFim).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Parcela:</span>
                        <span className="font-medium">
                          {assinatura.parcela}/{assinatura.parcelamento.quantidadeParcela}
                        </span>
                      </div>

                      {(assinatura.status === "ATIVA" || assinatura.status === "PENDENTE") && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Progresso:</span>
                            <span className="text-sm font-medium">{progresso}%</span>
                          </div>
                          <Progress value={progresso} className="h-2" />
                          <p className="text-xs text-gray-500 text-right">
                            {diasRestantes > 0 ? `${diasRestantes} dias restantes` : "Assinatura vencida"}
                          </p>
                        </div>
                      )}

                      {assinatura.status === "PENDENTE_APROVACAO" && (
                        <div className="bg-yellow-50 p-2 rounded-md text-sm text-yellow-800 flex items-start">
                          <HourglassIcon className="h-4 w-4 mr-2 mt-0.5" />
                          <p>Aguardando aprovação pelo coach.</p>
                        </div>
                      )}

                      {assinatura.status === "CANCELADA" && (
                        <div className="bg-red-50 p-2 rounded-md text-sm text-red-800 flex items-start">
                          <Ban className="h-4 w-4 mr-2 mt-0.5" />
                          <p>Assinatura cancelada. Entre em contato com o suporte.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhuma assinatura encontrada.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}