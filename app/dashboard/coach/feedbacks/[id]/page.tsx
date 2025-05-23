"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useCoachContext } from "@/lib/CoachContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useFeedbacks } from "@/hooks/useFeedbacks"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { usePlanosAlimentares } from "@/hooks/usePlanosAlimentares"
import { useTreinos } from "@/hooks/useTreinos"
import { FileText, Download } from "lucide-react"
import { FeedbackPhotosCarousel } from "@/components/feedback-carrousel"

export default function FeedbackDetailPage() {
  const params = useParams()
  const feedbackId = params.id as string
  const { coach, loading, error } = useCoachContext()

  // Garante que coach e coach.alunos existem antes de acessar
  const feedback = coach?.alunos?.flatMap((a: any) => a.feedbacks || []).find((fb: any) => fb.id === feedbackId)
  const aluno = coach?.alunos?.find((a: any) => a.id === feedback?.alunoId)
  const { updateRespostaFeedback } = useFeedbacks()
  const { createPlanoAlimentar, planosAlimentares, loading: loadingPlanosAlimentares } = usePlanosAlimentares(aluno?.id)
  const { createPlanoTreino, treinos, loading: loadingPlanosTreino } = useTreinos(aluno?.id)

  const [resposta, setResposta] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erroResposta, setErroResposta] = useState<string | null>(null)
  const [feedbackLocal, setFeedbackLocal] = useState(feedback)
  const [tab, setTab] = useState("detalhes")
  const [planoAlimentarFile, setPlanoAlimentarFile] = useState<File | null>(null)
  const [planoTreinoFile, setPlanoTreinoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [planoAlimentarTitulo, setPlanoAlimentarTitulo] = useState("")
  const [planoAlimentarDescricao, setPlanoAlimentarDescricao] = useState("")
  const [planoTreinoTitulo, setPlanoTreinoTitulo] = useState("")
  const [planoTreinoDescricao, setPlanoTreinoDescricao] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setFeedbackLocal(feedback)
  }, [feedback])

  const handleResponderFeedback = async () => {
    setErroResposta(null)
    const parsed = z.object({
      resposta: z.string().min(1, 'Resposta não pode ser vazia'),
    }).safeParse({ resposta })
    if (!parsed.success) {
      setErroResposta(parsed.error.errors[0].message)
      return
    }
    setEnviando(true)
    try {
      const atualizado = await updateRespostaFeedback(feedback.id, { resposta, respondido: true })
      setFeedbackLocal(atualizado)
      setResposta("")
      toast({ title: "Resposta enviada com sucesso!", variant: "default" })
    } catch (error) {
      setErroResposta("Erro ao responder feedback. Tente novamente.")
      toast({ title: "Erro ao responder feedback", description: String(error), variant: "destructive" })
    } finally {
      setEnviando(false)
    }
  }

  const handlePlanoAlimentarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPlanoAlimentarFile(e.target.files[0])
    }
  }

  const handlePlanoTreinoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPlanoTreinoFile(e.target.files[0])
    }
  }

  const handleUploadPlanos = async () => {
    setUploading(true)
    try {
      if (planoAlimentarFile && planoAlimentarTitulo) {
        await createPlanoAlimentar({
          titulo: planoAlimentarTitulo,
          descricao: planoAlimentarDescricao,
          alunoId: aluno?.id!,
          coachId: coach?.id!,
          arquivo: planoAlimentarFile,
        })
      }
      if (planoTreinoFile && planoTreinoTitulo) {
        await createPlanoTreino({
          titulo: planoTreinoTitulo,
          descricao: planoTreinoDescricao,
          alunoId: aluno?.id!,
          coachId: coach?.id!,
          arquivo: planoTreinoFile,
        })
      }
      setPlanoAlimentarFile(null)
      setPlanoAlimentarTitulo("")
      setPlanoAlimentarDescricao("")
      setPlanoTreinoFile(null)
      setPlanoTreinoTitulo("")
      setPlanoTreinoDescricao("")
      toast({ title: "Planos enviados com sucesso!", variant: "default" })
    } catch (err) {
      toast({ title: "Erro ao enviar planos", description: String(err), variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <Skeleton className="h-10 w-1/4" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }
  if (error || !coach) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-red-500">{error || "Erro ao carregar coach."}</p>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="container mx-auto py-6">
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          <p>Feedback não encontrado.</p>
        </div>
        <div className="mt-4">
          <Link href="/dashboard/coach/feedbacks">
            <Button>Voltar para lista</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Detalhes do Feedback</h1>
        <Link href="/dashboard/coach/feedbacks">
          <Button variant="outline">Voltar para lista</Button>
        </Link>
      </div>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="planos">Anexar Planos</TabsTrigger>
        </TabsList>
   <TabsContent value="detalhes">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Feedback de {format(new Date(feedback.diaFeedback), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </CardTitle>
                  <CardDescription>Aluno: {aluno?.nome || "Aluno"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-lg font-medium">Informações Gerais</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Seguiu o Plano:</span>{" "}
                          <Badge
                            className={
                              feedback.seguiuPlano === "TOTALMENTE"
                                ? "bg-green-100 text-green-800"
                                : feedback.seguiuPlano === "PARCIALMENTE"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {feedback.seguiuPlano}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Peso:</span>{" "}
                          <span>{feedback.peso || "Não informado"}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Manteve Protocolo:</span>{" "}
                          <Badge
                            className={
                              feedback.manteveProtocolo === "TOTALMENTE"
                                ? "bg-green-100 text-green-800"
                                : feedback.manteveProtocolo === "PARCIALMENTE"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {feedback.manteveProtocolo}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="mb-2 text-lg font-medium">Alimentação</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Comeu a Mais:</span>{" "}
                          <span>{feedback.comeuAMais || "Não informado"}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Refeições Perdidas:</span>{" "}
                          <span>{feedback.refeicoesPerdidas || "Não informado"}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Refeição Livre:</span>{" "}
                          <span>{feedback.refeicaoLivre || "Não informado"}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Digestão/Intestino:</span>{" "}
                          <span>{feedback.digestaoIntestino || "Não informado"}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Dificuldade com Alimentos:</span>{" "}
                          <span>{feedback.dificuldadeAlimentos || "Não informado"}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="mb-2 text-lg font-medium">Sono e Bem-estar</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Horas de Sono:</span>{" "}
                          <span>{feedback.horasSono || "Não informado"}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Qualidade do Sono:</span>{" "}
                          <Badge
                            className={
                              feedback.qualidadeSono === "OTIMA" || feedback.qualidadeSono === "BOA"
                                ? "bg-green-100 text-green-800"
                                : feedback.qualidadeSono === "REGULAR"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {feedback.qualidadeSono}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Acordou Cansado:</span>{" "}
                          <span>{feedback.acordouCansado ? "Sim" : "Não"}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Período Menstrual:</span>{" "}
                          <span>{feedback.periodoMenstrual ? "Sim" : "Não"}</span>
                        </div>
                      </div>
                    </div>

                    {feedback.efeitosColaterais && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="mb-2 text-lg font-medium">Efeitos Colaterais</h3>
                          <p>{feedback.efeitosColaterais}</p>
                        </div>
                      </>
                    )}

                    {feedback.observacoes && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="mb-2 text-lg font-medium">Observações</h3>
                          <p>{feedback.observacoes}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Resposta do coach ou textarea para responder */}
              {feedbackLocal?.respondido ? (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Resposta do Coach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line text-gray-800">{feedbackLocal.resposta || feedbackLocal.respostaCoach}</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Responder feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-2">
                      Responda ao feedback do aluno aqui. Sua resposta será enviada por e-mail.
                    </p>
                    <Textarea
                      placeholder="Digite sua resposta aqui..."
                      value={resposta}
                      onChange={e => setResposta(e.target.value)}
                      disabled={enviando}
                    />
                    {erroResposta && <p className="text-red-500 text-sm mt-2">{erroResposta}</p>}
                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleResponderFeedback} disabled={enviando || !resposta.trim()}>
                        {enviando ? "Enviando..." : "Enviar Resposta"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Fotos</CardTitle>
                  <CardDescription>Fotos enviadas com o feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  {feedback.fotos && feedback.fotos.length === 0 ? (
                    <p>Nenhuma foto enviada com este feedback.</p>
                  ) : (
                  <FeedbackPhotosCarousel photos={feedback.fotos} key={feedback.id}/>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="planos">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Anexar Planos Atualizados</CardTitle>
                <CardDescription>Envie o plano alimentar e/ou o plano de treino atualizado para o aluno.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block font-medium mb-1">Plano Alimentar (PDF)</label>
                    <Input 
                      type="file" 
                      accept="application/pdf" 
                      onChange={handlePlanoAlimentarChange} 
                      disabled={uploading}
                    />
                    <Input
                      className="mt-2"
                      placeholder="Título do plano alimentar*"
                      value={planoAlimentarTitulo}
                      onChange={e => setPlanoAlimentarTitulo(e.target.value)}
                      disabled={uploading}
                      required
                    />
                    <Textarea
                      className="mt-2"
                      placeholder="Descrição (opcional)"
                      value={planoAlimentarDescricao}
                      onChange={e => setPlanoAlimentarDescricao(e.target.value)}
                      disabled={uploading}
                      rows={3}
                    />
                    {planoAlimentarFile && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <FileText className="mr-2 h-4 w-4" />
                        {planoAlimentarFile.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Plano de Treino (PDF)</label>
                    <Input 
                      type="file" 
                      accept="application/pdf" 
                      onChange={handlePlanoTreinoChange} 
                      disabled={uploading}
                    />
                    <Input
                      className="mt-2"
                      placeholder="Título do plano de treino*"
                      value={planoTreinoTitulo}
                      onChange={e => setPlanoTreinoTitulo(e.target.value)}
                      disabled={uploading}
                      required
                    />
                    <Textarea
                      className="mt-2"
                      placeholder="Descrição (opcional)"
                      value={planoTreinoDescricao}
                      onChange={e => setPlanoTreinoDescricao(e.target.value)}
                      disabled={uploading}
                      rows={3}
                    />
                    {planoTreinoFile && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <FileText className="mr-2 h-4 w-4" />
                        {planoTreinoFile.name}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleUploadPlanos}
                      disabled={
                        uploading ||
                        ((!planoAlimentarFile || !planoAlimentarTitulo) && 
                         (!planoTreinoFile || !planoTreinoTitulo))
                      }
                    >
                      {uploading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </span>
                      ) : (
                        "Enviar Planos"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Planos Recentes</CardTitle>
                <CardDescription>Planos enviados anteriormente para este aluno</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPlanosAlimentares || loadingPlanosTreino ? (
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-medium">Planos Alimentares</h3>
                    {planosAlimentares.length === 0 ? (
                      <p className="text-sm text-gray-500">Nenhum plano alimentar enviado recentemente.</p>
                    ) : (
                      <div className="space-y-2">
                        {planosAlimentares.slice(0, 3).map((plano: any) => (
                          <div key={plano.id} className="flex items-center justify-between rounded-md border p-3">
                            <div>
                              <p className="font-medium">{plano.titulo}</p>
                              <p className="text-sm text-gray-500">
                                {format(new Date(plano.createdAt), "dd/MM/yyyy")}
                              </p>
                              {plano.descricao && (
                                <p className="text-sm text-gray-600 mt-1">{plano.descricao}</p>
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownload(plano.arquivo_url, `plano-alimentar-${plano.titulo}.pdf`)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Baixar
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <h3 className="font-medium mt-6">Planos de Treino</h3>
                    {treinos.length === 0 ? (
                      <p className="text-sm text-gray-500">Nenhum plano de treino enviado recentemente.</p>
                    ) : (
                      <div className="space-y-2">
                        {treinos.slice(0, 3).map((plano: any) => (
                          <div key={plano.id} className="flex items-center justify-between rounded-md border p-3">
                            <div>
                              <p className="font-medium">{plano.titulo}</p>
                              <p className="text-sm text-gray-500">
                                {format(new Date(plano.createdAt), "dd/MM/yyyy")}
                              </p>
                              {plano.descricao && (
                                <p className="text-sm text-gray-600 mt-1">{plano.descricao}</p>
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownload(plano.arquivo_url, `plano-treino-${plano.titulo}.pdf`)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Baixar
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}