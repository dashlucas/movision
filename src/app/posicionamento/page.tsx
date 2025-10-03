'use client';

import { useEffect, useRef, useState } from 'react';
import { CameraOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PosicionamentoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | undefined
  >(undefined);
  const [countdown, setCountdown] = useState(10);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
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

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      document.body.classList.remove('bg-black');
      document.documentElement.classList.remove('bg-black');
    };
  }, [toast]);

  useEffect(() => {
    if (hasCameraPermission) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        router.push('/jogo');
      }
    }
  }, [countdown, hasCameraPermission, router]);

  return (
    <main className="h-[110svh] w-screen bg-black">
      <div className="fixed inset-0 h-[100svh] w-screen">
        {hasCameraPermission === undefined && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-white">
            <p className="text-xl">Acessando a câmera...</p>
          </div>
        )}
        {hasCameraPermission === false && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 text-white">
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
            'absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 scale-x-[-1] object-cover'
          )}
          autoPlay
          playsInline
          muted
        />
        {/* Overlay */}
        {hasCameraPermission && countdown > 0 && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-start">
            <div className="relative z-10 w-full p-4 pt-8 text-center">
              <h1 className="text-2xl font-bold text-white md:text-4xl">
                Posicione-se corretamente
              </h1>
              <p className="mt-2 text-sm text-zinc-300 md:text-base">
                Mantenha o dispositivo na horizontal e posicione-se a uma
                distância adequada
              </p>
            </div>
            <div className="absolute inset-0 z-0">
              <Image
                src="/img/position.png"
                alt="Posicionamento de exemplo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
        {hasCameraPermission && countdown > 0 && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
            <p className="text-2xl font-bold md:text-4xl">Começa em</p>
            <p className="font-raleway text-[70px] font-extrabold leading-none md:text-[250px]">
              {countdown}
            </p>
          </div>
        )}
        <div className="absolute bottom-4 right-4 z-50 text-2xl font-bold text-white opacity-50">
          Browser
        </div>
      </div>
      <div className="h-[10svh] w-full" />
    </main>
  );
}
