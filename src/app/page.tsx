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


function JogoView({ cameraStream }: { cameraStream: MediaStream | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(true);
  const [circle, setCircle] = useState<{ x: number; y: number; radius: number; visible: boolean } | null>(null);

  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const animationFrameId = useRef<number | null>(null);

  const spawnCircle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const radius = 30;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    setCircle({ x, y, radius, visible: true });
  };
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !cameraStream) return;

    video.srcObject = cameraStream;
    
    const startMediaPipe = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasCtx = canvas.getContext('2d');
      if (!canvasCtx) return;

      const drawingUtils = new DrawingUtils(canvasCtx);
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
          numPoses: 1, // Apenas 1 jogador
        });
        predictWebcam(drawingUtils);
      } catch (e) {
        console.error("Erro ao criar PoseLandmarker", e);
      }
    };

    const checkCollision = (landmark: any, currentCircle: any) => {
      const dx = landmark.x * canvasRef.current!.width - currentCircle.x;
      const dy = landmark.y * canvasRef.current!.height - currentCircle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < currentCircle.radius;
    };

    const predictWebcam = (drawingUtils: DrawingUtils) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const poseLandmarker = poseLandmarkerRef.current;

      if (!video || !canvas || !poseLandmarker || !canvas.getContext('2d')) return;

      const canvasCtx = canvas.getContext('2d')!;
      
      if (video.paused || video.ended || video.readyState < 2) {
        animationFrameId.current = window.requestAnimationFrame(() => predictWebcam(drawingUtils));
        return;
      }
      
      if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
      if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;
      
      const startTimeMs = performance.now();
      if (lastVideoTimeRef.current !== video.currentTime) {
        lastVideoTimeRef.current = video.currentTime;
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

          // Desenha landmarks e checa colisão
          for (const landmark of result.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) => DrawingUtils.lerp(data.from!.z!, -0.15, 0.1, 5, 1),
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            
            // Lógica de colisão
            setCircle(currentCircle => {
              if (currentCircle && currentCircle.visible) {
                for (const point of landmark) {
                  if (checkCollision(point, currentCircle)) {
                    return { ...currentCircle, visible: false }; // Esconde o círculo
                  }
                }
              }
              return currentCircle;
            });
          }
          
          // Desenha o círculo
          if (circle && circle.visible) {
            canvasCtx.beginPath();
            canvasCtx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
            canvasCtx.fillStyle = 'red';
            canvasCtx.fill();
            canvasCtx.closePath();
          }

          canvasCtx.restore();
        });
      }
      animationFrameId.current = window.requestAnimationFrame(() => predictWebcam(drawingUtils));
    };
    
    video.addEventListener('loadeddata', startMediaPipe);

    return () => {
      video.removeEventListener('loadeddata', startMediaPipe);
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
      poseLandmarkerRef.current?.close();
    };
  }, [cameraStream, circle]);


  useEffect(() => {
    if (showCountdown) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setShowCountdown(false);
        // Quando o contador acabar, gere o primeiro círculo
        spawnCircle();
      }
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
              <p className="font-headline absolute mt-4 text-7xl font-extrabold leading-none text-white md:text-8xl lg:text-[8rem]">
                {countdown}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center">
        </div>
      )}
      
       {cameraStream === null && (
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
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);


  // Solicita permissão da câmera ao carregar o app
  useEffect(() => {
    // Evita pedir permissão novamente se já foi definida
    if (hasCameraPermission !== null) return;
    
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        setCameraStream(stream);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        setCameraStream(null);
        toast({
          variant: 'destructive',
          title: 'Acesso à câmera negado',
          description: 'Por favor, habilite a permissão da câmera nas configurações do seu navegador.',
          duration: 9000
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        }
    };
    // Adicionado cameraStream como dependência para garantir a limpeza correta
  }, [toast, hasCameraPermission, cameraStream]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onStart={() => setCurrentView('configuracoes')} hasCameraPermission={hasCameraPermission} />;
      case 'configuracoes':
        return <ConfiguracoesView onStart={() => setCurrentView('jogo')} />;
      case 'jogo':
        return <JogoView cameraStream={cameraStream} />;
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
