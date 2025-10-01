import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row">
      {/* Left Panel */}
      <div className="flex w-full flex-col items-center justify-center gap-4 bg-background p-8 text-center md:w-1/2">
        <Logo className="h-64 w-64 md:h-96 md:w-96" />
      </div>

      {/* Right Panel */}
      <div className="flex w-full items-center justify-center bg-panel-right p-8 md:w-1/2">
        <div className="flex flex-col items-center gap-6">
          <Button
            asChild
            size="lg"
            className="h-36 w-[356px] rounded-2xl bg-primary text-4xl font-extrabold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-panel-right"
          >
            <Link href="#">Iniciar</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 w-64 rounded-full border-2 border-primary bg-background text-lg font-bold text-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary/10 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <Link href="#">Tutorial</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 w-64 rounded-full border-2 border-primary bg-background text-lg font-bold text-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary/10 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            <Link href="#">Recomendações</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
