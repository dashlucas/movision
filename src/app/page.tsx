import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { OrientationLock } from '@/components/orientation-lock';

export default function Home() {
  return (
    <>
      <OrientationLock />
      <main className="flex h-[100svh] w-full flex-row overscroll-none">
        {/* Left Panel */}
        <div className="flex w-1/2 flex-col items-center justify-center bg-card p-4 md:p-8">
          <Logo className="relative h-48 w-48 md:h-64 md:w-64 lg:h-96 lg:w-96" />
        </div>

        {/* Right Panel */}
        <div className="flex h-full w-1/2 flex-1 flex-col items-center justify-center bg-panel-right p-4 md:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <Button
              asChild
              size="lg"
              className="h-20 w-60 rounded-2xl bg-primary text-2xl font-extrabold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-panel-right md:h-20 md:w-[400px] md:text-5xl"
            >
              <Link href="#">Iniciar</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-16 w-60 rounded-2xl border-4 border-primary bg-card text-xl font-bold text-[#49416D] shadow-lg transition-transform hover:scale-105 hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:h-20 md:w-[400px] md:text-3xl"
            >
              <Link href="#">Tutorial</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-16 w-60 rounded-2xl border-4 border-primary bg-card text-xl font-bold text-[#49416D] shadow-lg transition-transform hover:scale-105 hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:h-20 md:w-[400px] md:text-3xl"
            >
              <Link href="#">Recomendações</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
