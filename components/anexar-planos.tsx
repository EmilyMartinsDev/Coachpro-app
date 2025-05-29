"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlunos } from "@/hooks/coach/useAlunos";
import { Loader2 } from "lucide-react";

interface AnexarPlanosProps {
  alunoId: string;
}

export function AnexarPlanos({ alunoId }: AnexarPlanosProps) {
  const {
    anexarPlanoAlimentar,
    anexarPlanoTreino,
  } = useAlunos({});

  const [dietFile, setDietFile] = useState<File | null>(null);
  const [trainingFile, setTrainingFile] = useState<File | null>(null);
  const dietInputRef = useRef<HTMLInputElement>(null);
  const trainingInputRef = useRef<HTMLInputElement>(null);

  const handleDietChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDietFile(e.target.files[0]);
    }
  };

  const handleTrainingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTrainingFile(e.target.files[0]);
    }
  };

  const handleSubmitDiet = async () => {
    if (dietFile) {
      try {
        await anexarPlanoAlimentar.mutateAsync({ alunoId, file: dietFile });
        setDietFile(null);
        if (dietInputRef.current) dietInputRef.current.value = "";
      } catch (error) {
        console.error("Erro ao anexar plano alimentar:", error);
      }
    }
  };

  const handleSubmitTraining = async () => {
    if (trainingFile) {
      try {
        await anexarPlanoTreino.mutateAsync({ alunoId, file: trainingFile });
        setTrainingFile(null);
        if (trainingInputRef.current) trainingInputRef.current.value = "";
      } catch (error) {
        console.error("Erro ao anexar plano de treino:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plano Alimentar */}
        <div className="space-y-3">
          <Label htmlFor="plano-alimentar">Plano Alimentar (PDF)</Label>
          <div className="flex gap-2">
            <Input
              id="plano-alimentar"
              type="file"
              accept=".pdf"
              onChange={handleDietChange}
              ref={dietInputRef}
              className="flex-1"
            />
            <Button
              onClick={handleSubmitDiet}
              disabled={!dietFile || anexarPlanoAlimentar.isPending}
            >
              {anexarPlanoAlimentar.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Anexar
            </Button>
          </div>
          {dietFile && (
            <p className="text-sm text-muted-foreground">
              Arquivo selecionado: {dietFile.name}
            </p>
          )}
        </div>

        {/* Plano de Treino */}
        <div className="space-y-3">
          <Label htmlFor="plano-treino">Plano de Treino (PDF)</Label>
          <div className="flex gap-2">
            <Input
              id="plano-treino"
              type="file"
              accept=".pdf"
              onChange={handleTrainingChange}
              ref={trainingInputRef}
              className="flex-1"
            />
            <Button
              onClick={handleSubmitTraining}
              disabled={!trainingFile || anexarPlanoTreino.isPending}
            >
              {anexarPlanoTreino.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Anexar
            </Button>
          </div>
          {trainingFile && (
            <p className="text-sm text-muted-foreground">
              Arquivo selecionado: {trainingFile.name}
            </p>
          )}
        </div>
      </div>

      {/* Status das operações */}
      {anexarPlanoAlimentar.isError && (
        <p className="text-sm text-red-500">
          Erro ao anexar plano alimentar: {anexarPlanoAlimentar.error.message}
        </p>
      )}
      {anexarPlanoTreino.isError && (
        <p className="text-sm text-red-500">
          Erro ao anexar plano de treino: {anexarPlanoTreino.error.message}
        </p>
      )}
      {anexarPlanoAlimentar.isSuccess && (
        <p className="text-sm text-green-500">Plano alimentar anexado com sucesso!</p>
      )}
      {anexarPlanoTreino.isSuccess && (
        <p className="text-sm text-green-500">Plano de treino anexado com sucesso!</p>
      )}
    </div>
  );
}