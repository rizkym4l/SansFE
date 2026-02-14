import { useEffect, useRef, useState } from "react";
import {
  initHandDetection,
  detectHand,
  destroyHandDetection,
} from "../../ai/handDetection";
import { classifyGesture } from "../../ai/gestureClassifier";

export default function CameraView({ onLetterDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true); // loading model
  const [currentLetter, setCurrentLetter] = useState(null); // huruf yang kedetect sekarang
  const [confidence, setConfidence] = useState(0);
  const callbackRef = useRef(onLetterDetected);

  useEffect(() => {
    let isMounted = true;
    let stream = null;

    async function setup() {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });

      // Unmounted while waiting for camera — stop immediately
      if (!isMounted) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      await initHandDetection();
      if (!isMounted) return;
      setIsLoading(false);

      function detectLoop() {
        if (!isMounted || !videoRef.current) return;

        const landmarks = detectHand(videoRef.current);
        if (landmarks) {
          drawLandmarks(landmarks);
          const result = classifyGesture(landmarks);
          if (result) {
            setCurrentLetter(result.letter);
            setConfidence(result.confidence);
            if (onLetterDetected) callbackRef.current(result);
          }
        } else {
          setCurrentLetter(null);
          setConfidence(0);
        }
        animationIdRef.current = requestAnimationFrame(detectLoop);
      }
      detectLoop();
    }
    setup();

    return () => {
      isMounted = false;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      destroyHandDetection();
    };
  }, []);

  useEffect(() => {
    callbackRef.current = onLetterDetected;
  }, [onLetterDetected]);

  // nanti: function drawLandmarks di sini

  function drawLandmarks(landmarks) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const lm of landmarks) {
      const x = lm.x * canvas.width;
      const y = lm.y * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI); // lingkaran, radius 5px
      ctx.fillStyle = "#FF6B00"; // warna orange
      ctx.fill();
    }
    const connection = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4], // jempol
      [0, 5],
      [5, 6],
      [6, 7],
      [7, 8], // telunjuk
      [0, 9],
      [9, 10],
      [10, 11],
      [11, 12], // jari tengah
      [0, 13],
      [13, 14],
      [14, 15],
      [15, 16], // jari manis
      [0, 17],
      [17, 18],
      [18, 19],
      [19, 20], // kelingking
      [5, 9],
      [9, 13],
      [13, 17], // telapak (hubungin pangkal jari)
    ];

    ctx.strokeStyle = "#FFA500"; // warna garis orange
    ctx.lineWidth = 2; // tebal garis 2px

    for (const [a, b] of connection) {
      ctx.beginPath();
      ctx.moveTo(landmarks[a].x * canvas.width, landmarks[a].y * canvas.height);
      ctx.lineTo(landmarks[b].x * canvas.width, landmarks[b].y * canvas.height);
      ctx.stroke();
    }
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <p className="font-medium">Loading camera...</p>
          </div>
        </div>
      )}

      <div className="relative rounded-2xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width={640}
          height={480}
          className="w-full rounded-2xl mirror"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full mirror"
        />
      </div>

      {currentLetter && (
        <div className="mt-4 text-center">
          <span className="text-6xl font-bold text-orange-500">
            {currentLetter}
          </span>
          <p className="text-sm text-gray-400 mt-1">
            Confidence: {Math.round(confidence * 100)}%
          </p>
        </div>
      )}
    </div>
  );
}
