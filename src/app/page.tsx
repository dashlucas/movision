'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { OrientationLock } from '@/components/orientation-lock';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from '@mediapipe/tasks-vision';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type View = 'home' | 'configuracoes' | 'jogo';
type Option = 'posicao' | 'membros' | 'distancia';

function ConfiguracoesView({ onStart }: { onStart: () => void }) {
  const [selections, setSelections] = useState({
    posicao: '',
    membros: '',
    distancia: '',
  });

  const handleSelection = (option: Option, value: string) => {
    setSelections((prev) => ({ ...prev, [option]: value }));
  };

  const isComplete =
    selections.posicao !== '' &&
    selections.membros !== '' &&
    selections.distancia !== '';

  const SelectionButton = ({
    option,
    value,
    children,
    className,
  }: {
    option: Option;
    value: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    const isSelected = selections[option] === value;
    return (
      <Button
        variant="outline"
        className={cn(
          'relative w-full flex-1 justify-center rounded-xl border-4 border-transparent bg-card text-lg font-bold text-[#49416D] shadow-lg hover:bg-card/80 sm:text-xl',
          'whitespace-normal break-words py-2',
          'h-full',
          isSelected && 'border-primary ring-4 ring-primary/50',
          className
        )}
        onClick={() => handleSelection(option, value)}
      >
        {children}
        {isSelected && (
          <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Check className="h-6 w-6 text-primary-foreground" />
          </div>
        )}
      </Button>
    );
  };

  return (
    <main className="flex min-h-[100svh] flex-col bg-[#49416D] p-4 md:p-8">
      <div className="flex w-full flex-1 flex-col justify-center px-4 sm:px-8">
        <div className="flex items-start justify-center">
          <div className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
            {/* Posição */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Posição</h2>
              <div className="flex w-full flex-1 flex-col gap-4">
                <SelectionButton option="posicao" value="em_pe">
                  Em pé
                </SelectionButton>
                <SelectionButton option="posicao" value="sentado">
                  Sentado
                </SelectionButton>
              </div>
            </div>

            {/* Membros */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Membros</h2>
              <div className="flex w-full flex-1 flex-col gap-4">
                <SelectionButton
                  option="membros"
                  value="superiores"
                  className="flex-wrap"
                >
                  Superiores (Braços)
                </SelectionButton>
                <SelectionButton
                  option="membros"
                  value="inferiores"
                  className="flex-wrap"
                >
                  Inferiores (Pernas)
                </SelectionButton>
              </div>
            </div>

            {/* Distância */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Distância</h2>
              <div className="flex w-full flex-1 flex-col gap-4">
                <SelectionButton option="distancia" value="nivel_1">
                  Nível 1
                </SelectionButton>
                <SelectionButton option="distancia" value="nivel_2">
                  Nível 2
                </SelectionButton>
                <SelectionButton option="distancia" value="nivel_3">
                  Nível 3
                </SelectionButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-center pb-4">
        <Button
          size="lg"
          className="h-20 w-full max-w-md rounded-2xl bg-primary text-2xl font-extrabold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:bg-gray-400 disabled:opacity-50"
          disabled={!isComplete}
          onClick={onStart}
        >
          Iniciar
        </Button>
      </div>
    </main>
  );
}


function JogoView({ hasCameraPermission }: { hasCameraPermission: boolean | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(true);

  // Refs para a lógica do MediaPipe
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const webcamRunningRef = useRef(false);
  const lastVideoTimeRef = useRef(-1);
  let animationFrameId: number | null = null;
  let drawingUtils: DrawingUtils | null = null;
  let canvasCtx: CanvasRenderingContext2D | null = null;


  useEffect(() => {
    if (!hasCameraPermission) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const startMediaPipe = async () => {
        if (!video || !canvas) return;

        canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;
        
        drawingUtils = new DrawingUtils(canvasCtx);
    
        try {
            const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
            );
            poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task`,
                delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numPoses: 2,
            });
            console.log('Pose Landmarker criado e pronto.');
            webcamRunningRef.current = true;
            predictWebcam();
        } catch(e) {
            console.error("Erro ao criar PoseLandmarker", e);
        }
    };
    
    const stream = (window as any).stream;
    if (stream && video) {
        video.srcObject = stream;
        video.addEventListener('loadeddata', startMediaPipe);
    }


    const predictWebcam = () => {
      if (!webcamRunningRef.current || !poseLandmarkerRef.current || !video?.srcObject || !canvasCtx || !drawingUtils) {
        if (webcamRunningRef.current) {
          animationFrameId = window.requestAnimationFrame(predictWebcam);
        }
        return;
      }
      
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        animationFrameId = window.requestAnimationFrame(predictWebcam);
        return;
      }

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      if (canvas.width !== videoWidth) canvas.width = videoWidth;
      if (canvas.height !== videoHeight) canvas.height = videoHeight;
      
      const startTimeMs = performance.now();
      if (lastVideoTimeRef.current !== video.currentTime) {
        lastVideoTimeRef.current = video.currentTime;
        poseLandmarkerRef.current.detectForVideo(
          video,
          startTimeMs,
          (result) => {
            canvasCtx!.save();
            canvasCtx!.clearRect(0, 0, canvas.width, canvas.height);
            for (const landmark of result.landmarks) {
              drawingUtils!.drawLandmarks(landmark, {
                radius: (data) =>
                  DrawingUtils.lerp(data.from!.z!, -0.15, 0.1, 5, 1),
              });
              drawingUtils!.drawConnectors(
                landmark,
                PoseLandmarker.POSE_CONNECTIONS
              );
            }
            canvasCtx!.restore();
          }
        );
      }

      animationFrameId = window.requestAnimationFrame(predictWebcam);
    };

    return () => {
      console.log('Cleaning up JogoView...');
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      webcamRunningRef.current = false;
      if (video) {
        video.removeEventListener('loadeddata', startMediaPipe);
        video.srcObject = null;
      }
      poseLandmarkerRef.current?.close();
      poseLandmarkerRef.current = null;
    };
  }, [hasCameraPermission]);


  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown) {
      setShowCountdown(false);
    }
  }, [countdown, showCountdown]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      ></video>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      ></canvas>

      {showCountdown ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex w-full items-center justify-around gap-8 px-4">
            <div className="relative h-[70vh] w-1/3">
               <Image
                src="/img/aviso_posicionamento.png"
                alt="Aviso de posicionamento"
                fill
                className="object-contain"
              />
            </div>
             <div className="relative h-[70vh] w-1/3">
              <Image
                src="/img/icon_position.png"
                alt="Posicionamento de exemplo"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative flex h-[70vh] w-1/3 items-center justify-center">
              <Image
                src="/img/T_timer.png"
                alt="Timer"
                fill
                className="object-contain"
              />
              <p className="font-headline absolute mt-8 text-[15vw] font-extrabold leading-none text-white lg:mt-8 lg:text-[10vw]">
                {countdown}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center">
        </div>
      )}
      
       {hasCameraPermission === false && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
            <Alert variant="destructive" className="max-w-sm">
                <AlertTitle>Acesso à câmera necessário</AlertTitle>
                <AlertDescription>
                  Por favor, habilite a permissão da câmera nas configurações do seu navegador para usar o aplicativo.
                </AlertDescription>
              </Alert>
          </div>
        )}
    </div>
  );
}


function HomeView({ onStart, hasCameraPermission }: { onStart: () => void, hasCameraPermission: boolean | null }) {
  return (
    <main className="flex h-[100svh] w-full flex-row">
      {/* Left Panel */}
      <div className="flex w-1/2 flex-col items-center justify-center bg-card p-4 md:p-8">
        <Logo className="h-64 w-64 md:h-64 md:w-64 lg:h-96 lg:w-96" />
      </div>

      {/* Right Panel */}
      <div className="flex h-full w-1/2 flex-1 flex-col items-center justify-center bg-panel-right p-4 md:p-8">
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <Button
            onClick={onStart}
            size="lg"
            className="h-14 w-40 rounded-2xl bg-primary text-base font-extrabold text-primary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-panel-right md:h-24 md:w-[300px] md:text-2xl disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-70"
            disabled={hasCameraPermission !== true}
          >
            Iniciar
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-10 w-40 rounded-2xl border-4 border-primary bg-card font-bold text-[#49416D] shadow-lg transition-transform hover:scale-105 hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:h-14 md:w-[300px] md:text-xl"
          >
            <Link href="#">Tutorial</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-10 w-40 rounded-2xl border-4 border-primary bg-card font-bold text-[#49416D] shadow-lg transition-transform hover:scale-105 hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background md:h-14 md:w-[300px] md:text-xl"
          >
            <Link href="#">Recomendações</Link>
          </Button>
        </div>
      </div>
       {hasCameraPermission === false && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
            <Alert variant="destructive" className="max-w-md">
                <AlertTitle>Acesso à câmera necessário</AlertTitle>
                <AlertDescription>
                  Para continuar, por favor, habilite a permissão da câmera nas configurações do seu navegador e atualize a página.
                </AlertDescription>
              </Alert>
          </div>
        )}
    </main>
  );
}

export default function Page() {
  const [currentView, setCurrentView] = useState<View>('home');
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  // Solicita permissão da câmera ao carregar o app
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Guarda o stream globalmente para que JogoView possa usá-lo sem pedir de novo
        (window as any).stream = stream;
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Acesso à câmera negado',
          description: 'Por favor, habilite a permissão da câmera nas configurações do seu navegador.',
          duration: 9000
        });
      }
    };

    if (hasCameraPermission === null) {
      getCameraPermission();
    }
    
    // Limpa o stream quando o componente principal é desmontado
    return () => {
        const stream = (window as any).stream;
        if (stream) {
            stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
            (window as any).stream = null;
        }
    };
  }, [toast, hasCameraPermission]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onStart={() => setCurrentView('configuracoes')} hasCameraPermission={hasCameraPermission} />;
      case 'configuracoes':
        return <ConfiguracoesView onStart={() => setCurrentView('jogo')} />;
      case 'jogo':
        return <JogoView hasCameraPermission={hasCameraPermission} />;
      default:
        return <HomeView onStart={() => setCurrentView('configuracoes')} hasCameraPermission={hasCameraPermission}/>;
    }
  };

  return (
    <>
      <OrientationLock />
      {renderView()}
    </>
  );
}
