"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Download, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useAluno } from "@/hooks/useAluno"
import type { PlanoTreino, PlanoAlimentar } from "@/lib/types"

export default function PlanosPage() {
  const { user } = useAuth()
  const { aluno, loading, error } = useAluno(user?.id)

  // Usa os planos aninhados do aluno
  const planosTreino = aluno?.planosTreino || []
  const planosAlimentares = aluno?.planosAlimentar || []

  // Agrupar planos por versão (mesmo título)
  const agruparPlanosPorVersao = (planos: (PlanoTreino | PlanoAlimentar)[]) => {
    const grupos: Record<string, (PlanoTreino | PlanoAlimentar)[]> = {}
    planos.forEach((plano) => {
      if (!grupos[plano.titulo]) {
        grupos[plano.titulo] = []
      }
      grupos[plano.titulo].push(plano)
    })
    // Ordenar cada grupo por data (mais recente primeiro)
    Object.keys(grupos).forEach((titulo) => {
      grupos[titulo].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    })
    return grupos
  }

  const planosTreinoAgrupados = agruparPlanosPorVersao(planosTreino)
  const planosAlimentaresAgrupados = agruparPlanosPorVersao(planosAlimentares)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }
  if (error || !aluno) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Erro ao carregar dados do aluno.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meus Planos</h1>
        <p className="text-gray-500">Visualize seus planos de treino e alimentação</p>
      </div>

      <Tabs defaultValue="treino" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="treino">Planos de Treino</TabsTrigger>
          <TabsTrigger value="alimentar">Planos Alimentares</TabsTrigger>
        </TabsList>

        <TabsContent value="treino">
          <Card>
            <CardHeader>
              <CardTitle>Planos de Treino</CardTitle>
              <CardDescription>Seus planos de treino personalizados</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(planosTreinoAgrupados).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(planosTreinoAgrupados).map(([titulo, planos]) => (
                    <div key={titulo} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-emerald-600 mr-3" />
                          <div>
                            <h3 className="font-medium">{titulo}</h3>
                            <p className="text-sm text-gray-500">
                              {planos.length > 1 ? `${planos.length} versões` : "1 versão"}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800">Atual</Badge>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Versão</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {planos.map((plano, index) => (
                            <TableRow key={plano.id}>
                              <TableCell>
                                {index === 0 ? (
                                  <Badge className="bg-emerald-100 text-emerald-800">Atual</Badge>
                                ) : (
                                  <Badge variant="outline">v{planos.length - index}</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                  {new Date(plano.createdAt).toLocaleDateString("pt-BR")}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Link href={`/dashboard/aluno/planos/treino/${plano.id}`}>
                                    <Button size="sm" variant="outline">
                                      <Eye className="h-4 w-4 mr-1" />
                                      Ver
                                    </Button>
                                  </Link>
                                  <Button size="sm" variant="outline">
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum plano de treino</h3>
                  <p className="text-gray-500">Você ainda não possui planos de treino.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alimentar">
          <Card>
            <CardHeader>
              <CardTitle>Planos Alimentares</CardTitle>
              <CardDescription>Seus planos alimentares personalizados</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(planosAlimentaresAgrupados).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(planosAlimentaresAgrupados).map(([titulo, planos]) => (
                    <div key={titulo} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-emerald-600 mr-3" />
                          <div>
                            <h3 className="font-medium">{titulo}</h3>
                            <p className="text-sm text-gray-500">
                              {planos.length > 1 ? `${planos.length} versões` : "1 versão"}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800">Atual</Badge>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Versão</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {planos.map((plano, index) => (
                            <TableRow key={plano.id}>
                              <TableCell>
                                {index === 0 ? (
                                  <Badge className="bg-emerald-100 text-emerald-800">Atual</Badge>
                                ) : (
                                  <Badge variant="outline">v{planos.length - index}</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                  {new Date(plano.createdAt).toLocaleDateString("pt-BR")}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Link href={`/dashboard/aluno/planos/alimentar/${plano.id}`}>
                                    <Button size="sm" variant="outline">
                                      <Eye className="h-4 w-4 mr-1" />
                                      Ver
                                    </Button>
                                  </Link>
                                  <Button size="sm" variant="outline">
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum plano alimentar</h3>
                  <p className="text-gray-500">Você ainda não possui planos alimentares.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
