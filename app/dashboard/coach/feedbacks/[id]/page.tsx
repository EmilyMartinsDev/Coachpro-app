"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useFeedbacks } from "@/hooks/useFeedbacks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function FeedbackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const feedbackId = params.id as string
  const { getFeedbackById, getFeedbackPhotos } = useFeedbacks()

  const [feedback, setFeedback] = useState<any>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true)
      try {
        const feedbackData = await getFeedbackById(feedbackId)
        if (feedbackData) {
          setFeedback(feedbackData)

          // Fetch photos
          const photosData = await getFeedbackPhotos(feedbackId)
          setPhotos(photosData)
        } else {
          // Feedback not found, redirect back
          router.push("/dashboard/coach/feedbacks")
        }
      } catch (error) {
        console.error("Error fetching feedback:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [feedbackId, getFeedbackById, getFeedbackPhotos, router])

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

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Feedback de {format(new Date(feedback.diaFeedback), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardTitle>
              <CardDescription>Aluno: {feedback.aluno?.nome || "Aluno"}</CardDescription>
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
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Fotos</CardTitle>
              <CardDescription>Fotos enviadas com o feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {photos.length === 0 ? (
                <p>Nenhuma foto enviada com este feedback.</p>
              ) : (
                <div className="grid gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="overflow-hidden rounded-md">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt="Foto de feedback"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
