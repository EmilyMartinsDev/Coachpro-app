"use client";

import { useState } from "react";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";
import { useListarAnamneses } from "@/hooks/coach/useAnamnese";

export default function AnamnesesPage() {
  const [search, setSearch] = useState("");
  const [alunoId, setAlunoId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [activeTab, setActiveTab] = useState<"todos" | "analisados" | "nao_analisados">("todos");

  const analisado = activeTab === "todos" ? undefined : activeTab === "analisados";

  const { data: anamneses, isLoading } = useListarAnamneses({
    search: search || undefined,
    alunoId: alunoId || undefined,
    dataInicio: dataInicio || undefined,
    dataFim: dataFim || undefined,
    analisado
  });

  return (
    <div className="space-y-6 p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Anamneses</h1>
          <p className="text-gray-500">Listagem de anamneses enviadas pelos alunos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as anamneses por status, aluno, data e busca.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Input placeholder="ID do Aluno" value={alunoId} onChange={(e) => setAlunoId(e.target.value)} />
            <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="analisados">Analisados</TabsTrigger>
          <TabsTrigger value="nao_analisados">Não Analisados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <>
              {anamneses && anamneses.data.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Anamneses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Aluno ID</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Analisado</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {anamneses.data.map((anamnese) => (
                          <TableRow key={anamnese.id}>
                            <TableCell>{anamnese.alunoId}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                {new Date(anamnese.createdAt).toLocaleDateString("pt-BR")}
                              </div>
                            </TableCell>
                            <TableCell>
                              {anamnese.aluno?.planosTreino?.length > 0  || anamnese.aluno?.planosAlimentar?.length > 0 ? (
                                <span className="text-green-600 font-medium">Sim</span>
                              ) : (
                                <span className="text-red-600 font-medium">Não</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/dashboard/coach/anamneses/${anamnese.id}`}>
                                <Button size="sm" variant="outline">
                                  Detalhes
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
                    <h3 className="text-lg font-medium mb-2">Nenhuma anamnese encontrada</h3>
                    <p className="text-gray-500 text-center">Tente ajustar os filtros ou aguarde novos envios.</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
