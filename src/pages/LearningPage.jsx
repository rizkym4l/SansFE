import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Check,
  Star,
  BookOpen,
  Trophy,
  Sparkles,
  Hand,
  X,
  Clock,
} from "lucide-react";
import gsap from "gsap";
import CameraView from "../components/camera/CameraView"; // tambahin ini
import cameraService from "../services/cameraService"; // tambahin ini
import lessonService from "../services/lessonService";
import mascotStudy from "../assets/home/mascot-study.jpeg";
import mascotChef from "../assets/home/mascot-chef.jpeg";

import useAuthStore from "../context/AuthContext";
import Card from "../components/learn/Card";
import CompletionCard from "../components/learn/CompletionCard";
import PracticeContext from "../context/PracticeContext";
import quizService from "../services/quizService";
import achievementService from "../services/achievementService";
import { formatTime } from "../utils/formatters";

export default function LearningPage() {
  const lessonId = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const { user, updateXP } = useAuthStore();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedLetters, setLearnedLetters] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  //===CAMERA CHANLAGNGE PUNYA JANGAN GANGGU

  const [cameraCurrentIndex, setCameraCurrentIndex] = useState(0);
  const [cameraMistakes, setcameraMistakes] = useState([]);
  const [cameraConfidences, setCameraConfidences] = useState([]);
  const [cameraWordIndex, setCameraWordIndex] = useState(0);
  const [flashWrong, setFlashWrong] = useState(false);
  const lastCameraDetect = useRef(0);

  useEffect(() => {
    const fetchLesson = async () => {
      const res = await lessonService.getLessonById(lessonId.id);
      setLesson(res);
      setLoading(false);
    };
    fetchLesson();
  }, []);

  // Initialize timer when lesson loads
  useEffect(() => {
    if (!lesson) return;
    const timeLimit = lesson.data.requirements?.timeLimit;
    if (timeLimit && lesson.data.type !== "learning") {
      setTimeRemaining(timeLimit);
    }
  }, [lesson]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || completed) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining, completed]);
  // console.log("lesson", lesson);
  // Auto-complete when timer hits 0
  useEffect(() => {
    if (timeRemaining === 0 && !completed) {
      handleComplete();
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (loading || !lesson) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".learning-header",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      );
      gsap.fromTo(
        ".sign-card",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.4)",
          delay: 0.2,
        },
      );
    }, pageRef);
    return () => ctx.revert();
  }, [loading, lesson]);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { x: 30, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
    );
  }, [currentIndex]);

  // Data extraction
  const isLearningType = lesson?.data.type === "learning";
  const signImages = lesson?.data.content?.signImages || [];
  const isCameraChallenge = lesson?.data.type === "camera-challenge";
  const challengeWord = lesson?.data?.content?.challengeWords || [];
  const currentWord = challengeWord[cameraWordIndex] || "";
  const currentTargetLetter = currentWord[cameraCurrentIndex];
  const questions = lesson?.data.content?.questions || [];
  const minAccuracy = lesson?.data.requirements?.minAccuracy || 70;

  // Items to iterate: signImages for learning, questions for practice/quiz
  const items = isLearningType ? signImages : questions;
  const totalItems = items.length;

  // Current item
  const currentSign = isLearningType ? signImages[currentIndex] : null;
  const currentQuestion = !isLearningType ? questions[currentIndex] : null;

  const xpReward = lesson?.data.rewards?.xpPoints || 0;

  const { answerIndicates, timeSpents } = PracticeContext();

  // Completion check
  const allLearned = isLearningType
    ? learnedLetters.length === totalItems && totalItems > 0
    : Object.keys(answerIndicates).length >= totalItems && totalItems > 0;

  function handleMarkLearned() {
    if (!currentSign) return;
    setLearnedLetters((prev) =>
      prev.includes(currentSign.letter)
        ? prev.filter((l) => l !== currentSign.letter)
        : [...prev, currentSign.letter],
    );
  }

  function handleCameraDetected(result) {
    if (completed || result.confidence < 0.7) return;

    //kita debounce
    const now = Date.now();
    if (now - lastCameraDetect.current < 2000) return;
    lastCameraDetect.current = now;
    if (result.letter === currentTargetLetter) {
      setCameraConfidences((prev) => [...prev, result.confidence]);

      if (cameraCurrentIndex >= currentWord.length - 1) {
        if (cameraWordIndex >= challengeWord.length - 1) {
          handleComplete();
        } else {
          setCameraWordIndex((prev) => prev + 1);
          setCameraCurrentIndex(0);
        }
      } else {
        setCameraCurrentIndex((prev) => prev + 1);
      }
    } else {
      // Only record 1 mistake per position (prevent huge array → 500 error)
      setcameraMistakes((prev) => {
        const alreadyHas = prev.some((m) => m.position === cameraCurrentIndex);
        if (alreadyHas) return prev;
        return [
          ...prev,
          {
            position: cameraCurrentIndex,
            expectedLetter: currentTargetLetter,
            detectedLetter: result.letter,
          },
        ];
      });
      setFlashWrong(true);
      setTimeout(() => setFlashWrong(false), 600);
    }
  }
  function handleFinish() {
    navigate(lesson ? `/lesson/${lesson.data.levelId}` : null);
  }

  async function handleComplete() {
    setCompleted(true);
    if (isLearningType) {
      await lessonService.completeLesson(lessonId.id.toString());
      await updateXP(xpReward);
      // Check achievements
      achievementService.check('completion', 1).catch(() => {});
      achievementService.check('xp', xpReward).catch(() => {});
    } else if (isCameraChallenge) {
      const avgConfidence =
        cameraConfidences.length > 0
          ? cameraConfidences.reduce((sum, c) => sum + c, 0) /
            cameraConfidences.length
          : 0;

      await cameraService.submitChallenge({
        lessonId: lesson.data._id,
        word: currentWord,
        mistakes: cameraMistakes,
        averageConfidence: avgConfidence,
        answers: [],
      });
      await lessonService.completeLesson(lessonId.id.toString());
      await updateXP(xpReward);
      // Check achievements
      achievementService.check('completion', 1).catch(() => {});
      achievementService.check('xp', xpReward).catch(() => {});
    } else {
      // Practice/Quiz: build SubmitDto
      const correctCount = questions.filter(
        (q, i) => answerIndicates[i] === q.correctAnswer,
      ).length;
      const total = questions.length;
      const accuracy = total > 0 ? (correctCount / total) * 100 : 0;

      const data = {
        lessonId: lesson.data._id,
        quizType: lesson.data.type,
        answers: questions.map((q, i) => ({
          userAnswer: answerIndicates[i] || "",
          timeSpent: timeSpents[i] || 0,
        })),
      };

      // Camera-challenge: add placeholder structure
      if (lesson.data.type === "camera-challenge") {
        data.cameraChallenge = {
          word: lesson.data.content?.challengeWords?.[0] || "",
          mistakes: [],
          averageConfidence: 0,
        };
      }

      if (accuracy >= minAccuracy) {
        await lessonService.completeLesson(lessonId.id.toString());
        await quizService.submit(data);
        await updateXP(xpReward);
        // Check achievements
        achievementService.check('completion', 1).catch(() => {});
        achievementService.check('xp', xpReward).catch(() => {});
        if (accuracy >= 100) {
          achievementService.check('accuracy', 1).catch(() => {});
        }
      } else {
        // Still submit result even if not passed
        await quizService.submit(data);
      }
    }
  }

  function handleNext() {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex((i) => i + 1);
    } else if (allLearned) {
      handleComplete();
    }
  }

  function handleRetry() {
    setCompleted(false);
    setCurrentIndex(0);
    setLearnedLetters([]);
    // Re-initialize timer
    const timeLimit = lesson?.data.requirements?.timeLimit;
    if (timeLimit && !isLearningType) {
      setTimeRemaining(timeLimit);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  // === LOADING STATE ===
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 font-medium">Loading lesson...</p>
      </div>
    );
  }

  // === NO DATA ===
  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <img
          src={mascotStudy}
          alt=""
          className="w-24 mx-auto mb-4 rounded-2xl opacity-50"
        />
        <p className="text-2xl font-bold text-gray-300 mb-2">
          Lesson not found
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:underline"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Lessons
        </Link>
      </div>
    );
  }

  // === COMPLETION SCREEN ===
  if (completed) {
    return (
      <CompletionCard
        type={lesson.data.type}
        pageRef={pageRef}
        xpReward={xpReward}
        handleFinish={handleFinish}
        mascotImage={mascotChef}
        learnedLetters={learnedLetters}
        questions={questions}
        minAccuracy={minAccuracy}
        handleRetry={handleRetry}
        challengeWord={challengeWord}
        cameraMistakes={cameraMistakes}
        cameraConfidences={cameraConfidences}
      />
    );
  }

  // === MAIN UI ===
  const isCurrentLearned = currentSign
    ? learnedLetters.includes(currentSign.letter)
    : false;

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Bar */}
      <div className="learning-header flex items-center gap-4 mb-6">
        <Link
          to={lesson ? `/lesson/${lesson.data.levelId}` : null}
          className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </Link>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-gray-500">
              {currentIndex + 1} / {totalItems}
            </span>
            <div className="flex items-center gap-3">
              {/* Timer */}
              {timeRemaining !== null && (
                <span
                  className={`text-xs font-bold flex items-center gap-1 ${
                    timeRemaining <= 30 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(timeRemaining)}
                </span>
              )}
              <span className="text-xs font-bold text-orange-500">
                {isLearningType
                  ? `${learnedLetters.length} learned`
                  : `${Object.keys(answerIndicates).length} answered`}
              </span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentIndex + 1) / totalItems) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Dots Navigator */}
      {!isCameraChallenge && (
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {isLearningType
            ? signImages.map((sign, i) => {
                const isLearned = learnedLetters.includes(sign.letter);
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={sign.letter}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-orange-500 text-white shadow-md scale-110"
                        : isLearned
                          ? "bg-green-100 text-green-600 border-2 border-green-300"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {isLearned && !isCurrent ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      sign.letter
                    )}
                  </button>
                );
              })
            : questions.map((q, i) => {
                const userAns = answerIndicates[i];
                const isAnswered = userAns !== undefined;
                const isCorrect = userAns === q.correctAnswer;
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-orange-500 text-white shadow-md scale-110"
                        : isAnswered && isCorrect
                          ? "bg-green-100 text-green-600 border-2 border-green-300"
                          : isAnswered && !isCorrect
                            ? "bg-red-100 text-red-600 border-2 border-red-300"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {isAnswered && !isCurrent ? (
                      isCorrect ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )
                    ) : (
                      i + 1
                    )}
                  </button>
                );
              })}
        </div>
      )}

      {/* Sign Card */}
      {isCameraChallenge ? (
        <div className={`sign-card mb-6 transition-all duration-300 ${flashWrong ? "ring-4 ring-red-400 rounded-2xl bg-red-50/30" : ""}`}>
          <div className="flex justify-center gap-2 mb-6">
            {currentWord.split("").map((letter, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-all ${
                  i < cameraCurrentIndex
                    ? "bg-green-100 text-green-600 border-2 border-green-300"
                    : i === cameraCurrentIndex
                      ? "bg-orange-500 text-white scale-110 shadow-lg shadow-orange-200"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {letter}
              </div>
            ))}
          </div>
          <CameraView onLetterDetected={handleCameraDetected} />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-400">
              Word {cameraWordIndex + 1} / {challengeWord.length}
            </p>
            {flashWrong && (
              <span className="text-sm font-bold text-red-500 animate-pulse">
                Wrong letter! Try again
              </span>
            )}
          </div>
        </div>
      ) : (
        <Card
          type={lesson.data.type}
          cardRef={cardRef}
          currentIndex={currentIndex}
          signImages={signImages}
          currentSign={currentSign}
          isCurrentLearned={isCurrentLearned}
          handleMarkLearned={handleMarkLearned}
          question={currentQuestion}
          questions={questions}
        />
      )}
      {!isCameraChallenge && (
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
              currentIndex === totalItems - 1 && allLearned
                ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200 hover:shadow-xl"
                : currentIndex === totalItems - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 text-white shadow-lg shadow-orange-200 hover:bg-orange-600"
            }`}
            disabled={currentIndex === totalItems - 1 && !allLearned}
          >
            {currentIndex === totalItems - 1 ? (
              <>
                <Trophy className="w-5 h-5" />
                Complete!
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* XP Info */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
        <Star className="w-4 h-4 text-amber-500" />
        <span>
          Complete to earn <b className="text-amber-500">+{xpReward} XP</b>
        </span>
      </div>
    </div>
  );
}
