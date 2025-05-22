"use client"

import { useAluno } from "@/hooks/useAluno"
import { useParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { usePlanosAlimentares } from "@/hooks/usePlanosAlimentares"

export default function AlunoDetailPage() {
  const params = useParams()
  const alunoId = params.id as string
  const { aluno, loading, error } = useAluno(alunoId)
  const [activeTab, setActiveTab] = useState("perfil")
  const {downloadPlanoAlimentar} = usePlanosAlimentares()

  if (loading || !aluno) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <Skeleton className="h-10 w-1/4" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  const handleDownloadPlanoAlimentar = async (planoId: string) => {
    try {
        await downloadPlanoAlimentar(planoId)
    } catch (error) {
      console.error("Erro ao baixar o plano alimentar:", error)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{aluno.nome}</h1>
        <Link href="/dashboard/coach/alunos">
          <Button variant="outline">Voltar para lista</Button>
        </Link>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="assinaturas">Assinaturas</TabsTrigger>
          <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
          <TabsTrigger value="planos">Planos</TabsTrigger>
        </TabsList>
        <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Aluno</CardTitle>
              <CardDescription>Detalhes pessoais e de contato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Nome</h3>
                  <p>{aluno.nome}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-medium">Email</h3>
                  <p>{aluno.email}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-medium">Telefone</h3>
                  <p>{aluno.telefone}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-medium">Data de Nascimento</h3>
                  <p>{new Date(aluno.dataNascimento).toLocaleDateString()}</p>
                </div>
                {aluno.coach && (
                  <div className="md:col-span-2">
                    <h3 className="mb-2 font-medium">Coach Responsável</h3>
                    <p>{aluno.coach.nome} ({aluno.coach.email})</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assinaturas">
          <Card>
            <CardHeader>
              <CardTitle>Assinaturas</CardTitle>
              <CardDescription>Histórico de assinaturas do aluno</CardDescription>
            </CardHeader>
            <CardContent>
              {aluno.assinaturas && aluno.assinaturas.length > 0 ? (
                <div className="space-y-4">
                  {aluno.assinaturas.map((assinatura) => (
                    <Card key={assinatura.id}>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-medium">{assinatura.plano?.titulo || "Plano"}</h3>
                          <Badge
                            className={
                              assinatura.status === "ATIVA"
                                ? "bg-green-100 text-green-800"
                                : assinatura.status === "PENDENTE"
                                ? "bg-yellow-100 text-yellow-800"
                                : assinatura.status === "PENDENTE_APROVACAO"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {assinatura.status}
                          </Badge>
                        </div>
                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Valor:</span>{" "}
                            <span>R$ {assinatura.valor.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Parcela:</span>{" "}
                            <span>
                              {assinatura.parcela}/{assinatura.totalParcelas}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Início:</span>{" "}
                            <span>{new Date(assinatura.dataInicio).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Fim:</span>{" "}
                            <span>{new Date(assinatura.dataFim).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {assinatura.comprovante_url && (
                          <div className="mt-2">
                            <a href={assinatura.comprovante_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                Ver comprovante
                              </Button>
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>Este aluno ainda não possui assinaturas.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedbacks">
          <Card>
            <CardHeader>
              <CardTitle>Feedbacks</CardTitle>
              <CardDescription>Histórico de feedbacks do aluno</CardDescription>
            </CardHeader>
            <CardContent>
              {aluno.feedbacks && aluno.feedbacks.length > 0 ? (
                <div className="space-y-4">
                  {aluno.feedbacks.map((feedback) => (
                    <Card key={feedback.id}>
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-medium">
                            Feedback de{" "}
                            {format(new Date(feedback.diaFeedback), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </h3>
                          <Badge>{feedback.seguiuPlano}</Badge>
                        </div>
                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Peso:</span>{" "}
                            <span>{feedback.peso || "Não informado"}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Qualidade do Sono:</span>{" "}
                            <span>{feedback.qualidadeSono}</span>
                          </div>
                        </div>
                        {feedback.observacoes && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-500">Observações:</span>
                            <p className="mt-1 text-sm">{feedback.observacoes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>Este aluno ainda não enviou feedbacks.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="planos">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Planos de Treino</CardTitle>
                <CardDescription>Planos de treino do aluno</CardDescription>
              </CardHeader>
              <CardContent>
                {aluno.planosTreino && aluno.planosTreino.length > 0 ? (
                  <div className="space-y-4">
                    {aluno.planosTreino.map((treino) => (
                      <div key={treino.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <h3 className="font-medium">{treino.titulo}</h3>
                          <p className="text-sm text-gray-500">{new Date(treino.createdAt).toLocaleDateString()}</p>
                        </div>
                        <a  target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            Visualizar
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Este aluno ainda não possui planos de treino.</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Planos Alimentares</CardTitle>
                <CardDescription>Planos alimentares do aluno</CardDescription>
              </CardHeader>
              <CardContent>
                {aluno.planosAlimentar && aluno.planosAlimentar.length > 0 ? (
                  <div className="space-y-4">
                    {aluno.planosAlimentar.map((plano) => (
                      <div key={plano.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <h3 className="font-medium">{plano.titulo}</h3>
                          <p className="text-sm text-gray-500">{new Date(plano.createdAt).toLocaleDateString()}</p>
                        </div>
                        <a target="_blank" rel="noopener noreferrer">
                          <Button  onClick={()=>handleDownloadPlanoAlimentar(plano.id)}  variant="outline" size="sm">
                            Visualizar
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Este aluno ainda não possui planos alimentares.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
