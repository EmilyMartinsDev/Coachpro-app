"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"

import Link from "next/link"
import { ArrowRight, Dumbbell, MessageSquare, UserPlus, Users, Utensils } from "lucide-react"
import { useEffect, useState } from "react"
import { Feedback, Aluno } from "@/lib/types"
import { useAlunos } from "@/hooks/coach/useAlunos"
import { useFeedbacks } from "@/hooks/coach/useFeedbacks"

export default function CoachDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  // Usando os hooks
  const {
    alunos,
    isLoading: alunosLoading,
    total: totalAlunos,
  } = useAlunos({
    page,
    pageSize,
  })

  const {
    listarFeedbacks
  } = useFeedbacks()

  const { data: feedbacksData, isLoading } = listarFeedbacks({
    respondido: false,
    page,
    pageSize,
  })

  useEffect(() => {
    if (!authLoading && user?.id) {
      setLoading(false)
    }
  }, [authLoading, user])

  if (authLoading || alunosLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Erro ao carregar dados do usuário.</p>
      </div>
    )
  }

  // Dados processados
  const feedbacks = feedbacksData?.data || []
  const totalFeedbacks = feedbacksData?.total || 0
  const treinos = alunos?.flatMap((a: Aluno) => a.planosTreino || []) || []
  const planosAlimentares = alunos?.flatMap((a: Aluno) => a.planosAlimentar || []) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user.nome.split(" ")[0]}!</h1>
          <p className="text-gray-500">Bem-vindo ao seu dashboard</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Link href="/dashboard/coach/alunos/novo">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Aluno
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalAlunos}</div>
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Planos de Treino</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{treinos.length}</div>
              <Dumbbell className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Planos Alimentares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{planosAlimentares.length}</div>
              <Utensils className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Feedbacks Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalFeedbacks}</div>
              <MessageSquare className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alunos Recentes</CardTitle>
            <CardDescription>Seus alunos mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {alunos.length > 0 ? (
              <div className="space-y-4">
                {alunos.slice(0, 5).map((aluno: Aluno) => (
                  <div key={aluno.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                        {aluno.nome.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{aluno.nome}</h3>
                        <p className="text-sm text-gray-500">{aluno.email}</p>
                      </div>
                    </div>
                    <Link href={`/dashboard/coach/alunos/${aluno.id}`}>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum aluno cadastrado.</p>
            )}

            {alunos.length > 5 && (
              <div className="mt-4 text-center">
                <Link href="/dashboard/coach/alunos">
                  <Button variant="outline">Ver Todos</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedbacks Pendentes</CardTitle>
            <CardDescription>Feedbacks pendentes de resposta</CardDescription>
          </CardHeader>
          <CardContent>
            {feedbacks.length > 0 ? (
              <div className="space-y-4">
                {feedbacks.slice(0, 5).map((feedback: Feedback) => {
                  const aluno = alunos.find((a: Aluno) => a.id === feedback.alunoId)
                  return (
                    <div key={feedback.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                          {aluno?.nome.charAt(0) || "?"}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">{aluno?.nome || "Aluno"}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <Link href={`/dashboard/coach/feedbacks/${feedback.id}`}>
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum feedback pendente.</p>
            )}

            {feedbacks.length > 5 && (
              <div className="mt-4 text-center">
                <Link href="/dashboard/coach/feedbacks">
                  <Button variant="outline">Ver Todos</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}