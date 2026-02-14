import { useRef, useState } from "react";
import {
  Trophy,
  Sparkles,
  Star,
  Check,
  X,
  BookOpen,
  Target,
  RotateCcw,
  Camera,
  AlertTriangle,
} from "lucide-react";
import { LESSON_TYPE } from "../../utils/constants";
import { formatAccuracy } from "../../utils/formatters";
import PracticeContext from "../../context/PracticeContext";
import finishVideo from "../../assets/finish/dreamina-2026-02-14-2721-2D animation of an orange fish mascot on....mp4";

export const CompletionCard = ({
  type = LESSON_TYPE.LEARNING,
  pageRef,

  // === Shared props ===
  xpReward = 0,
  handleFinish = () => {},
  mascotImage = null,

  // === LEARNING props ===
  learnedLetters = [],

  // === PRACTICE / QUIZ props ===
  questions = [],
  minAccuracy = 70,
  handleRetry: onRetry = () => {},

  // === CAMERA CHALLENGE props ===
  challengeWord = [],
  cameraMistakes = [],
  cameraConfidences = [],
}) => {
  const { answerIndicates, resetAnswer } = PracticeContext();
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);

  // Camera challenge stats
  const avgConfidence =
    cameraConfidences.length > 0
      ? Math.round(
          (cameraConfidences.reduce((s, c) => s + c, 0) /
            cameraConfidences.length) *
            100,
        )
      : 0;

  // Score calculation using questions
  const totalQuestions = questions.length;
  const correctCount = questions.filter(
    (q, i) => answerIndicates[i] === q.correctAnswer,
  ).length;
  const wrongCount = totalQuestions - correctCount;
  const accuracyRaw =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const accuracy = formatAccuracy(correctCount, totalQuestions);
  const isPassed = accuracyRaw >= minAccuracy;

  function handleRetry() {
    resetAnswer();
    onRetry();
  }

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center py-8">
        {/* ==================== LEARNING COMPLETE ==================== */}
        {type === LESSON_TYPE.LEARNING && (
          <>
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-linear-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-orange-200">
                <Trophy className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-bounce">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Lesson Complete!
            </h1>
            <p className="text-gray-400 font-medium mb-8">
              You learned {learnedLetters.length} new signs
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
              <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
                <Star className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">+{xpReward}</p>
                <p className="text-[10px] font-bold text-gray-400">XP EARNED</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                <Check className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">
                  {learnedLetters.length}
                </p>
                <p className="text-[10px] font-bold text-gray-400">SIGNS</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
                <BookOpen className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">100%</p>
                <p className="text-[10px] font-bold text-gray-400">COMPLETE</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center mb-8 flex-wrap">
              {learnedLetters.map((letter) => (
                <div
                  key={letter}
                  className="w-14 h-14 bg-linear-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-md"
                >
                  <span className="text-2xl font-bold text-white">
                    {letter}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ==================== PRACTICE COMPLETE ==================== */}
        {type === LESSON_TYPE.PRACTICE && (
          <>
            <div className="relative inline-block mb-6">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-xl ${
                  isPassed
                    ? "bg-linear-to-br from-green-400 to-emerald-500 shadow-green-200"
                    : "bg-linear-to-br from-orange-400 to-amber-500 shadow-orange-200"
                }`}
              >
                {isPassed ? (
                  <Trophy className="w-16 h-16 text-white" />
                ) : (
                  <Target className="w-16 h-16 text-white" />
                )}
              </div>
              {isPassed && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isPassed ? "Great Job!" : "Practice Complete!"}
            </h1>
            <p className="text-gray-400 font-medium mb-8">
              {isPassed
                ? `You got ${correctCount} out of ${totalQuestions} correct!`
                : `You got ${correctCount} out of ${totalQuestions} correct`}
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
              <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                <Check className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">
                  {correctCount}
                </p>
                <p className="text-[10px] font-bold text-gray-400">CORRECT</p>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                <X className="w-6 h-6 text-red-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">{wrongCount}</p>
                <p className="text-[10px] font-bold text-gray-400">WRONG</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
                <Target className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">{accuracy}</p>
                <p className="text-[10px] font-bold text-gray-400">ACCURACY</p>
              </div>
            </div>

            {/* Answer Review */}
            <div className="flex gap-3 justify-center mb-8 flex-wrap">
              {questions.map((q, i) => {
                const userAns = answerIndicates[i];
                const isRight = userAns === q.correctAnswer;
                return (
                  <div
                    key={i}
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-md border-2 ${
                      isRight
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <span
                      className={`text-lg font-bold ${isRight ? "text-green-600" : "text-red-600"}`}
                    >
                      {q.correctAnswer}
                    </span>
                    {!isRight && userAns && (
                      <span className="text-[9px] font-bold text-red-400 line-through">
                        {userAns}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {isPassed && (
              <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 max-w-[200px] mx-auto mb-8">
                <Star className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">+{xpReward}</p>
                <p className="text-[10px] font-bold text-gray-400">XP EARNED</p>
              </div>
            )}
          </>
        )}

        {/* ==================== QUIZ COMPLETE ==================== */}
        {type === LESSON_TYPE.QUIZ && (
          <>
            <div className="relative inline-block mb-6">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-xl ${
                  isPassed
                    ? "bg-linear-to-br from-green-400 to-emerald-500 shadow-green-200"
                    : "bg-linear-to-br from-red-400 to-rose-500 shadow-red-200"
                }`}
              >
                {isPassed ? (
                  <Trophy className="w-16 h-16 text-white" />
                ) : (
                  <X className="w-16 h-16 text-white" />
                )}
              </div>
              {isPassed && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {isPassed ? "Quiz Passed!" : "Quiz Failed"}
            </h1>
            <p className="text-gray-400 font-medium mb-8">
              {isPassed
                ? "Congratulations! You passed the quiz!"
                : `You need ${minAccuracy}% to pass. Got ${correctCount}/${totalQuestions}`}
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
              <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                <Check className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">
                  {correctCount}
                </p>
                <p className="text-[10px] font-bold text-gray-400">CORRECT</p>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                <X className="w-6 h-6 text-red-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">{wrongCount}</p>
                <p className="text-[10px] font-bold text-gray-400">WRONG</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
                <Target className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">{accuracy}</p>
                <p className="text-[10px] font-bold text-gray-400">ACCURACY</p>
              </div>
            </div>

            {/* Answer Review */}
            <div className="flex gap-3 justify-center mb-8 flex-wrap">
              {questions.map((q, i) => {
                const userAns = answerIndicates[i];
                const isRight = userAns === q.correctAnswer;
                return (
                  <div
                    key={i}
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-md border-2 ${
                      isRight
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <span
                      className={`text-lg font-bold ${isRight ? "text-green-600" : "text-red-600"}`}
                    >
                      {q.correctAnswer}
                    </span>
                    {!isRight && userAns && (
                      <span className="text-[9px] font-bold text-red-400 line-through">
                        {userAns}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {isPassed && (
              <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 max-w-[200px] mx-auto mb-8">
                <Star className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-gray-800">+{xpReward}</p>
                <p className="text-[10px] font-bold text-gray-400">XP EARNED</p>
              </div>
            )}
          </>
        )}

        {/* ==================== CAMERA CHALLENGE COMPLETE ==================== */}
        {type === LESSON_TYPE.CAMERA_CHALLENGE && (
          <>
            {/* Video plays first */}
            {!videoEnded ? (
              <div className="mb-6">
                <video
                  ref={videoRef}
                  src={finishVideo}
                  autoPlay
                  muted
                  playsInline
                  onEnded={() => setVideoEnded(true)}
                  className="w-64 h-64 object-cover rounded-3xl mx-auto shadow-xl"
                />
                <p className="text-gray-400 text-sm mt-3 animate-pulse">
                  Loading results...
                </p>
              </div>
            ) : (
              <>
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-200">
                    <Trophy className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Challenge Complete!
                </h1>
                <p className="text-gray-400 font-medium mb-8">
                  You signed {challengeWord.length} word
                  {challengeWord.length > 1 ? "s" : ""} successfully!
                </p>

                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
                  <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
                    <Star className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                    <p className="text-xl font-bold text-gray-800">
                      +{xpReward}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400">
                      XP EARNED
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                    <Camera className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <p className="text-xl font-bold text-gray-800">
                      {avgConfidence}%
                    </p>
                    <p className="text-[10px] font-bold text-gray-400">
                      CONFIDENCE
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-2xl p-4 border-2 border-red-200">
                    <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                    <p className="text-xl font-bold text-gray-800">
                      {cameraMistakes.length}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400">
                      MISTAKES
                    </p>
                  </div>
                </div>

                {/* Words completed */}
                <div className="flex gap-3 justify-center mb-8 flex-wrap">
                  {challengeWord.map((word, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 bg-linear-to-br from-orange-500 to-amber-500 rounded-2xl shadow-md"
                    >
                      <span className="text-lg font-bold text-white tracking-widest">
                        {word}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ==================== MASCOT ==================== */}
        {mascotImage && type !== LESSON_TYPE.CAMERA_CHALLENGE && (
          <img
            src={mascotImage}
            alt="Congrats!"
            className="w-28 mx-auto mb-8 rounded-2xl border-4 border-orange-200 shadow-lg"
          />
        )}

        {/* ==================== ACTIONS ==================== */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
          {type === LESSON_TYPE.LEARNING && (
            <button
              onClick={handleFinish}
              className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold text-sm hover:bg-orange-600 shadow-lg shadow-orange-200 transition cursor-pointer"
            >
              Back to Lessons
            </button>
          )}

          {type === LESSON_TYPE.PRACTICE && (
            <>
              {!isPassed && (
                <button
                  onClick={handleRetry}
                  className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold text-sm hover:bg-orange-600 shadow-lg shadow-orange-200 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
              )}
              <button
                onClick={handleFinish}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition cursor-pointer ${
                  isPassed
                    ? "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Back to Lessons
              </button>
            </>
          )}

          {type === LESSON_TYPE.CAMERA_CHALLENGE && videoEnded && (
            <button
              onClick={handleFinish}
              className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-bold text-sm hover:bg-green-600 shadow-lg shadow-green-200 transition cursor-pointer"
            >
              Back to Lessons
            </button>
          )}

          {type === LESSON_TYPE.QUIZ && (
            <>
              {!isPassed && (
                <button
                  onClick={handleRetry}
                  className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold text-sm hover:bg-orange-600 shadow-lg shadow-orange-200 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retry Quiz
                </button>
              )}
              <button
                onClick={handleFinish}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition cursor-pointer ${
                  isPassed
                    ? "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Back to Lessons
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletionCard;
