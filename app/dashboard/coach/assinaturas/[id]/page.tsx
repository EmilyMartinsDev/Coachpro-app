"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, CheckCircle, AlertCircle, Clock, User, ThumbsUp, ThumbsDown, HourglassIcon } from "lucide-react"
import { useCoachContext } from "@/lib/CoachContext"
import { AssinaturaService } from "@/lib/services"
import { useAssinaturas } from "@/hooks/useAssinaturas"

export default function AssinaturaDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const assinaturaId = params.id as string

  const { coach, loading: coachLoading, error: coachError } = useCoachContext()
  const { assinaturas, loading: assinaturasLoading, updateAssinatura } = useAssinaturas()

  // All useState hooks must be called unconditionally at the top level
  const [assinaturaState, setAssinaturaState] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("detalhes")
  const [aprovarDialogOpen, setAprovarDialogOpen] = useState(false)
  const [rejeitarDialogOpen, setRejeitarDialogOpen] = useState(false)
  const [processando, setProcessando] = useState(false)
  const [success, setSuccess] = useState("")
  const [errorMsg, setErrorMsg] = useState("")


  // Use useEffect to set the assinaturaState when data is loaded
  useEffect(() => {
    if (!assinaturasLoading && assinaturas.length > 0) {
      const assinatura = assinaturas.find((as: any) => as.id === assinaturaId)
      if (assinatura) {
        setAssinaturaState(assinatura)
      }
    }
  }, [assinaturaId, assinaturas, assinaturasLoading])

  // Aprovar comprovante: muda status da assinatura para ATIVA
  const handleAprovarComprovante = async () => {
    if (!assinaturaState) return
    setProcessando(true)
    setErrorMsg("")
    setSuccess("")
    try {
      await updateAssinatura(assinaturaState.id, {status:"ATIVA"})
      setSuccess("Comprovante aprovado com sucesso!")
      setAprovarDialogOpen(false)
      // Atualize apenas o status localmente
      setAssinaturaState({ ...assinaturaState, status: "ATIVA" })
    } catch (err) {
      setErrorMsg("Erro ao aprovar comprovante. Tente novamente.")
    } finally {
      setProcessando(false)
    }
  }

  // Rejeitar comprovante: muda status da assinatura para INATIVA
  const handleRejeitarComprovante = async () => {
    if (!assinaturaState) return
    setProcessando(true)
    setErrorMsg("")
    setSuccess("")
    try {
      await updateAssinatura(assinaturaState.id, {status:"CANCELADA"})
      setSuccess("Comprovante rejeitado com sucesso!")
      setRejeitarDialogOpen(false)
      setAssinaturaState({ ...assinaturaState, status: "CANCELADA" })
    } catch (err) {
      setErrorMsg("Erro ao rejeitar comprovante. Tente novamente.")
    } finally {
      setProcessando(false)
    }
  }

  // Atualizar a exibição de status na página de detalhes da assinatura do coach
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

  // Calcular dias restantes
  const calcularDiasRestantes = (dataFim: string) => {
    const hoje = new Date()
    const fimData = new Date(dataFim)
    const diffTempo = fimData.getTime() - hoje.getTime()
    return Math.ceil(diffTempo / (1000 * 60 * 60 * 24))
  }

  // Loading state
  if (coachLoading || assinaturasLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  // Error state
  if (coachError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>{coachError || "Erro ao carregar coach."}</p>
      </div>
    )
  }

  // Not found state
  if (!assinaturaState) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg text-gray-500 mb-4">Assinatura não encontrada.</p>
        <Button onClick={() => router.push("/dashboard/coach/assinaturas")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    )
  }

  const aluno = coach?.alunos?.find((a: any) => a.id === assinaturaState.alunoId)

  if (!aluno) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg text-gray-500 mb-4">Aluno não encontrado para esta assinatura.</p>
        <Button onClick={() => router.push("/dashboard/coach/assinaturas")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    )
  }

  // Exibir comprovante pendente se status for PENDENTE_APROVACAO
  const temComprovantePendente = assinaturaState.status === "PENDENTE_APROVACAO" && assinaturaState.comprovante_url
  const diasRestantes = calcularDiasRestantes(assinaturaState.dataFim)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="mr-4"
            onClick={() => router.push("/dashboard/coach/assinaturas")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detalhes da Assinatura</h1>
            <p className="text-gray-500">{assinaturaState?.plano?.titulo}</p>
          </div>
        </div>
        <div>{getStatusBadge(assinaturaState.status)}</div>
      </div>

      {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-md">{errorMsg}</div>}
      {success && <div className="bg-green-50 text-green-600 p-4 rounded-md">{success}</div>}

      {temComprovantePendente && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Comprovante pendente de aprovação</h3>
            <p className="text-yellow-700 text-sm mt-1">Existe um comprovante que precisa da sua aprovação.</p>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          {/* Só mostra a aba de pagamentos se houver comprovante */}
          {assinaturaState.comprovante_url && <TabsTrigger value="pagamentos">Comprovante</TabsTrigger>}
        </TabsList>

        <TabsContent value="detalhes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Assinatura</CardTitle>
                <CardDescription>Detalhes gerais da assinatura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Aluno:</span>
                  <Link
                    href={`/dashboard/coach/alunos/${aluno.id}`}
                    className="font-medium text-emerald-600 hover:underline flex items-center"
                  >
                    {aluno.nome}
                    <User className="h-4 w-4 ml-1" />
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Plano:</span>
                  <span className="font-medium">{assinaturaState?.plano?.titulo}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status:</span>
                  {getStatusBadge(assinaturaState.status)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Valor</span>
                  <span className="font-medium">R$ {assinaturaState.valor.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Parcela:</span>
                  <span className="font-medium">
                    {assinaturaState.parcela}/{assinaturaState.totalParcelas}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Data de Início:</span>
                  <span className="font-medium">
                    {new Date(assinaturaState.dataInicio).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Data de Término:</span>
                  <span className="font-medium">{new Date(assinaturaState.dataFim).toLocaleDateString("pt-BR")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Criada em:</span>
                  <span className="font-medium">{new Date(assinaturaState.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Dias Restantes:</span>
                  <span className={`font-medium ${diasRestantes <= 7 ? "text-red-600" : ""}`}>
                    {diasRestantes > 0 ? `${diasRestantes} dias` : "Vencida"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {temComprovantePendente && (
              <Card>
                <CardHeader>
                  <CardTitle>Comprovante Pendente</CardTitle>
                  <CardDescription>Comprovante que precisa de aprovação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video relative rounded-md overflow-hidden mb-4 bg-gray-100">
                      <Image
                        src={assinaturaState.comprovante_url || "/placeholder.svg"}
                        alt="Comprovante de pagamento"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setRejeitarDialogOpen(true)}
                        disabled={assinaturaState.status !== "PENDENTE_APROVACAO"}
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Rejeitar
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => setAprovarDialogOpen(true)}
                        disabled={assinaturaState.status !== "PENDENTE_APROVACAO"}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pagamentos">
          <Card>
            <CardHeader>
              <CardTitle>Comprovante de Pagamento</CardTitle>
              <CardDescription>Visualize e aprove ou rejeite o comprovante enviado pelo aluno</CardDescription>
            </CardHeader>
            <CardContent>
              {assinaturaState.comprovante_url ? (
                <div className="space-y-4">
                  <div className="aspect-video relative rounded-md overflow-hidden mb-4 bg-gray-100">
                    <Image
                      src={assinaturaState.comprovante_url || "/placeholder.svg"}
                      alt="Comprovante de pagamento"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setRejeitarDialogOpen(true)}
                      disabled={assinaturaState.status !== "PENDENTE_APROVACAO"}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Rejeitar
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => setAprovarDialogOpen(true)}
                      disabled={assinaturaState.status !== "PENDENTE_APROVACAO"}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum comprovante enviado</h3>
                  <p className="text-gray-500">O aluno ainda não enviou comprovante para esta assinatura.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmação para aprovar comprovante */}
      <AlertDialog open={aprovarDialogOpen} onOpenChange={setAprovarDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprovar Comprovante</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja aprovar este comprovante de pagamento? Isso atualizará o status da parcela para
              "Aprovado".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAprovarComprovante} disabled={processando}>
              {processando ? "Processando..." : "Aprovar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de confirmação para rejeitar comprovante */}
      <AlertDialog open={rejeitarDialogOpen} onOpenChange={setRejeitarDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeitar Comprovante</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja rejeitar este comprovante de pagamento? O aluno será notificado e precisará enviar
              um novo comprovante.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejeitarComprovante}
              disabled={processando}
              className="bg-red-600 hover:bg-red-700"
            >
              {processando ? "Processando..." : "Rejeitar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
