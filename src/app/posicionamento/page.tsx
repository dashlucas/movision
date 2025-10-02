'use client';

import { useEffect, useRef, useState } from 'react';
import { CameraOff } from 'lucide-react';
import { OrientationLock } from '@/components/orientation-lock';
import { useToast } from '@/hooks/use-toast';

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
    
    // Adiciona a classe de fundo preto ao body
    document.body.classList.add('bg-black');

    // Função de limpeza para parar o stream da câmera e remover a classe do body
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      // Remove a classe de fundo preto do body
      document.body.classList.remove('bg-black');
    };
  }, [toast]);

  return (
    <>
      <OrientationLock />
      <main className="relative h-screen w-screen overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          playsInline
          muted
          style={{ transform: 'scaleX(-1)' }} // Espelha o vídeo
        />
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
        {hasCameraPermission === undefined && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
            <p className="text-xl">Acessando a câmera...</p>
          </div>
        )}
      </main>
    </>
  );
}
