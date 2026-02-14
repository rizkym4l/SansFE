import {
  Check,
  Hand,
  Sparkles,
  HelpCircle,
  Send,
  X,
  CircleCheck,
} from "lucide-react";
import { LESSON_TYPE } from "../../utils/constants";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import PracticeContext from "../../context/PracticeContext";
import letterImages from "../../utils/letterImages";

export const Card = ({
  type = LESSON_TYPE.LEARNING,
  cardRef,
  currentIndex,
  signImages = [],

  // === LEARNING props ===
  currentSign,
  isCurrentLearned,
  handleMarkLearned,

  // === PRACTICE / QUIZ props ===
  question = null,
  questions = [],
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    setValue,
  } = useForm();

  const { answerIndicates, setAnswer, setTimeSpent, resetAnswer } = PracticeContext();
  const questionStartTime = useRef(Date.now());

  useEffect(() => {
    resetAnswer();
  }, []);

  useEffect(() => {
    setValue("answer", "");
    questionStartTime.current = Date.now();
  }, [currentIndex]);

  useEffect(() => {
    if (errors.answer) {
      const timer = setTimeout(() => clearErrors("answer"), 2000);
      return () => clearTimeout(timer);
    }
  }, [errors.answer]);

  const isLearningType = type === LESSON_TYPE.LEARNING;
  const items = isLearningType ? signImages : questions;

  // Answer state for questions
  const currentAnswer = answerIndicates[currentIndex];
  const isQuestionAnswered = currentAnswer !== undefined;
  const isQuestionCorrect = question
    ? currentAnswer === question.correctAnswer
    : false;

  // Image display logic — prefer local assets, fallback to API URL
  const showImage =
    isLearningType
      ? letterImages[currentSign?.letter] || currentSign?.imageUrl
      : question?.questionType !== "text-to-image"
        ? letterImages[question?.correctAnswer] || question?.imageUrl
        : null;

  // Record answer + time spent
  const submitAnswer = (index, answer) => {
    const elapsed = Math.round((Date.now() - questionStartTime.current) / 1000);
    setAnswer(index, answer);
    setTimeSpent(index, elapsed);
  };

  // Map letter to local image, fallback to API data
  const getImageForLetter = (letter) => {
    if (letterImages[letter]) return letterImages[letter];
    const sign = signImages.find((s) => s.letter === letter);
    return sign?.imageUrl;
  };

  return (
    <div>
      {(currentSign || question) && (
        <div ref={cardRef} className="sign-card mb-6">
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-lg overflow-hidden">
            {/* ==================== IMAGE AREA ==================== */}
            <div className="relative bg-linear-to-br from-orange-50 to-amber-50 p-8 flex items-center justify-center min-h-[280px] sm:min-h-[340px]">
              {/* Letter Badge — learning: huruf, practice/quiz: "?" */}
              {isLearningType ? (
                <div className="absolute top-4 left-4 w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-3xl font-bold text-white">
                    {currentSign.letter}
                  </span>
                </div>
              ) : (
                <div className="absolute top-4 left-4 w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-md">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
              )}

              {/* Learned Badge — learning only */}
              {isLearningType && isCurrentLearned && (
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-md">
                  <Check className="w-3.5 h-3.5" />
                  Learned
                </div>
              )}

              {/* Answered Badge — questions only */}
              {!isLearningType && isQuestionAnswered && (
                <div
                  className={`absolute top-4 right-4 px-3 py-1.5 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-md ${
                    isQuestionCorrect ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {isQuestionCorrect ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                  {isQuestionCorrect ? "Correct!" : "Wrong"}
                </div>
              )}

              {/* Main Display */}
              <div className="relative">
                {question?.questionType === "text-to-image" ? (
                  /* text-to-image: show big letter */
                  <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white rounded-3xl shadow-inner flex items-center justify-center border-2 border-purple-100">
                    <span className="text-8xl font-bold text-purple-500">
                      {question.correctAnswer}
                    </span>
                  </div>
                ) : (
                  /* learning, image-to-text, multiple-choice: show image */
                  <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white rounded-3xl shadow-inner flex items-center justify-center border-2 border-orange-100">
                    {showImage ? (
                      <img
                        src={showImage}
                        alt="Sign"
                        className="w-full h-full object-contain rounded-3xl p-2"
                      />
                    ) : (
                      <Hand className="w-24 h-24 text-orange-300" />
                    )}
                  </div>
                )}
              </div>

              {/* Decorative dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {items.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex ? "bg-orange-500 w-6" : "bg-orange-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ==================== INFO AREA ==================== */}
            <div className="p-6">
              {/* ────────── LEARNING ────────── */}
              {isLearningType && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Letter "{currentSign.letter}"
                  </h2>
                  <p className="text-gray-400 font-medium mb-5">
                    {currentSign.description}
                  </p>

                  <button
                    onClick={handleMarkLearned}
                    className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCurrentLearned
                        ? "bg-green-50 text-green-600 border-2 border-green-300 hover:bg-green-100"
                        : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200"
                    }`}
                  >
                    {isCurrentLearned ? (
                      <>
                        <Check className="w-5 h-5" />
                        Learned! Tap to unmark
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Mark as Learned
                      </>
                    )}
                  </button>
                </>
              )}

              {/* ────────── IMAGE-TO-TEXT ────────── */}
              {!isLearningType && question?.questionType === "image-to-text" && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    What letter is this?
                  </h2>
                  <p className="text-gray-400 font-medium mb-5">
                    Type the letter that matches this hand sign
                  </p>

                  {!isQuestionAnswered ? (
                    <>
                      <div className="flex gap-3">
                        <input
                          {...register("answer", {
                            required: {
                              value: true,
                              message: "Fill the answer",
                            },
                            setValueAs: (v) => v.toUpperCase(),
                          })}
                          type="text"
                          placeholder="A"
                          disabled={isQuestionAnswered}
                          className={`flex-1 text-center text-3xl font-bold py-4 rounded-2xl border-2 focus:outline-none transition-all uppercase placeholder:text-gray-200 ${
                            errors.answer
                              ? "border-red-400 focus:border-red-400"
                              : "border-gray-200 focus:border-orange-400"
                          }`}
                        />
                        <button
                          onClick={handleSubmit((data) => {
                            submitAnswer(currentIndex, data.answer);
                            setValue("answer", "");
                          })}
                          disabled={isQuestionAnswered}
                          className="px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-orange-500 text-white shadow-orange-200 hover:bg-orange-600"
                        >
                          <Send className="w-5 h-5" />
                          Submit
                        </button>
                      </div>
                      {errors.answer && (
                        <div className="text-red-500">
                          Fill the Answer please
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      className={`w-full py-4 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 ${
                        isQuestionCorrect
                          ? "bg-green-50 text-green-600 border-2 border-green-300"
                          : "bg-red-50 text-red-600 border-2 border-red-300"
                      }`}
                    >
                      {isQuestionCorrect ? (
                        <>
                          <CircleCheck className="w-6 h-6" />
                          <span>
                            Correct! The answer is "{question.correctAnswer}"
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="w-6 h-6" />
                          <span>
                            Wrong! The correct answer is "
                            {question.correctAnswer}"
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ────────── TEXT-TO-IMAGE ────────── */}
              {!isLearningType && question?.questionType === "text-to-image" && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Which sign shows "{question.correctAnswer}"?
                  </h2>
                  <p className="text-gray-400 font-medium mb-5">
                    Select the correct hand sign for this letter
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {question.options.map((optLetter) => {
                      const imgUrl = getImageForLetter(optLetter);
                      const isSelected = currentAnswer === optLetter;
                      const showResult = isQuestionAnswered;
                      const isCorrectOpt =
                        optLetter === question.correctAnswer;

                      let btnClass =
                        "bg-gray-50 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer";
                      if (showResult && isCorrectOpt) {
                        btnClass = "bg-green-50 border-2 border-green-400";
                      } else if (showResult && isSelected && !isCorrectOpt) {
                        btnClass = "bg-red-50 border-2 border-red-400";
                      }

                      return (
                        <button
                          key={optLetter}
                          onClick={() => {
                            if (!isQuestionAnswered) {
                              submitAnswer(currentIndex, optLetter);
                            }
                          }}
                          disabled={isQuestionAnswered}
                          className={`p-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all disabled:cursor-not-allowed ${btnClass}`}
                        >
                          <div className="w-full aspect-square rounded-xl overflow-hidden bg-white flex items-center justify-center">
                            <img
                              src={imgUrl}
                              alt={optLetter}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          {showResult && (
                            <span
                              className={`text-xs font-bold flex items-center gap-1 ${
                                isCorrectOpt
                                  ? "text-green-600"
                                  : isSelected
                                    ? "text-red-600"
                                    : "text-gray-400"
                              }`}
                            >
                              {isCorrectOpt && (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              {isSelected && !isCorrectOpt && (
                                <X className="w-3.5 h-3.5" />
                              )}
                              {optLetter}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ────────── MULTIPLE-CHOICE ────────── */}
              {!isLearningType &&
                question?.questionType === "multiple-choice" && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                      Choose the correct letter
                    </h2>
                    <p className="text-gray-400 font-medium mb-5">
                      Select the letter that matches this hand sign
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {question.options.map((option) => {
                        const isSelected = currentAnswer === option;
                        const showResult = isQuestionAnswered;
                        const isOptionCorrect =
                          option === question.correctAnswer;

                        let btnClass =
                          "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer";
                        if (showResult && isOptionCorrect) {
                          btnClass =
                            "bg-green-50 text-green-700 border-2 border-green-400";
                        } else if (
                          showResult &&
                          isSelected &&
                          !isOptionCorrect
                        ) {
                          btnClass =
                            "bg-red-50 text-red-700 border-2 border-red-400";
                        } else if (isSelected && !showResult) {
                          btnClass =
                            "bg-orange-50 text-orange-700 border-2 border-orange-400";
                        }

                        return (
                          <button
                            key={option}
                            onClick={() => {
                              if (!isQuestionAnswered) {
                                submitAnswer(currentIndex, option);
                              }
                            }}
                            disabled={isQuestionAnswered}
                            className={`py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed ${btnClass}`}
                          >
                            {showResult && isOptionCorrect && (
                              <Check className="w-5 h-5" />
                            )}
                            {showResult && isSelected && !isOptionCorrect && (
                              <X className="w-5 h-5" />
                            )}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
