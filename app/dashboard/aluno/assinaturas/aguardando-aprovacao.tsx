"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HourglassIcon, Calendar, CreditCard } from "lucide-react"
import { mockGetAssinaturas, mockGetPlanos, mockLogin, mockVerificarStatusAssinaturas } from "@/lib/mock-data"
import type { Assinatura, Plano } from "@/lib/types"

export default function AguardandoAprovacaoPage() {
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([])
  const [planos, setPlanos] = useState<Plano[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simular login como aluno para testes
        await mockLogin("maria.oliveira@exemplo.com", "senha", "aluno")

        // Verificar e atualizar status das assinaturas
        await mockVerificarStatusAssinaturas()

        const assinaturasData = await mockGetAssinaturas()
        const planosData = await mockGetPlanos()

        setAssinaturas(assinaturasData)
        setPlanos(planosData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar apenas assinaturas aguardando aprovação
  const assinaturasAguardandoAprovacao = assinaturas.filter((assinatura) => assinatura.status === "PENDENTE_APROVACAO")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Aguardando Aprovação</h1>
        <p className="text-gray-500">Pagamentos que estão aguardando aprovação do coach</p>
      </div>

      {assinaturasAguardandoAprovacao.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assinaturasAguardandoAprovacao.map((assinatura) => {
            const plano = planos.find((p) => p.id === assinatura.planoId)
            const pagamentoPendente = assinatura.pagamentos?.find((p) => !p.aprovado)

            return (
              <Card key={assinatura.id} className="border-yellow-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plano?.titulo || "Plano"}</CardTitle>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      <HourglassIcon className="h-3 w-3 mr-1" /> Aguardando Aprovação
                    </Badge>
                  </div>
                  <CardDescription>
                    Pagamento enviado em{" "}
                    {pagamentoPendente ? new Date(pagamentoPendente.data).toLocaleDateString("pt-BR") : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Parcela:</span>
                    <span className="font-medium">
                      {pagamentoPendente?.parcela || "?"}/{assinatura.totalParcelas}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Valor:</span>
                    <span className="font-medium">
                      R$ {(assinatura.valor / assinatura.totalParcelas || 0).toFixed(2)}
                    </span>
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

                  <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
                    <p className="font-medium mb-1">Comprovante enviado</p>
                    <p>Seu pagamento está sendo analisado pelo coach e será aprovado em breve.</p>
                  </div>

                  {pagamentoPendente?.comprovante_url && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">Comprovante enviado:</p>
                      <div className="aspect-[4/3] relative rounded-md overflow-hidden border">
                        <Image
                          src={pagamentoPendente.comprovante_url || "/placeholder.svg"}
                          alt="Comprovante de pagamento"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum pagamento aguardando aprovação</h3>
            <p className="text-gray-500 text-center mb-4">
              Você não possui pagamentos pendentes de aprovação no momento.
            </p>
            <Link href="/dashboard/aluno/assinaturas">
              <Button variant="outline">Ver Todas as Assinaturas</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
