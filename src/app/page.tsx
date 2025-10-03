'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { OrientationLock } from '@/components/orientation-lock';
import { useEffect } from 'react';

export default function Home() {
  return (
    <>
      <OrientationLock />
      <main className="flex h-[100svh] w-full flex-row overscroll-none">
        {/* Left Panel */}
        <div className="flex w-1/2 flex-col items-center justify-center bg-card p-4 md:p-8">
          <Logo className="h-64 w-64 md:h-64 md:w-64 lg:h-96 lg:w-96" />
        </div>

        {/* Right Panel */}
        <div className="flex h-full w-1/2 flex-1 flex-col items-center justify-center bg-panel-right p-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <Button
              asChild
              size="lg"
              className="h-14 w-40 rounded-2xl bg-primary text-base font-extrabold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-panel-right md:h-24 md:w-[300px] md:text-2xl"
            >
              <Link href="/configuracoes">Iniciar</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-10 w-40 rounded-2xl border-4 border-primary bg-card font-bold text-[#49416D] shadow-lg transition-transform hover:scale-105 hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:h-14 md:w-[300px] md:text-xl"
            >
              <Link href="#">Tutorial</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-10 w-40 rounded-2xl border-4 border-primary bg-card font-bold text-[#49416D] shadow-lg transition-transform hover:scale-105 hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:h-14 md:w-[300px] md:text-xl"
            >
              <Link href="#">Recomendações</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
