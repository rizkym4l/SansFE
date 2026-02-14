import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Check, Star, ChevronRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import useAuthStore from "../context/AuthContext";
import mascotStudy from "../assets/home/mascot-study.jpeg";
import levelService from "../services/levelService";
import Loading from "../components/common/Loading";

const colorMap = {
  orange: {
    bg: "bg-orange-500",
    gradient: "from-orange-400 to-orange-600",
    light: "bg-orange-50/80",
    text: "text-orange-600",
    border: "border-orange-200/60",
    ring: "ring-orange-400/40",
    glow: "#f97316",
  },
  amber: {
    bg: "bg-amber-500",
    gradient: "from-amber-400 to-amber-600",
    light: "bg-amber-50/80",
    text: "text-amber-600",
    border: "border-amber-200/60",
    ring: "ring-amber-400/40",
    glow: "#f59e0b",
  },
  yellow: {
    bg: "bg-yellow-500",
    gradient: "from-yellow-400 to-yellow-600",
    light: "bg-yellow-50/80",
    text: "text-yellow-600",
    border: "border-yellow-200/60",
    ring: "ring-yellow-400/40",
    glow: "#eab308",
  },
  green: {
    bg: "bg-green-500",
    gradient: "from-green-400 to-green-600",
    light: "bg-green-50/80",
    text: "text-green-600",
    border: "border-green-200/60",
    ring: "ring-green-400/40",
    glow: "#22c55e",
  },
  emerald: {
    bg: "bg-emerald-500",
    gradient: "from-emerald-400 to-emerald-600",
    light: "bg-emerald-50/80",
    text: "text-emerald-600",
    border: "border-emerald-200/60",
    ring: "ring-emerald-400/40",
    glow: "#10b981",
  },
  teal: {
    bg: "bg-teal-500",
    gradient: "from-teal-400 to-teal-600",
    light: "bg-teal-50/80",
    text: "text-teal-600",
    border: "border-teal-200/60",
    ring: "ring-teal-400/40",
    glow: "#14b8a6",
  },
  blue: {
    bg: "bg-blue-500",
    gradient: "from-blue-400 to-blue-600",
    light: "bg-blue-50/80",
    text: "text-blue-600",
    border: "border-blue-200/60",
    ring: "ring-blue-400/40",
    glow: "#3b82f6",
  },
  indigo: {
    bg: "bg-indigo-500",
    gradient: "from-indigo-400 to-indigo-600",
    light: "bg-indigo-50/80",
    text: "text-indigo-600",
    border: "border-indigo-200/60",
    ring: "ring-indigo-400/40",
    glow: "#6366f1",
  },
  purple: {
    bg: "bg-purple-500",
    gradient: "from-purple-400 to-purple-600",
    light: "bg-purple-50/80",
    text: "text-purple-600",
    border: "border-purple-200/60",
    ring: "ring-purple-400/40",
    glow: "#a855f7",
  },
};

const colorOrder = [
  "orange",
  "amber",
  "yellow",
  "green",
  "emerald",
  "teal",
  "blue",
  "indigo",
  "purple",
];

