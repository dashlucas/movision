'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { OrientationLock } from '@/components/orientation-lock';

export default function PosicionamentoPage() {
  return (
    <>
      <OrientationLock />
      <main className="flex min-h-screen flex-col bg-[#49416D] p-4 md:p-8">
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="text-white hover:bg-primary/90 hover:text-white"
          >
            <Link href="/configuracoes">
              <ArrowLeft className="mr-2 h-6 w-6" />
              <span className="text-xl">Voltar</span>
            </Link>
          </Button>
          <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Posicionamento
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xl text-white">
            Ajuste sua posição conforme indicado.
          </p>
        </div>
      </main>
    </>
  );
}
