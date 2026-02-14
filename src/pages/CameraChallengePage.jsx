import { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Trash2, Hand } from "lucide-react";
import CameraView from "../components/camera/CameraView";
import letterImages from "../utils/letterImages";

const HOLD_DURATION = 2000; // huruf harus ditahan 2 detik sebelum diketik

export default function CameraChallengePage() {
  const [detectedLetter, setDetectedLetter] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0-1 progress bar

  // Tracking untuk sustained detection
  const holdLetterRef = useRef(null);  // huruf yang sedang di-hold
  const holdStartRef = useRef(0);      // kapan mulai hold
  const lastTypedRef = useRef(null);   // huruf terakhir yang sudah diketik
  const progressFrameRef = useRef(null);

  const updateProgress = useCallback(() => {
    if (!holdLetterRef.current || !holdStartRef.current) {
      setHoldProgress(0);
      return;
    }
    const elapsed = Date.now() - holdStartRef.current;
    const progress = Math.min(elapsed / HOLD_DURATION, 1);
    setHoldProgress(progress);

    if (progress < 1) {
      progressFrameRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  function handleLetterDetected(result) {
    setDetectedLetter(result);

    // Huruf tidak valid — reset hold
    if (result.letter === "?" || result.confidence < 0.7) {
      holdLetterRef.current = null;
      holdStartRef.current = 0;
      setHoldProgress(0);
      if (progressFrameRef.current) cancelAnimationFrame(progressFrameRef.current);
      return;
    }

    const now = Date.now();

    // Huruf berubah — mulai hold baru
    if (result.letter !== holdLetterRef.current) {
      holdLetterRef.current = result.letter;
      holdStartRef.current = now;
      setHoldProgress(0);
      if (progressFrameRef.current) cancelAnimationFrame(progressFrameRef.current);
      progressFrameRef.current = requestAnimationFrame(updateProgress);
      return;
    }

    // Huruf sama, cek apakah sudah ditahan cukup lama
    const elapsed = now - holdStartRef.current;
    if (elapsed >= HOLD_DURATION && result.letter !== lastTypedRef.current) {
      setTypedText((prev) => prev + result.letter);
      lastTypedRef.current = result.letter;
      // Reset hold supaya bisa ngetik huruf yang sama lagi kalau dilepas dulu
      holdLetterRef.current = null;
      holdStartRef.current = 0;
      setHoldProgress(0);
      if (progressFrameRef.current) cancelAnimationFrame(progressFrameRef.current);
    }
  }

  const detectedImg =
    detectedLetter?.letter && detectedLetter.letter !== "?"
      ? letterImages[detectedLetter.letter]
      : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/levels"
          className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Camera Test</h1>
        <button
          onClick={() => setShowGuide((v) => !v)}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            showGuide
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          <Hand className="w-4 h-4" />
          Guide
        </button>
      </div>

      <div className="flex gap-4">
        {/* Camera */}
        <div className="flex-1 min-w-0">
          <CameraView onLetterDetected={handleLetterDetected} />
        </div>

        {/* Desktop: detected letter reference card */}
        {detectedLetter && detectedImg && (
          <div className="hidden sm:flex flex-col items-center w-36 shrink-0">
            <div className="bg-orange-50 rounded-2xl border-2 border-orange-200 p-3 w-full">
              <img
                src={detectedImg}
                alt={detectedLetter.letter}
                className="w-full aspect-square object-cover rounded-xl mb-2"
              />
              <p className="text-center text-2xl font-bold text-orange-500">
                {detectedLetter.letter}
              </p>
              <p className="text-center text-xs font-semibold text-gray-400">
                {Math.round(detectedLetter.confidence * 100)}%
              </p>
              {/* Hold progress bar */}
              {holdProgress > 0 && holdProgress < 1 && (
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-100"
                    style={{ width: `${Math.round(holdProgress * 100)}%` }}
                  />
                </div>
              )}
              {holdProgress >= 1 && (
                <p className="mt-2 text-[10px] font-bold text-green-500 text-center">Typed!</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile: detected letter with image */}
      {detectedLetter && (
        <div className="mt-4 p-3 bg-orange-50 rounded-xl sm:hidden">
          <div className="flex items-center gap-3">
            {detectedImg && (
              <img
                src={detectedImg}
                alt={detectedLetter.letter}
                className="w-14 h-14 object-cover rounded-lg border-2 border-orange-200"
              />
            )}
            <div>
              <span className="text-sm text-gray-500">Huruf sekarang: </span>
              <span className="text-xl font-bold text-orange-500">
                {detectedLetter.letter}
              </span>
              <span className="text-sm text-gray-400 ml-2">
                ({Math.round(detectedLetter.confidence * 100)}%)
              </span>
            </div>
          </div>
          {holdProgress > 0 && holdProgress < 1 && (
            <div className="mt-2 h-1.5 bg-orange-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-100"
                style={{ width: `${Math.round(holdProgress * 100)}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* Desktop: fallback text when no image */}
      {detectedLetter && !detectedImg && (
        <div className="mt-4 text-center p-3 bg-orange-50 rounded-xl hidden sm:block">
          <span className="text-sm text-gray-500">Huruf sekarang: </span>
          <span className="text-xl font-bold text-orange-500">
            {detectedLetter.letter}
          </span>
          <span className="text-sm text-gray-400 ml-2">
            ({Math.round(detectedLetter.confidence * 100)}%)
          </span>
        </div>
      )}

      {/* Typed text area */}
      <div className="mt-6 p-4 bg-gray-50 rounded-2xl min-h-[80px] relative">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-400 uppercase">
            Sign Typing
          </p>
          {typedText && (
            <button
              onClick={() => {
                setTypedText("");
                lastTypedRef.current = null;
                holdLetterRef.current = null;
                holdStartRef.current = 0;
                setHoldProgress(0);
              }}
              className="text-gray-400 hover:text-red-400 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-800 tracking-widest break-all">
          {typedText || (
            <span className="text-gray-300">Mulai sign untuk mengetik...</span>
          )}
          <span className="animate-pulse text-orange-400">|</span>
        </p>
      </div>

      {/* Sign Language Guide */}
      {showGuide && (
        <div className="mt-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">
            Panduan Huruf Isyarat
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
              const img = letterImages[letter];
              if (!img)
                return (
                  <div
                    key={letter}
                    className="bg-gray-100 rounded-xl p-2 flex flex-col items-center opacity-40"
                  >
                    <div className="w-full aspect-square rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-bold mb-1">
                      ?
                    </div>
                    <span className="text-xs font-bold text-gray-400">
                      {letter}
                    </span>
                  </div>
                );
              return (
                <div
                  key={letter}
                  className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm flex flex-col items-center hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <img
                    src={img}
                    alt={letter}
                    className="w-full aspect-square object-cover rounded-lg mb-1"
                  />
                  <span className="text-xs font-bold text-gray-700">
                    {letter}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
