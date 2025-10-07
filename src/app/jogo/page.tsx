'use client';

import { useEffect, useRef, useState } from 'react';
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from '@mediapipe/tasks-vision';
import Image from 'next/image';

export default function JogoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(true);

  // Refs para a lógica do MediaPipe
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const webcamRunningRef = useRef(false);
  const lastVideoTimeRef = useRef(-1);
  const animationFrameId = useRef<number | null>(null);

  // Inicializa a câmera e o MediaPipe
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const drawingUtils = new DrawingUtils(canvasCtx);

    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );
      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 2,
      });
      poseLandmarkerRef.current = poseLandmarker;
      console.log('Pose Landmarker created');
      await enableCam();
    };

    const enableCam = async () => {
      if (!poseLandmarkerRef.current || webcamRunningRef.current) return;

      webcamRunningRef.current = true;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        video.srcObject = stream;
        video.addEventListener('loadeddata', predictWebcam);
      } catch (error) {
        console.error('Error accessing webcam:', error);
        webcamRunningRef.current = false;
      }
    };

    const predictWebcam = async () => {
      if (
        !webcamRunningRef.current ||
        !poseLandmarkerRef.current ||
        !video.srcObject
      )
        return;

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      if (canvas.width !== videoWidth) {
        canvas.width = videoWidth;
      }
      if (canvas.height !== videoHeight) {
        canvas.height = videoHeight;
      }

      const startTimeMs = performance.now();
      if (lastVideoTimeRef.current !== video.currentTime) {
        lastVideoTimeRef.current = video.currentTime;
        poseLandmarkerRef.current.detectForVideo(
          video,
          startTimeMs,
          (result) => {
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            for (const landmark of result.landmarks) {
              drawingUtils.drawLandmarks(landmark, {
                radius: (data) =>
                  DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
              });
              drawingUtils.drawConnectors(
                landmark,
                PoseLandmarker.POSE_CONNECTIONS
              );
            }
            canvasCtx.restore();
          }
        );
      }

      animationFrameId.current = window.requestAnimationFrame(predictWebcam);
    };

    createPoseLandmarker();

    return () => {
      console.log('Cleaning up...');
      webcamRunningRef.current = false;
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
      if (video.srcObject) {
        (video.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
      video.removeEventListener('loadeddata', predictWebcam);
      poseLandmarkerRef.current?.close();
    };
  }, []);

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
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className="absolute top-0 z-10 w-full p-4 pt-8 text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              Posicione-se corretamente
            </h1>
            <p className="mt-2 text-2xl text-white md:text-3xl">
              Mantenha o dispositivo na horizontal e posicione-se a uma distância
              adequada
            </p>
          </div>
          <div className="relative h-[70vh] w-full">
            <Image
              src="/img/icon_position.png"
              alt="Posicionamento de exemplo"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
            <p className="text-4xl font-bold text-white md:text-5xl">Começa em</p>
            <p className="font-raleway text-[250px] font-extrabold leading-none text-white">
              {countdown}
            </p>
          </div>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center">
          {/* O conteúdo que ficava aqui foi removido */}
        </div>
      )}
    </div>
  );
}
