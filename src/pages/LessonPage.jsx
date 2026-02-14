import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, BookOpen, Hand, Camera, ChevronRight, Clock ,CheckCircle } from "lucide-react";
import gsap from "gsap";
import levelService from "../services/levelService";
import letterImages from "../utils/letterImages";

const colorStyles = {
  orange: { bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-500", border: "border-orange-200" },
  amber: { bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-500", border: "border-amber-200" },
  yellow: { bg: "bg-yellow-500", light: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
  green: { bg: "bg-green-500", light: "bg-green-50", text: "text-green-500", border: "border-green-200" },
  emerald: { bg: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-500", border: "border-emerald-200" },
  teal: { bg: "bg-teal-500", light: "bg-teal-50", text: "text-teal-500", border: "border-teal-200" },
  blue: { bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-500", border: "border-blue-200" },
  indigo: { bg: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-500", border: "border-indigo-200" },
  purple: { bg: "bg-purple-500", light: "bg-purple-50", text: "text-purple-500", border: "border-purple-200" },
};

const colorOrder = ["orange", "amber", "yellow", "green", "emerald", "teal", "blue", "indigo", "purple"];

// Icon berdasarkan tipe lesson
const lessonTypeIcon = {
  learning: <BookOpen className="w-6 h-6" />,
  quiz: <Hand className="w-6 h-6" />,
  challenge: <Camera className="w-6 h-6" />,
};

export default function LessonPage() {
  const { id } = useParams();
  const pageRef = useRef(null);
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch level data dari API
  useEffect(() => {
    async function fetchLevel() {
      try {
        const data = await levelService.getLevelById(id);
        setLevel(data.data);
      } catch (err) {
        console.error("Failed to fetch level:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLevel();
  }, [id]);

  // GSAP animations
  useEffect(() => {
    if (loading || !level) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lesson-header",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );

      gsap.fromTo(
        ".lesson-card",
        { y: 30, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(1.3)",
          delay: 0.2,
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [loading, level]);

  // Cari index level ini dari semua levels buat warna
  // Karena kita cuma fetch 1 level, pakai fallback color
  const colorName = colorOrder[0]; // default orange, bisa di-improve nanti
  const colors = colorStyles[colorName];

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 font-medium">Loading level...</p>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-2xl font-bold text-gray-300">Level not found</p>
        <Link
          to="/levels"
          className="inline-flex items-center gap-2 mt-4 text-orange-500 font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Levels
        </Link>
      </div>
    );
  }

  // Kumpulkan semua huruf unik dari semua lessons
  const allLetters = [...new Set(
    level.lessons?.flatMap((lesson) => lesson.content?.letters || []) || []
  )];

  // Total XP
  const totalXP = level.lessons?.reduce(
    (sum, lesson) => sum + (lesson.rewards?.xpPoints || 0), 0
  ) || 0;

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back button */}
      <Link
        to="/levels"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Levels
      </Link>

      {/* Level Header */}
      <div className={`lesson-header ${colors.light} rounded-3xl p-6 sm:p-8 border-2 ${colors.border} mb-8`}>
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center shadow-md`}
          >
            <Star className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{level.description}</h1>
            <p className="text-sm text-gray-400 font-medium">
              {allLetters.length} letters · {level.lessons?.length || 0} lessons · {totalXP} XP
            </p>
          </div>
        </div>

        {/* Letter bubbles with sign images */}
        <div className="flex gap-3 flex-wrap">
          {allLetters.map((letter) => {
            const img = letterImages[letter];
            return (
              <div
                key={letter}
                className="relative w-16 h-20 flex flex-col items-center"
              >
                {img ? (
                  <img
                    src={img}
                    alt={letter}
                    className="w-14 h-14 object-cover rounded-2xl border-2 border-white shadow-sm"
                  />
                ) : (
                  <div
                    className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center shadow-sm`}
                  >
                    <span className="text-2xl font-bold text-white">{letter}</span>
                  </div>
                )}
                <span className={`text-xs font-bold mt-1 ${colors.text}`}>
                  {letter}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lessons List */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Lessons</h2>
      <div className="space-y-4">
        {level.lessons?.map((lesson) => {
          const icon = lessonTypeIcon[lesson.type] || <BookOpen className="w-6 h-6" />;
          const lessonLetters = lesson.content?.letters || [];
          const xp = lesson.rewards?.xpPoints || 0;

          return lesson.isCompleted ? (
            <div key={lesson._id} className="lesson-card">
              <Link
                to={`/learn/${lesson._id}`}
                className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div
                  className={`w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-500 group-hover:scale-110 transition`}
                >
                  {<CheckCircle/>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-800 mb-0.5">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium truncate">
                    {lesson.description}
                  </p>
                  {lessonLetters.length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {lessonLetters.map((l) => (
                        <span
                          key={l}
                          className={`w-6 h-6 rounded-md ${colors.light} ${colors.text} text-[10px] font-bold flex items-center justify-center`}
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-amber-500">
                      +{xp}
                    </span>
                  </div>
                  {lesson.estimatedDuration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-[10px] font-bold text-gray-300">
                        {lesson.estimatedDuration} min
                      </span>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) :  (
            <div key={lesson._id} className="lesson-card">
              <Link
                to={`/learn/${lesson._id}`}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div
                  className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center ${colors.text} group-hover:scale-110 transition`}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-800 mb-0.5">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium truncate">
                    {lesson.description}
                  </p>
                  {lessonLetters.length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {lessonLetters.map((l) => (
                        <span
                          key={l}
                          className={`w-6 h-6 rounded-md ${colors.light} ${colors.text} text-[10px] font-bold flex items-center justify-center`}
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-amber-500">
                      +{xp}
                    </span>
                  </div>
                  {lesson.estimatedDuration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-[10px] font-bold text-gray-300">
                        {lesson.estimatedDuration} min
                      </span>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
