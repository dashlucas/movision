'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrientationLock } from '@/components/orientation-lock';
import { useRouter } from 'next/navigation';

type Option = 'posicao' | 'membros' | 'distancia';

export default function ConfiguracoesPage() {
  const [selections, setSelections] = useState({
    posicao: '',
    membros: '',
    distancia: '',
  });
  const router = useRouter();

  const handleSelection = (option: Option, value: string) => {
    setSelections((prev) => ({ ...prev, [option]: value }));
  };

  const isComplete =
    selections.posicao !== '' &&
    selections.membros !== '' &&
    selections.distancia !== '';

  const handleStart = () => {
    router.push('/jogo');
  };

  const SelectionButton = ({
    option,
    value,
    children,
    className,
  }: {
    option: Option;
    value: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    const isSelected = selections[option] === value;
    return (
      <Button
        variant="outline"
        className={cn(
          'relative w-full flex-1 justify-center rounded-xl border-4 border-transparent bg-card text-lg font-bold text-[#49416D] shadow-lg hover:bg-card/80 sm:text-xl',
          'whitespace-normal break-words py-2',
          'h-full',
          isSelected && 'border-primary ring-4 ring-primary/50',
          className
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
    <>
      <OrientationLock />
      <main className="flex min-h-[100svh] flex-col bg-[#49416D] p-4">
        <div className="flex w-full flex-1 flex-col justify-center">
          <div className="flex items-center justify-center">
            <div className="grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
              {/* Posição */}
              <div className="flex flex-col items-center gap-2 sm:gap-4">
                <h2 className="mb-1 text-xl font-bold text-white sm:text-2xl md:text-3xl">Posição</h2>
                <div className="flex w-full flex-1 flex-col gap-3 sm:gap-4">
                  <SelectionButton option="posicao" value="em_pe">
                    Em pé
                  </SelectionButton>
                  <SelectionButton option="posicao" value="sentado">
                    Sentado
                  </SelectionButton>
                </div>
              </div>

              {/* Membros */}
              <div className="flex flex-col items-center gap-2 sm:gap-4">
                <h2 className="mb-1 text-xl font-bold text-white sm:text-2xl md:text-3xl">Membros</h2>
                <div className="flex w-full flex-1 flex-col gap-3 sm:gap-4">
                  <SelectionButton
                    option="membros"
                    value="superiores"
                    className="flex-wrap"
                  >
                    Superiores (Braços)
                  </SelectionButton>
                  <SelectionButton
                    option="membros"
                    value="inferiores"
                    className="flex-wrap"
                  >
                    Inferiores (Pernas)
                  </SelectionButton>
                </div>
              </div>

              {/* Distância */}
              <div className="flex flex-col items-center gap-2 sm:gap-4">
                <h2 className="mb-1 text-xl font-bold text-white sm:text-2xl md:text-3xl">Distância</h2>
                <div className="flex w-full flex-1 flex-col gap-3 sm:gap-4">
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
        </div>
        <div className="mt-6 flex justify-center pb-2">
          <Button
            size="lg"
            className="h-16 w-full max-w-md rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:bg-gray-400 disabled:opacity-50 sm:h-20 sm:text-2xl"
            disabled={!isComplete}
            onClick={handleStart}
          >
            Iniciar
          </Button>
        </div>
      </main>
    </>
  );
}
