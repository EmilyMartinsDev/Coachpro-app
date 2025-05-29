"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useState } from "react";
import { useDetalhesAnamnese } from "@/hooks/coach/useAnamnese";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AnexarPlanos } from "@/components/anexar-planos";

export default function DetalhesAnamnesePage() {
  const params = useParams();
  const anamneseId = params?.id as string;

  const { data: anamnese, isLoading, error } = useDetalhesAnamnese(anamneseId);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openImage = (index: number) => setSelectedIndex(index);
  const closeImage = () => setSelectedIndex(null);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (anamnese && selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % anamnese.fotos.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (anamnese && selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + anamnese.fotos.length) % anamnese.fotos.length);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !anamnese) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Erro ao carregar anamnese ou anamnese não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Detalhes da Anamnese</h1>
        <div className="flex items-center gap-4">
          <p className="text-gray-600">Aluno: {anamnese.aluno.nome}</p>
          <Badge variant={anamnese.analisada ? "default" : "destructive"}>
            {anamnese.analisada ? "Analisada" : "Pendente"}
          </Badge>
        </div>
        <Separator />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seção de Informações Pessoais */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoSection
              items={[
                { label: "Nome Completo", value: anamnese.nomeCompleto },
                { label: "Data Nascimento", value: formatDate(anamnese.dataNascimento) },
                { label: "CPF", value: anamnese.cpf },
                { label: "Email", value: anamnese.email },
                { label: "Instagram", value: anamnese.instagram || "Não informado" },
                { label: "Endereço", value: anamnese.endereco || "Não informado" },
              ]}
            />
          </CardContent>
        </Card>

        {/* Seção de Medidas Corporais */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Medidas Corporais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Altura" value={`${anamnese.altura} m`} />
              <InfoItem label="Peso" value={`${anamnese.peso} kg`} />
              <InfoItem label="Cintura" value={anamnese.medidaCintura || "Não informado"} />
              <InfoItem label="Abdômen" value={anamnese.medidaAbdomen || "Não informado"} />
              <InfoItem label="Quadril" value={anamnese.medidaQuadril || "Não informado"} />
            </div>
          </CardContent>
        </Card>

        {/* Seção de Saúde */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Saúde e Histórico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoSection
              items={[
                { label: "Possui Exames", value: anamnese.possuiExames ? "Sim" : "Não" },
                { label: "Intolerâncias", value: anamnese.intolerancias || "Não informado" },
                { label: "Lesões", value: anamnese.lesoes || "Não informado" },
                { label: "Problemas de Saúde", value: anamnese.problemasSaude || "Não informado" },
                { label: "Anabolizantes", value: anamnese.anabolizantes || "Não informado" },
                { label: "Suplementos", value: anamnese.suplementos || "Não informado" },
              ]}
            />
          </CardContent>
        </Card>

        {/* Seção de Treino */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Rotina de Treino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoSection
              items={[
                { label: "Tempo de Treino", value: anamnese.tempoTreino },
                { label: "Modalidade", value: anamnese.modalidade },
                { label: "Divisão de Treino", value: anamnese.divisaoTreino },
                { label: "Cardio", value: anamnese.cardio },
                { label: "Dificuldades", value: anamnese.dificuldades },
                { label: "Evolução Recente", value: anamnese.evolucaoRecente },
              ]}
            />
          </CardContent>
        </Card>

        {/* Seção de Alimentação */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Alimentação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoSection
              items={[
                { label: "Alimentação Diária", value: anamnese.alimentacaoDiaria },
                { label: "Refeições por Dia", value: anamnese.qtdRefeicoes },
                { label: "Alimentos Preferidos", value: anamnese.alimentosPreferidos },
                { label: "Horários de Fome", value: anamnese.horariosFome || "Não informado" },
              ]}
            />
          </CardContent>
        </Card>

        {/* Seção de Objetivos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Objetivos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">{anamnese.objetivos}</p>
          </CardContent>
        </Card>

        {/* Seção de Rotina */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Rotina</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">{anamnese.rotina}</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Fotos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Fotos</CardTitle>
              <CardDescription>
                {anamnese.fotos.length} foto(s) enviada(s) - Clique para ampliar
              </CardDescription>
            </div>
            <Badge variant="outline">
              Data: {formatDate(anamnese.dataPreenchimento)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {anamnese.fotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {anamnese.fotos.map((foto: any, index: number) => (
                <div
                  key={foto.id}
                  className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-emerald-500 transition-all group"
                  onClick={() => openImage(index)}
                >
                  <Image
                    src={foto.url || "/placeholder.svg"}
                    alt={`Foto ${index + 1} da anamnese`}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Image
                src="/no-images.svg"
                alt="Nenhuma foto enviada"
                width={120}
                height={120}
                className="opacity-50"
              />
              <p className="mt-4 text-gray-500">Nenhuma foto enviada pelo aluno</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de visualização de fotos */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeImage}>
        <DialogContent className="p-0 bg-transparent border-none max-w-[90vw] max-h-[90vh]">
          <VisuallyHidden>
            <DialogTitle>Visualizador de Fotos</DialogTitle>
          </VisuallyHidden>
          {selectedIndex !== null && (
            <div className="relative w-full h-[80vh]">
              <Image
                src={anamnese.fotos[selectedIndex].url || "/placeholder.svg"}
                alt={`Foto ${selectedIndex + 1} em detalhe`}
                fill
                className="object-contain"
                priority
              />
              <div className="absolute top-4 right-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={closeImage}
                  className="rounded-full bg-gray-900/50 hover:bg-gray-800/70 text-white"
                >
                  &times;
                  <VisuallyHidden>Fechar</VisuallyHidden>
                </Button>
              </div>
              {anamnese.fotos.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-900/50 hover:bg-gray-800/70 text-white"
                  >
                    &larr;
                    <VisuallyHidden>Anterior</VisuallyHidden>
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-900/50 hover:bg-gray-800/70 text-white"
                  >
                    &rarr;
                    <VisuallyHidden>Próxima</VisuallyHidden>
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedIndex + 1} / {anamnese.fotos.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AnexarPlanos alunoId={anamnese.alunoId}/>
    </div>
  );
}

function InfoSection({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <InfoItem key={idx} label={item.label} value={item.value} />
      ))}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900">{value || "Não informado"}</p>
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}