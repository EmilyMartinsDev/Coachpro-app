"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Eye, Calendar, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useFeedbackAluno } from "@/hooks/aluno/useFeedbackAluno"
import type { ListarFeedbacksParams } from "@/lib/types"

export default function FeedbacksPage() {
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState("todos")

  const getFilterParam = (): ListarFeedbacksParams => {
    return {
      respondido: activeTab === "todos" ? undefined : activeTab === "respondidos"
    }
  }

  const { data: feedbacks, isLoading, error } = useFeedbackAluno(getFilterParam())

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

  const getStatusBadgeResposta = (respondido: boolean | undefined) => {
    return respondido ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Respondido</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Não Respondido</Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Erro ao carregar feedbacks.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus Feedbacks</h1>
          <p className="text-gray-500">Histórico de feedbacks enviados</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/dashboard/aluno/feedback">
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Novo Feedback
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="respondidos">Respondidos</TabsTrigger>
          <TabsTrigger value="nao_respondidos">Não Respondidos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {feedbacks?.data  ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Feedbacks</CardTitle>
                  <CardDescription>Feedbacks enviados ao seu coach</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Peso</TableHead>
                        <TableHead>Seguiu Plano</TableHead>
                        <TableHead>Manteve Protocolo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedbacks?.data?.map((feedback) => (
                        <TableRow key={feedback.id}>
                          <TableCell>
                            {new Date(feedback.diaFeedback).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>{feedback.peso || "N/A"}</TableCell>
                          <TableCell>{getStatusBadge(feedback.seguiuPlano)}</TableCell>
                          <TableCell>{getStatusBadge(feedback.manteveProtocolo)}</TableCell>
                          <TableCell>{getStatusBadgeResposta(feedback.respondido)}</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/dashboard/aluno/feedbacks/${feedback.id}`}>
                              <Button size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progresso Visual</CardTitle>
                  <CardDescription>Acompanhe seu progresso através das fotos enviadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {feedbacks?.data?.slice(0, 3).map((feedback) => {
                        const fotos = feedback.fotos || []
                        if (fotos.length === 0) return null

                        return (
                          <div key={feedback.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 p-3 flex items-center justify-between">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm">
                                  {new Date(feedback.diaFeedback).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                              {getStatusBadgeResposta(feedback.respondido)}
                            </div>
                            <div className="p-3">
                              <div className="grid grid-cols-2 gap-2">
                                {fotos.slice(0, 2).map((foto) => (
                                  <div key={foto.id} className="aspect-square relative rounded-md overflow-hidden">
                                    <Image
                                      src={foto.url || "/placeholder.svg"}
                                      alt="Foto de progresso"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                              {fotos.length > 2 && (
                                <div className="mt-2 text-center text-sm text-gray-500">
                                  +{fotos.length - 2} fotos
                                </div>
                              )}
                              <div className="mt-3 flex justify-end">
                                <Link href={`/dashboard/aluno/feedbacks/${feedback.id}`}>
                                  <Button size="sm" variant="outline">
                                    Ver Detalhes
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex justify-center">
                      <Link href="/dashboard/aluno/progresso">
                        <Button variant="outline">Ver Histórico Completo de Progresso</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Nenhum feedback encontrado</h3>
                <p className="text-gray-500 text-center mb-4">
                  {activeTab !== "todos"
                    ? `Você não possui feedbacks ${activeTab === "respondidos" ? "respondidos" : "não respondidos"}.`
                    : "Você ainda não enviou nenhum feedback."}
                </p>
                <Link href="/dashboard/aluno/feedback">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Enviar Feedback
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
