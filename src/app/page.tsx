import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      {/* Left Panel */}
      <div className="flex w-full flex-col items-center justify-center gap-4 bg-background p-8 text-center md:w-1/2">
        <Logo className="h-48 w-48" />
      </div>

      {/* Right Panel */}
      <div className="flex w-full items-center justify-center bg-panel-right p-8 md:w-1/2">
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
