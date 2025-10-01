import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-row">
      {/* Left Panel */}
      <div className="flex w-2/5 flex-col items-center justify-center bg-background p-4 md:p-8">
        <Logo className="relative h-32 w-32 md:h-64 md:w-64 lg:h-96 lg:w-96" />
      </div>

      {/* Right Panel */}
      <div className="flex w-3/5 flex-1 items-center justify-center bg-panel-right p-4 md:p-8">
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <Button
            asChild
            size="lg"
            className="h-16 w-48 rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-panel-right md:h-36 md:w-[356px] md:text-4xl"
          >
            <Link href="#">Iniciar</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 w-48 rounded-2xl border-4 border-primary bg-background text-lg font-bold text-tutorial shadow-lg transition-transform hover:scale-105 hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:h-[60px] md:w-[356px] md:text-2xl"
          >
            <Link href="#">Tutorial</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 w-48 rounded-2xl border-4 border-primary bg-background text-lg font-bold text-tutorial shadow-lg transition-transform hover:scale-105 hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:h-[60px] md:w-[356px] md:text-2xl"
          >
            <Link href="#">Recomendações</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
