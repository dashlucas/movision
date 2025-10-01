import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row">
      {/* Left Panel */}
      <div className="flex w-1/2 flex-col items-center justify-center gap-4 bg-background p-8 text-center">
        <Logo className="h-48 w-48 md:h-64 md:w-64 lg:h-96 lg:w-96" />
      </div>

      {/* Right Panel */}
      <div className="flex w-1/2 items-center justify-center bg-panel-right p-8">
        <div className="flex flex-col items-center gap-6">
          <Button
            asChild
            size="lg"
            className="h-24 w-72 rounded-2xl bg-primary text-2xl font-extrabold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-panel-right md:h-36 md:w-[356px] md:text-4xl"
          >
            <Link href="#">Iniciar</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 w-72 rounded-2xl border-4 border-primary bg-background text-xl font-bold text-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary/10 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:h-[60px] md:w-[356px] md:text-2xl"
          >
            <Link href="#">Tutorial</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 w-72 rounded-2xl border-4 border-primary bg-background text-xl font-bold text-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary/10 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:h-[60px] md:w-[356px] md:text-2xl"
          >
            <Link href="#">Recomendações</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
