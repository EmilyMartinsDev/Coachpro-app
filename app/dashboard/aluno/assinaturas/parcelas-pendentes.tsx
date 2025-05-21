"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, Calendar, Clock, AlertCircle } from "lucide-react"
import { mockGetAssinaturas, mockGetPlanos, mockLogin, mockVerificarStatusAssinaturas } from "@/lib/mock-data"
import type { Assinatura, Plano } from "@/lib/types"

export default function ParcelasPendentesPage() {
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

  // Filtrar apenas assinaturas com parcelas pendentes
  const assinaturasComParcelasPendentes = assinaturas.filter(
    (assinatura) =>
      assinatura.parcela < assinatura.totalParcelas &&
      (assinatura.status === "ATIVA" || assinatura.status === "PENDENTE"),
  )

  // Calcular próximas parcelas para cada assinatura
  const proximasParcelas = assinaturasComParcelasPendentes.map((assinatura) => {
    const plano = planos.find((p) => p.id === assinatura.planoId)
    const proximaParcela = assinatura.parcela + 1
    const valorParcela = assinatura.valor / assinatura.totalParcelas

    // Calcular data de vencimento (simulação)
    const dataInicio = new Date(assinatura.dataInicio)
    const mesesPorParcela = Math.ceil(12 / assinatura.totalParcelas)
    const dataVencimento = new Date(dataInicio)
    dataVencimento.setMonth(dataInicio.getMonth() + (proximaParcela - 1) * mesesPorParcela)

    // Calcular dias até o vencimento
    const hoje = new Date()
    const diasAteVencimento = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))

    return {
      assinaturaId: assinatura.id,
      planoNome: plano?.titulo || "Plano",
      parcela: proximaParcela,
      totalParcelas: assinatura.totalParcelas,
      valor: valorParcela,
      dataVencimento,
      diasAteVencimento,
      status: diasAteVencimento <= 0 ? "vencida" : diasAteVencimento <= 7 ? "proxima" : "futura",
    }
  })

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
        <h1 className="text-2xl font-bold">Parcelas Pendentes</h1>
        <p className="text-gray-500">Acompanhe e gerencie suas parcelas pendentes</p>
      </div>

      {proximasParcelas.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Próximas Parcelas</CardTitle>
            <CardDescription>Parcelas pendentes de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plano</TableHead>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proximasParcelas.map((parcela, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{parcela.planoNome}</TableCell>
                    <TableCell>
                      {parcela.parcela}/{parcela.totalParcelas}
                    </TableCell>
                    <TableCell>R$ {parcela.valor.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        {parcela.dataVencimento.toLocaleDateString("pt-BR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {parcela.status === "vencida" ? (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                          <AlertCircle className="h-3 w-3 mr-1" /> Vencida
                        </Badge>
                      ) : parcela.status === "proxima" ? (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          <Clock className="h-3 w-3 mr-1" /> Vence em {parcela.diasAteVencimento} dias
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          <Clock className="h-3 w-3 mr-1" /> Vence em {parcela.diasAteVencimento} dias
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/aluno/assinaturas/${parcela.assinaturaId}/pagamento`}>
                        <Button size="sm">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pagar Parcela
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhuma parcela pendente</h3>
            <p className="text-gray-500 text-center mb-4">
              Você não possui parcelas pendentes de pagamento no momento.
            </p>
            <Link href="/dashboard/aluno/assinaturas">
              <Button variant="outline">Ver Todas as Assinaturas</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Pagamentos</CardTitle>
          <CardDescription>Visão geral dos seus pagamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-1">Parcelas Pagas</h3>
              <p className="text-2xl font-bold text-green-700">
                {assinaturas.reduce((total, assinatura) => total + assinatura.parcela, 0)}
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-1">Parcelas Pendentes</h3>
              <p className="text-2xl font-bold text-yellow-700">
                {assinaturas.reduce((total, assinatura) => {
                  if (assinatura.status === "CANCELADA" || assinatura.status === "INATIVA") return total
                  return total + (assinatura.totalParcelas - assinatura.parcela)
                }, 0)}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-1">Total a Pagar</h3>
              <p className="text-2xl font-bold text-blue-700">
                R${" "}
                {assinaturas
                  .filter((a) => a.status !== "CANCELADA" && a.status !== "INATIVA")
                  .reduce((total, assinatura) => {
                    const valorPorParcela = assinatura.valor / assinatura.totalParcelas
                    return total + valorPorParcela * (assinatura.totalParcelas - assinatura.parcela)
                  }, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