export default function LevelsPage() {
  const [loading, setisLoading] = useState(true);
  const { user } = useAuthStore();
  const [levels, setLevels] = useState([]);
  const pageRef = useRef(null);
  const currentLevel = user?.stats?.currentLevel ?? 1;

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const data = await levelService.getAllLevels();
        setLevels(data.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setisLoading(false);
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    if (loading || levels.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Header entrance
      tl.fromTo(
        ".level-header",
        { y: -50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8 },
      );

      // 2. Connecting line grows from top
      tl.fromTo(
        ".connect-line",
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, duration: 1.2, ease: "power2.inOut" },
        "-=0.4",
      );

      // 3. Nodes pop in with bounce
      tl.fromTo(
        ".level-node",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(2)",
        },
        "-=0.8",
      );

      // 4. Cards slide up
      tl.fromTo(
        ".level-card",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.8",
      );

      // 5. Trophy bounces in
      tl.fromTo(
        ".trophy-node",
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1, ease: "elastic.out(1, 0.5)" },
        "-=0.3",
      );

      // --- Continuous animations ---

      // Floating mascot
      gsap.to(".float-mascot-levels", {
        y: -12,
        rotation: 3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Floating decorative orbs
      gsap.to(".deco-orb", {
        y: -20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.8, from: "random" },
      });

      // Pulse on current level
      gsap.to(".current-pulse", {
        scale: 1.8,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power1.out",
      });

      // Sparkle rotation
      gsap.to(".sparkle-spin", {
        rotation: 360,
        duration: 6,
        repeat: -1,
        ease: "none",
      });
    }, pageRef);

    return () => ctx.revert();
  }, [loading, levels]);

  if (loading) return <Loading />;

  return (
    <div
      ref={pageRef}
      className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative"
    >
      {/* Decorative background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="deco-orb absolute top-16 -left-8 w-32 h-32 rounded-full bg-orange-200/20 blur-2xl" />
        <div className="deco-orb absolute top-60 -right-12 w-40 h-40 rounded-full bg-amber-200/15 blur-2xl" />
        <div className="deco-orb absolute top-[40%] -left-16 w-36 h-36 rounded-full bg-green-200/15 blur-2xl" />
        <div className="deco-orb absolute top-[65%] -right-8 w-28 h-28 rounded-full bg-blue-200/15 blur-2xl" />
        <div className="deco-orb absolute bottom-32 -left-10 w-24 h-24 rounded-full bg-purple-200/20 blur-2xl" />
      </div>

      {/* Header */}
      <div className="level-header text-center mb-12">
        <div className="relative inline-block mb-4">
          <img
            src={mascotStudy}
            alt="Mascot"
            className="float-mascot-levels w-24 h-24 mx-auto rounded-2xl shadow-xl shadow-orange-200/40 border-4 border-white object-cover"
          />
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center border-2 border-white shadow-md">
            <Sparkles className="sparkle-spin w-3 h-3 text-white" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-orange-500 via-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
          Learning Path
        </h1>
        <p className="text-gray-400 font-medium">
          Master sign language step by step — A to Z!
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-16 bg-linear-to-r from-transparent to-orange-300/50" />
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className="w-3 h-3 text-amber-400/60"
                fill="currentColor"
              />
            ))}
          </div>
          <div className="h-px w-16 bg-linear-to-l from-transparent to-orange-300/50" />
        </div>
      </div>

      {/* Levels Path */}
      <div className="relative">
        {/* Animated gradient connecting line */}
        <div className="connect-line absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 rounded-full overflow-hidden">
          <div className="w-full h-full bg-linear-to-b from-orange-300 via-green-300 to-purple-300 opacity-40" />
        </div>

        <div className="space-y-8">
          {levels.map((level, index) => {
            const levelNum = level.levelNumber ?? index + 1;
            const isCompleted = levelNum < currentLevel;
            const isCurrent = levelNum === currentLevel;
            const isLocked = levelNum > currentLevel;
            const colors = colorMap[colorOrder[index % colorOrder.length]];
            const isLeft = index % 2 === 0;

            const allLetters = [
              ...new Set(
                level.lessons?.flatMap(
                  (lesson) => lesson.content?.letters || [],
                ) || [],
              ),
            ];

            const totalXP =
              level.lessons?.reduce(
                (sum, lesson) => sum + (lesson.rewards?.xpPoints || 0),
                0,
              ) || 0;

            return (
              <div key={level._id} className="level-node relative">
                {/* Center circle node */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    {/* Pulse ring for current level */}
                    {isCurrent && (
                      <div
                        className="current-pulse absolute inset-0 rounded-full"
                        style={{ background: colors.glow, opacity: 0.3 }}
                      />
                    )}

                    {/* Spinning conic ring for current level */}
                    {isCurrent && (
                      <div
                        className="absolute -inset-2 rounded-full animate-spin"
                        style={{
                          background: `conic-gradient(from 0deg, transparent 60%, ${colors.glow}80, transparent)`,
                          animationDuration: "3s",
                        }}
                      />
                    )}

                    {/* Main circle */}
                    <div
                      className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 border-white transition-all duration-300 ${
                        isCompleted
                          ? `bg-linear-to-br ${colors.gradient}`
                          : isCurrent
                            ? `bg-linear-to-br ${colors.gradient} ring-4 ${colors.ring}`
                            : "bg-gray-200 border-gray-300"
                      }`}
                      style={
                        isCompleted || isCurrent
                          ? { boxShadow: `0 8px 25px ${colors.glow}35` }
                          : {}
                      }
                    >
                      {isCompleted ? (
                        <Check
                          className="w-7 h-7 text-white drop-shadow-md"
                          strokeWidth={3}
                        />
                      ) : isLocked ? (
                        <Lock className="w-6 h-6 text-gray-400" />
                      ) : (
                        <span className="text-xl font-bold text-white drop-shadow-md">
                          {levelNum}
                        </span>
                      )}
                    </div>

                    {/* Sparkle on completed */}
                    {isCompleted && (
                      <Sparkles className="sparkle-spin absolute -top-1 -right-1 w-4 h-4 text-amber-400 drop-shadow-sm" />
                    )}
                  </div>
                </div>

                {/* Level card */}
                <div
                  className={`level-card mt-3 sm:absolute sm:top-0 sm:w-56 ${
                    isLeft
                      ? "sm:right-[calc(50%+3rem)]"
                      : "sm:left-[calc(50%+3rem)]"
                  }`}
                >
                  {isLocked ? (
                    <div className="backdrop-blur-sm bg-white/50 rounded-2xl p-4 border border-gray-200/50 opacity-50 shadow-sm">
                      <p className="text-sm font-bold text-gray-400">
                        {level.description}
                      </p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {allLetters.map((l) => (
                          <span
                            key={l}
                            className="w-7 h-7 rounded-lg bg-gray-100/80 text-gray-400 text-xs font-bold flex items-center justify-center"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={`/lesson/${level._id}`}
                      className={`block backdrop-blur-sm ${colors.light} rounded-2xl p-4 border ${colors.border} hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 group relative overflow-hidden`}
                      style={{
                        boxShadow: `0 4px 20px ${colors.glow}12`,
                      }}
                    >
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-sm font-bold ${colors.text}`}>
                            {level.description}
                          </p>
                          <ChevronRight
                            className={`w-4 h-4 ${colors.text} group-hover:translate-x-1 transition-transform duration-300`}
                          />
                        </div>
                        <div className="flex gap-1.5 mb-3 flex-wrap">
                          {allLetters.map((l) => (
                            <span
                              key={l}
                              className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-105 ${
                                isCompleted
                                  ? `bg-linear-to-br ${colors.gradient} text-white`
                                  : `bg-white/80 ${colors.text}`
                              }`}
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star
                            className="w-3.5 h-3.5 text-amber-500"
                            fill="currentColor"
                          />
                          <span className="text-xs font-bold text-gray-500">
                            {totalXP} XP
                          </span>
                          {isCompleted && (
                            <span className="ml-auto text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                              Completed!
                            </span>
                          )}
                          {isCurrent && (
                            <span
                              className={`ml-auto text-[10px] font-bold ${colors.text} bg-white/60 px-2 py-0.5 rounded-full`}
                            >
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trophy at bottom */}
        <div className="trophy-node relative mt-10">
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Glow aura */}
              <div className="absolute -inset-3 rounded-full bg-linear-to-br from-amber-400/20 to-orange-500/20 blur-lg animate-pulse" />
              {/* Spinning golden ring */}
              <div
                className="absolute -inset-2 rounded-full animate-spin"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 40%, #fbbf2460, transparent 60%, #f59e0b40, transparent)",
                  animationDuration: "5s",
                }}
              />
              <div className="relative z-10 w-20 h-20 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center border-4 border-white shadow-xl">
                <span className="text-3xl drop-shadow-md">🏆</span>
              </div>
            </div>
          </div>
          <p className="text-center mt-4 text-sm font-bold bg-linear-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Sign Language Master!
          </p>
        </div>
      </div>
    </div>
  );
}
