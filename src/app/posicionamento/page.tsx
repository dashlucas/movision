'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CameraOff } from 'lucide-react';
import { OrientationLock } from '@/components/orientation-lock';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PosicionamentoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | undefined
  >(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Media Devices API not supported');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Erro de Câmera',
          description:
            'Seu navegador não suporta o acesso à câmera. Tente usar um navegador diferente.',
        });
        return;
      }
      try {
        // Solicita a câmera frontal
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Acesso à Câmera Negado',
          description:
            'Por favor, habilite a permissão de câmera nas configurações do seu navegador para usar esta função.',
        });
      }
    };

    getCameraPermission();

    // Função de limpeza para parar o stream da câmera ao desmontar o componente
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [toast]);

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

        <div className="relative flex flex-1 items-center justify-center">
          <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-lg">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
              muted
              style={{ transform: 'scaleX(-1)' }} // Espelha o vídeo
            />
            {hasCameraPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                <CameraOff className="h-16 w-16 text-red-500" />
                <p className="mt-4 text-xl font-semibold">Câmera indisponível</p>
                <p className="max-w-xs text-center text-sm text-zinc-300">
                  Verifique as permissões da câmera no seu navegador.
                </p>
              </div>
            )}
             {hasCameraPermission === undefined && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                <p>Acessando a câmera...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
