'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Option = 'posicao' | 'membros' | 'distancia';

export default function IniciarPage() {
  const [selections, setSelections] = useState({
    posicao: '',
    membros: '',
    distancia: '',
  });

  const handleSelection = (option: Option, value: string) => {
    setSelections((prev) => ({ ...prev, [option]: value }));
  };

  const SelectionButton = ({
    option,
    value,
    children,
  }: {
    option: Option;
    value: string;
    children: React.ReactNode;
  }) => {
    const isSelected = selections[option] === value;
    return (
      <Button
        variant="outline"
        className={cn(
          'relative h-20 w-full justify-center rounded-2xl border-4 border-transparent bg-card text-2xl font-bold text-[#49416D] shadow-lg hover:bg-card/80',
          isSelected && 'border-primary ring-4 ring-primary/50'
        )}
        onClick={() => handleSelection(option, value)}
      >
        {children}
        {isSelected && (
          <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Check className="h-6 w-6 text-primary-foreground" />
          </div>
        )}
      </Button>
    );
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#49416D] p-4 md:p-8">
      <div className="mb-8 flex items-center">
        <Button asChild variant="ghost" className="text-white hover:text-white/80">
          <Link href="/">
            <ArrowLeft className="mr-2 h-6 w-6" />
            <span className="text-xl">Voltar</span>
          </Link>
        </Button>
      </div>
      <div className="flex w-full flex-1 flex-col px-4 sm:px-8 md:px-16">
        <h1 className="mb-12 text-left text-5xl font-bold text-white">
          Configurações
        </h1>
        <div className="grid w-full max-w-6xl grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-12 md:gap-20">
          {/* Posição */}
          <div className="flex flex-col items-start gap-4">
            <h2 className="mb-4 text-4xl font-bold text-white">Posição</h2>
            <div className="flex w-full flex-col gap-4">
              <SelectionButton option="posicao" value="em_pe">
                Em pé
              </SelectionButton>
              <SelectionButton option="posicao" value="sentado">
                Sentado
              </SelectionButton>
            </div>
          </div>

          {/* Membros */}
          <div className="flex flex-col items-start gap-4">
            <h2 className="mb-4 text-4xl font-bold text-white">Membros</h2>
            <div className="flex w-full flex-col gap-4">
              <SelectionButton option="membros" value="superiores">
                Superiores (Braços)
              </SelectionButton>
              <SelectionButton option="membros" value="inferiores">
                Inferiores (Pernas)
              </SelectionButton>
            </div>
          </div>

          {/* Distância */}
          <div className="flex flex-col items-start gap-4">
            <h2 className="mb-4 text-4xl font-bold text-white">Distância</h2>
            <div className="flex w-full flex-col gap-4">
              <SelectionButton option="distancia" value="nivel_1">
                Nível 1
              </SelectionButton>
              <SelectionButton option="distancia" value="nivel_2">
                Nível 2
              </SelectionButton>
              <SelectionButton option="distancia" value="nivel_3">
                Nível 3
              </SelectionButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
