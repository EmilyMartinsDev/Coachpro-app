"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Calendar, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { useFeedbackAluno } from "@/hooks/aluno/useFeedbackAluno"

export default function FeedbackDetalhesPage() {
  const { id } = useParams()
  const { detalhesFeedback } = useFeedbackAluno({})
  
  const { data: feedback, isLoading, error } = detalhesFeedback(id as string)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "TOTALMENTE":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Totalmente</Badge>
      case "PARCIALMENTE":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Parcialmente</Badge>
      case "NAO":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Não</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusIcon = (respondido: boolean) => {
    return respondido ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-yellow-500" />
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !feedback) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-medium">Feedback não encontrado</h2>
        <p className="text-gray-500">Não foi possível carregar os detalhes deste feedback</p>
        <Link href="/dashboard/aluno/feedbacks">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para meus feedbacks
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/aluno/feedbacks">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Detalhes do Feedback</h1>
            <p className="text-gray-500">
              Enviado em {format(new Date(feedback.createdAt), "PPP", { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(feedback.respondido)}
          <span className="text-sm font-medium">
            {feedback.respondido ? "Respondido" : "Aguardando resposta"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados principais do seu feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Peso</p>
                <p className="font-medium">{feedback.peso || "N/A"} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data do Feedback</p>
                <p className="font-medium">
                  {format(new Date(feedback.diaFeedback), "PPP", { locale: ptBR })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plano Alimentar */}
        <Card>
          <CardHeader>
            <CardTitle>Plano Alimentar</CardTitle>
            <CardDescription>Como você seguiu o plano</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Seguiu o plano alimentar?</p>
              <div className="mt-1">{getStatusBadge(feedback.seguiuPlano)}</div>
            </div>
            {feedback.comeuAMais && (
              <div>
                <p className="text-sm text-gray-500">Comeu a mais</p>
                <p className="font-medium">{feedback.comeuAMais}</p>
              </div>
            )}
            {feedback.refeicoesPerdidas && (
              <div>
                <p className="text-sm text-gray-500">Refeições perdidas</p>
                <p className="font-medium">{feedback.refeicoesPerdidas}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sono e Bem-estar */}
        <Card>
          <CardHeader>
            <CardTitle>Sono e Bem-estar</CardTitle>
            <CardDescription>Seu estado físico e mental</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Horas de sono</p>
                <p className="font-medium">{feedback.horasSono || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Qualidade do sono</p>
                <p className="font-medium">
                  {feedback.qualidadeSono === "OTIMA" && "Ótima"}
                  {feedback.qualidadeSono === "BOA" && "Boa"}
                  {feedback.qualidadeSono === "REGULAR" && "Regular"}
                  {feedback.qualidadeSono === "RUIM" && "Ruim"}
                  {feedback.qualidadeSono === "PESSIMA" && "Péssima"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Acordou cansado?</p>
                <p className="font-medium">{feedback.acordouCansado ? "Sim" : "Não"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Período menstrual?</p>
                <p className="font-medium">{feedback.periodoMenstrual ? "Sim" : "Não"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protocolo e Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Protocolo e Observações</CardTitle>
            <CardDescription>Detalhes adicionais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Manteve o protocolo?</p>
              <div className="mt-1">{getStatusBadge(feedback.manteveProtocolo)}</div>
            </div>
            {feedback.efeitosColaterais && (
              <div>
                <p className="text-sm text-gray-500">Efeitos colaterais</p>
                <p className="font-medium">{feedback.efeitosColaterais}</p>
              </div>
            )}
            {feedback.observacoes && (
              <div>
                <p className="text-sm text-gray-500">Observações</p>
                <p className="font-medium">{feedback.observacoes}</p>
              </div>
            )}
            {feedback.respostaCoach && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">Resposta do Coach</p>
                <p className="font-medium">{feedback.respostaCoach}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fotos do Progresso */}
      <Card>
        <CardHeader>
          <CardTitle>Fotos do Progresso</CardTitle>
          <CardDescription>Registro visual do seu desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          {feedback.fotos && feedback.fotos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {feedback.fotos.map((foto) => (
                <div key={foto.id} className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={foto.url}
                    alt={`Foto de progresso de ${format(new Date(feedback.diaFeedback), "PPP", { locale: ptBR })}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">Nenhuma foto enviada neste feedback</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}