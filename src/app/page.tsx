import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row">
      {/* Left Panel */}
      <div className="flex w-1/2 flex-col items-center justify-center gap-4 bg-background p-8 text-center">
        <Logo className="h-24 w-24 text-primary" />
        <h1 className="font-headline text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-tight tracking-tighter text-slate-900">
          Movision
        </h1>
        <p className="max-w-md font-body text-[clamp(1rem,2.5vw,1.25rem)] text-slate-600">
          Análise de movimento inteligente para uma fisioterapia eficaz e
          personalizada.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex w-1/2 items-center justify-center bg-panel-right p-8">
        <div className="flex flex-col items-center gap-6">
          <Button
            size="lg"
            className="h-14 w-64 rounded-full bg-primary text-lg font-extrabold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-panel-right"
          >
            Iniciar
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-64 rounded-full border-2 border-primary bg-background text-lg font-bold text-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary/10 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Tutorial
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 w-64 rounded-full border-2 border-primary bg-background text-lg font-bold text-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary/10 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Recomendações
          </Button>
        </div>
      </div>
    </main>
  );
}
