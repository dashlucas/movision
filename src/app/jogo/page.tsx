'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function JogoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#49416D] p-4 text-white">
      <h1 className="text-5xl font-bold">Jogo</h1>
      <p className="mt-4 text-xl">A atividade começará aqui.</p>
    </main>
  );
}
