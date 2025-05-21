"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { useAlunos } from "@/hooks/useAlunos"
import { useFeedbacks } from "@/hooks/useFeedbacks"
import { useTreinos } from "@/hooks/useTreinos"
import { usePlanosAlimentares } from "@/hooks/usePlanosAlimentares"
import Link from "next/link"
import { ArrowRight, Dumbbell, MessageSquare, UserPlus, Users, Utensils } from "lucide-react"
import { Coach, Aluno, Feedback } from "@/lib/types"

export default function CoachDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const { alunos, loading: alunosLoading } = useAlunos(user?.id)
  const { feedbacks, loading: feedbacksLoading } = useFeedbacks()
  const { treinos, loading: treinosLoading } = useTreinos()
  const { planosAlimentares, loading: alimentaresLoading } = usePlanosAlimentares()

  const isLoading = authLoading || alunosLoading || feedbacksLoading || treinosLoading || alimentaresLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Erro ao carregar dados do coach.</p>
      </div>
    )
  }

  // Ordenar feedbacks por data (mais recente primeiro)
  const sortedFeedbacks = [...feedbacks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

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
              <div className="text-2xl font-bold">{alunos.length}</div>
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
            <CardTitle className="text-sm font-medium text-gray-500">Feedbacks Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{feedbacks.length}</div>
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
                {alunos.slice(0, 5).map((aluno) => (
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
            <CardTitle>Feedbacks Recentes</CardTitle>
            <CardDescription>Feedbacks recentes dos seus alunos</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedFeedbacks.length > 0 ? (
              <div className="space-y-4">
                {sortedFeedbacks.slice(0, 5).map((feedback) => {
                  const aluno = alunos.find((a) => a.id === feedback.alunoId)
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
              <p className="text-gray-500">Nenhum feedback recente.</p>
            )}

            {sortedFeedbacks.length > 5 && (
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
