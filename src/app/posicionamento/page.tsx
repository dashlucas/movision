'use client';

import { useEffect, useRef, useState } from 'react';
import { CameraOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function PosicionamentoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | undefined
  >(undefined);
  const [isLandscape, setIsLandscape] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Adiciona a classe de fundo preto ao body
    document.body.classList.add('bg-black');
    document.documentElement.classList.add('bg-black');

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

    const mql = window.matchMedia('(orientation: landscape)');

    const applyOrientation = () => {
      setIsLandscape(mql.matches);
    };

    mql.addEventListener('change', applyOrientation);
    window.addEventListener('orientationchange', applyOrientation);
    window.addEventListener('resize', applyOrientation);
    applyOrientation(); // Initial check

    // Nudge para o WebKit para forçar o re-layout
    const nudgeWebKit = () => {
      if (videoRef.current) {
        videoRef.current.style.display = 'none';
        // força reflow
        void videoRef.current.offsetHeight;
        videoRef.current.style.display = '';
      }
    };

    const handleOrientationChange = () => {
      setTimeout(nudgeWebKit, 120);
    };
    window.addEventListener('orientationchange', handleOrientationChange);


    // Função de limpeza
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      // Remove os listeners
      mql.removeEventListener('change', applyOrientation);
      window.removeEventListener('orientationchange', applyOrientation);
      window.removeEventListener('resize', applyOrientation);
      window.removeEventListener('orientationchange', handleOrientationChange);

      // Remove a classe de fundo preto
      document.body.classList.remove('bg-black');
      document.documentElement.classList.remove('bg-black');
    };
  }, [toast]);

  return (
      <main className="fixed inset-0 h-[100dvh] w-[100dvw] overflow-hidden bg-black">
        {hasCameraPermission === undefined && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
            <p className="text-xl">Acessando a câmera...</p>
          </div>
        )}
        {hasCameraPermission === false && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
            <CameraOff className="h-24 w-24 text-red-500" />
            <p className="mt-4 text-2xl font-semibold">Câmera indisponível</p>
            <p className="mt-2 max-w-sm text-center text-base text-zinc-300">
              Não foi possível acessar a câmera. Verifique as permissões no seu
              navegador e tente novamente.
            </p>
          </div>
        )}
         <video
            ref={videoRef}
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-cover',
              isLandscape ? 'h-[100dvw] w-[100dvh] rotate-90' : 'h-[100dvh] w-[100dvw]'
            )}
            autoPlay
            playsInline
            muted
          />
      </main>
  );
}
