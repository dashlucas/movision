import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function IniciarPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-bold text-foreground">Página Iniciar</h1>
        <p className="text-lg text-muted-foreground">
          Esta é a página que você acessou a partir do botão "Iniciar".
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
