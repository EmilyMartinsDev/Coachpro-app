"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useFeedbackAluno } from "@/hooks/aluno/useFeedbackAluno";

export default function ProgressoPage() {
  const { data: feedbacksResponse, isLoading } = useFeedbackAluno();
  const feedbacks = feedbacksResponse?.data || [];

  const [currentView, setCurrentView] = useState<"lista" | "comparacao">("lista");
  const [selectedFotos, setSelectedFotos] = useState<any[]>([]);

  const toggleFotoSelecionada = (foto: any) => {
    const isSelected = selectedFotos.some((f) => f.id === foto.id);
    if (isSelected) {
      setSelectedFotos(selectedFotos.filter((f) => f.id !== foto.id));
    } else {
      if (selectedFotos.length < 2) {
        setSelectedFotos([...selectedFotos, foto]);
      } else {
        setSelectedFotos([selectedFotos[1], foto]);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-6 py-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meu Progresso</h1>
          <p className="text-gray-500">Selecione até 2 fotos para comparar visualmente sua evolução.</p>
        </div>
        <Link href="/dashboard/aluno/feedbacks">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as any)}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="lista">Lista de Fotos</TabsTrigger>
          <TabsTrigger value="comparacao">Comparação</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-6">
          {feedbacks.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum feedback com fotos encontrado.</p>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((fb) => (
                <Card key={fb.id} className="shadow-md hover:shadow-xl transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Feedback - {new Date(fb.createdAt).toLocaleDateString("pt-BR")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-4">
                    {fb.fotos?.length ? (
                      fb.fotos.map((foto: any, index: number) => (
                        <div
                          key={foto.id}
                          className={`relative rounded-lg overflow-hidden cursor-pointer group border-4 ${
                            selectedFotos.some((f) => f.id === foto.id)
                              ? "border-emerald-500"
                              : "border-transparent"
                          }`}
                          onClick={() => toggleFotoSelecionada(foto)}
                        >
                          <Image
                            src={foto.url}
                            alt={`Foto ${index + 1}`}
                            width={160}
                            height={160}
                            className="object-cover rounded-lg group-hover:opacity-80 transition"
                          />
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded">
                            Foto {index + 1}
                          </div>
                          {selectedFotos.some((f) => f.id === foto.id) && (
                            <div className="absolute inset-0 bg-emerald-500 bg-opacity-50 flex items-center justify-center text-white text-xl font-bold">
                              ✓
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Sem fotos</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparacao" className="mt-6">
          {selectedFotos.length < 2 ? (
            <p className="text-center text-gray-500">
              Selecione 2 fotos na aba "Todas as Fotos" para comparar.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedFotos.map((foto, index) => (
                <Card key={foto.id} className="shadow-md">
                  <CardContent className="flex flex-col items-center p-4 space-y-4">
                    <Image
                      src={foto.url}
                      alt={`Foto comparação ${index + 1}`}
                      width={400}
                      height={400}
                      className="object-cover rounded-lg shadow"
                    />
                    <div className="text-center space-y-1">
                      <span className="text-gray-600 text-sm">
                        Data: {new Date(foto.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                      <p className="text-gray-500 text-xs">Foto {index + 1} da comparação</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedFotos.length > 0 && (
        <div className="text-center">
          <Button variant="destructive" onClick={() => setSelectedFotos([])}>
            Limpar seleção
          </Button>
        </div>
      )}
    </div>
  );
}
