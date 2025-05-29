"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Calendar } from "lucide-react";
import { useTreinoAluno } from "@/hooks/aluno/useTreinoAluno";
import { useDietaAluno } from "@/hooks/aluno/useDietaAluno";
import type { PlanoTreino, PlanoAlimentar } from "@/lib/types";

export default function PlanosPage() {
  const { data: treinosData, isLoading: loadingTreinos, error: errorTreinos } = useTreinoAluno();
  const { data: dietasData, isLoading: loadingDietas, error: errorDietas } = useDietaAluno();

  const planosTreino = treinosData?.data || [];
  const planosAlimentares = dietasData?.data || [];


  const isLoading = loadingTreinos || loadingDietas;
  const error = errorTreinos || errorDietas;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Erro ao carregar dados dos planos.</p>
      </div>
    );
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
          <PlanoCard titulo="Planos de Treino" descricao="Seus planos de treino personalizados" planos={planosTreino} />
        </TabsContent>

        <TabsContent value="alimentar">
          <PlanoCard titulo="Planos Alimentares" descricao="Seus planos alimentares personalizados" planos={planosAlimentares} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface PlanoCardProps {
  titulo: string;
  descricao: string;
  planos: PlanoTreino[] | PlanoAlimentar[];
}

function PlanoCard({ titulo, descricao, planos }: PlanoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <CardDescription>{descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        {planos.length > 0 ? (
          <div className="space-y-6">
           
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
                            {plano.arquivo_url ? (
                              <Link href={plano.arquivo_url} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Ver
                                </Button>
                              </Link>
                            ) : (
                              <span className="text-sm text-gray-500">Sem arquivo</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum plano</h3>
            <p className="text-gray-500">Você ainda não possui {titulo.toLowerCase()}.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
