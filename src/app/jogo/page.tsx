
'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

export default function JogoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveViewRef = useRef<HTMLDivElement>(null);
  
  const [mirrored, setMirrored] = useState(true);

  // Refs para a lógica do MediaPipe
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const webcamRunningRef = useRef(false);
  const lastVideoTimeRef = useRef(-1);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const liveView = liveViewRef.current;

    if (!video || !canvas || !liveView) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const drawingUtils = new DrawingUtils(canvasCtx);

    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
      );
      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 2,
      });
      poseLandmarkerRef.current = poseLandmarker;
      console.log('Pose Landmarker created');
      // Auto-start camera once the model is loaded
      await enableCam();
    };

    const enableCam = async () => {
      if (!poseLandmarkerRef.current || webcamRunningRef.current) return;
      
      webcamRunningRef.current = true;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.addEventListener('loadeddata', predictWebcam);
      } catch (error) {
        console.error("Error accessing webcam:", error);
        webcamRunningRef.current = false;
      }
    };

    const predictWebcam = async () => {
      if (!webcamRunningRef.current || !poseLandmarkerRef.current || !video.srcObject) return;

      // Adjust canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const startTimeMs = performance.now();
      if (lastVideoTimeRef.current !== video.currentTime) {
        lastVideoTimeRef.current = video.currentTime;
        poseLandmarkerRef.current.detectForVideo(video, startTimeMs, (result) => {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
          for (const landmark of result.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
          }
          canvasCtx.restore();
        });
      }

      animationFrameId.current = window.requestAnimationFrame(predictWebcam);
    };

    createPoseLandmarker();

    // Cleanup function
    return () => {
      console.log('Cleaning up...');
      webcamRunningRef.current = false;
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      video.removeEventListener('loadeddata', predictWebcam);
      poseLandmarkerRef.current?.close();
    };

  }, []); // Executa apenas uma vez na montagem do componente

  return (
    <>
      <Head>
        <title>MediaPipe Pose Landmarker Task for web</title>
        <link
          href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css"
          rel="stylesheet"
        />
      </Head>
      <Script
        src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"
        strategy="beforeInteractive"
      />
      {/* O módulo do MediaPipe será carregado pelo import no topo do arquivo */}

      <div ref={liveViewRef} id="liveView" className={`videoView ${mirrored ? 'mirrored' : ''}`}>
        <div className="stage">
          <video
            ref={videoRef}
            id="webcam"
            autoPlay
            playsInline
            muted
          ></video>
          <canvas
            ref={canvasRef}
            id="output_canvas"
            className="output_canvas"
          ></canvas>
        </div>
      </div>
    </>
  );
}
