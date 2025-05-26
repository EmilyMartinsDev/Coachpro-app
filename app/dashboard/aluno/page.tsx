"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Dumbbell, FileText, MessageSquare, Utensils, ArrowRight, ClipboardCheck } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useTreinoAluno } from "@/hooks/aluno/useTreinoAluno"
import { useDietaAluno } from "@/hooks/aluno/useDietaAluno"
import { useFeedbackAluno } from "@/hooks/aluno/useFeedbackAluno"
import { useAnamneseAluno } from "@/hooks/aluno/useAnamneseAluno"
import { useAssinaturasAluno } from "@/hooks/aluno/useAssinaturaAluno"


export default function AlunoDashboard() {
  const { user } = useAuth()

  const { enviarAnamnese } = useAnamneseAluno()

  const {data: treinos, isLoading: loadingTreinos} = useTreinoAluno()
  const{data: dietas, isLoading: loadingDietas} = useDietaAluno()
  const {data: feedbacks} = useFeedbackAluno()

  const [proximosFeedbacks, setProximosFeedbacks] = useState<{ data: string; status: string }[]>([])

  // Calcula próximos feedbacks baseado nos feedbacks do aluno
  useEffect(() => {
    if (!feedbacks) return
    const hoje = new Date()
    const proximos: { data: string; status: string }[] = [
      {
        data: new Date(hoje.setDate(hoje.getDate() + 7)).toISOString(),
        status: "pendente",
      },
      {
        data: new Date(hoje.setDate(hoje.getDate() + 14)).toISOString(),
        status: "pendente",
      },
    ]
    if (feedbacks.data.length > 0) {
      const ultimoFeedback = feedbacks.data[0]
      proximos.push({
        data: ultimoFeedback.createdAt.toString(),
        status: "concluido",
      })
    }
    setProximosFeedbacks(proximos)
  }, [feedbacks])

  const isLoading = loadingTreinos || loadingDietas

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
        <p>Erro ao carregar dados do usuário.</p>
      </div>
    )
  }

  const isNovoAluno = (!treinos || treinos.data.length === 0) && (!dietas || dietas.data.length === 0)

  // Se for um novo aluno, mostrar o card de boas-vindas e o link para o formulário de anamnese
  if (isNovoAluno) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Olá, {user.nome.split(" ")[0]}!</h1>
            <p className="text-gray-500">Bem-vindo(a) ao CoachPro</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Boas-vindas ao CoachPro!</CardTitle>
            <CardDescription>
              Estamos felizes em tê-lo(a) conosco. Para iniciarmos sua jornada, precisamos conhecer melhor você.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h3 className="flex items-center font-medium text-emerald-800">
                <ClipboardCheck className="h-5 w-5 mr-2" /> Próximo Passo: Preencher Formulário Inicial
              </h3>
              <p className="text-emerald-700 mt-2">
                Para que seu coach possa criar planos personalizados para você, precisamos que preencha o formulário de
                anamnese inicial com suas informações e objetivos.
              </p>
            </div>

            <Link href="/dashboard/aluno/anamnese">
              <Button size="lg" className="w-full md:w-auto mt-3">
                Preencher Formulário de Anamnese
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>

            <div className="text-sm text-gray-500 mt-4">
              <p>
                Este formulário inclui perguntas sobre seus dados pessoais, medidas corporais, rotina, histórico de
                treino, alimentação e objetivos. Essas informações são fundamentais para que seu coach possa desenvolver
                planos adequados às suas necessidades.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Se não for aluno novo, mostrar o dashboard normal
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user.nome.split(" ")[0]}!</h1>
          <p className="text-gray-500">Bem-vindo ao seu dashboard</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/dashboard/aluno/feedback">
            <Button>
              Enviar Feedback
              <MessageSquare className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Planos de Treino</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{treinos?.data.length || 0}</div>
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
              <div className="text-2xl font-bold">{dietas?.data.length || 0}</div>
              <Utensils className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Próximo Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {proximosFeedbacks.length > 0
                  ? new Date(proximosFeedbacks[0].data).toLocaleDateString("pt-BR")
                  : "Nenhum"}
              </div>
              <Calendar className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seus Planos</CardTitle>
          <CardDescription>Acesse seus planos de treino e alimentação</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="treino">
            <TabsList className="mb-4">
              <TabsTrigger value="treino">Planos de Treino</TabsTrigger>
              <TabsTrigger value="alimentar">Planos Alimentares</TabsTrigger>
            </TabsList>

            <TabsContent value="treino">
              {treinos && treinos.data.length > 0 ? (
                <div className="space-y-4">
                  {treinos.data.map((plano) => (
                    <div key={plano.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-emerald-600 mr-3" />
                        <div>
                          <h3 className="font-medium">{plano.titulo}</h3>
                          <p className="text-sm text-gray-500">
                            Criado em {new Date(plano.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <Link href={`/dashboard/aluno/planos/treino/${plano.id}`}>
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum plano de treino disponível.</p>
              )}
            </TabsContent>

            <TabsContent value="alimentar">
              {dietas && dietas.data.length > 0 ? (
                <div className="space-y-4">
                  {dietas.data.map((plano) => (
                    <div key={plano.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-emerald-600 mr-3" />
                        <div>
                          <h3 className="font-medium">{plano.titulo}</h3>
                          <p className="text-sm text-gray-500">
                            Criado em {new Date(plano.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <Link href={`/dashboard/aluno/planos/alimentar/${plano.id}`}>
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum plano alimentar disponível.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}