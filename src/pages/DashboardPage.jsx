import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Camera,
  Hand,
  Trophy,
  Flame,
  Star,
  Zap,
  TrendingUp,
  ChevronRight,
  Clock,
  Target,
  CheckCircle,
} from "lucide-react";
import gsap from "gsap";
import useAuthStore from "../context/AuthContext";
import achievementService from "../services/achievementService";
import progressService from "../services/progressService";
import userService from "../services/userService";
import mascotStudy from "../assets/home/mascot-study.jpeg";
import mascotChef from "../assets/home/mascot-chef.jpeg";
import mascotPainter from "../assets/home/mascot-painter.jpeg";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const dashRef = useRef(null);

  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [lettersMastered, setLettersMastered] = useState([]);
  const [dailyActivity, setDailyActivity] = useState(null);

  const displayName =
    user?.profile?.displayName || user?.username || "Learner";
  const totalXP = user?.stats?.totalXP ?? 0;
  const currentLevel = user?.stats?.currentLevel ?? 1;
  const currentStreak = user?.stats?.currentStreak ?? 0;
  const longestStreak = user?.stats?.longestStreak ?? 0;

  // Fetch all dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [allAch, userAch, progressData, daily] = await Promise.all([
          achievementService.getAll().catch(() => ({ data: [] })),
          achievementService.getUserAchievements().catch(() => ({ data: [] })),
          progressService.getOverallProgress().catch(() => ({ data: [] })),
          userService.getDailyActivity().catch(() => ({ data: null })),
        ]);

        setAchievements(allAch.data || []);
        setUserAchievements(userAch.data || []);

        // Kumpulkan semua lettersMastered dari seluruh progress
        const progressList = Array.isArray(progressData.data) ? progressData.data : [];
        const allMastered = [...new Set(
          progressList.flatMap(
            (p) => p.detailedProgress?.lettersMastered || []
          )
        )];
        setLettersMastered(allMastered);

        setDailyActivity(daily.data || null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    }
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dash-welcome",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );

      gsap.fromTo(
        ".stat-card",
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.4)",
          delay: 0.2,
        }
      );

      gsap.fromTo(
        ".action-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.2)",
          delay: 0.5,
        }
      );

      gsap.fromTo(
        ".progress-section",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.8 }
      );

      gsap.to(".float-mascot", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, dashRef);

    return () => ctx.revert();
  }, []);

  const progressPercent = Math.min(((totalXP % 100) / 100) * 100, 100);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const learnedCount = lettersMastered.length;

  return (
    <div ref={dashRef} className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Welcome Section */}
      <div className="dash-welcome relative bg-linear-to-br from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden">
        <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/5 rounded-full" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <img
            src={mascotStudy}
            alt="Mascot"
            className="float-mascot w-28 sm:w-36 rounded-2xl border-4 border-white/30 shadow-lg"
          />
          <div className="text-center sm:text-left flex-1">
            <p className="text-orange-100 font-semibold text-sm mb-1">
              Welcome back,
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {displayName}!
            </h1>
            <p className="text-orange-100 font-medium text-base mb-4">
              Keep up the great work! You're doing amazing.
            </p>
            <div className="max-w-sm">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-white font-bold">
                  Level {currentLevel}
                </span>
                <span className="text-orange-100 font-semibold">
                  {totalXP % 100}/100 XP
                </span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Zap className="w-6 h-6" />}
          label="Total XP"
          value={totalXP}
          color="text-amber-500"
          bg="bg-amber-50"
          border="border-amber-200"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Level"
          value={currentLevel}
          color="text-blue-500"
          bg="bg-blue-50"
          border="border-blue-200"
        />
        <StatCard
          icon={<Flame className="w-6 h-6" />}
          label="Day Streak"
          value={currentStreak}
          color="text-orange-500"
          bg="bg-orange-50"
          border="border-orange-200"
        />
        <StatCard
          icon={<Trophy className="w-6 h-6" />}
          label="Best Streak"
          value={longestStreak}
          color="text-purple-500"
          bg="bg-purple-50"
          border="border-purple-200"
        />
      </div>

      {/* Today's Activity */}
      {dailyActivity && (
        <div className="progress-section bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-800">Today's Activity</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-800">
                {dailyActivity.lessonsCompleted ?? 0}
              </p>
              <p className="text-xs font-semibold text-gray-400">Lessons</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-800">
                {dailyActivity.xpEarned ?? 0}
              </p>
              <p className="text-xs font-semibold text-gray-400">XP Earned</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-gray-800">
                {Math.round((dailyActivity.timeSpent ?? 0) / 60)}m
              </p>
              <p className="text-xs font-semibold text-gray-400">Time</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Let's Learn!</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <ActionCard
          icon={<BookOpen className="w-8 h-8" />}
          title="Learn Signs"
          description="Study each letter A-Z with clear visuals and guidance"
          color="text-orange-500"
          bg="bg-linear-to-br from-orange-50 to-amber-50"
          border="border-orange-200"
          mascot={mascotStudy}
          to="/levels"
        />
        <ActionCard
          icon={<Hand className="w-8 h-8" />}
          title="Practice"
          description="Test yourself with interactive quizzes and exercises"
          color="text-green-500"
          bg="bg-linear-to-br from-green-50 to-emerald-50"
          border="border-green-200"
          mascot={mascotChef}
          to="/levels"
        />
        <ActionCard
          icon={<Camera className="w-8 h-8" />}
          title="Camera Challenge"
          description="Show your skills with real-time AI hand detection"
          color="text-purple-500"
          bg="bg-linear-to-br from-purple-50 to-violet-50"
          border="border-purple-200"
          mascot={mascotPainter}
          to="/camera-challenge"
        />
      </div>

      {/* Progress Section */}
      <div className="progress-section grid lg:grid-cols-2 gap-6 mb-8">
        {/* Alphabet Progress — dari data UserProgress.lettersMastered */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Alphabet Progress
            </h3>
            <span className="text-sm font-bold text-orange-500">
              {learnedCount}/26
            </span>
          </div>
          <div className="grid grid-cols-13 gap-1.5">
            {alphabet.map((letter) => (
              <div
                key={letter}
                className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  lettersMastered.includes(letter)
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-300"
                }`}
              >
                {letter}
              </div>
            ))}
          </div>
          <div className="mt-4 w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${(learnedCount / 26) * 100}%` }}
            />
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Achievements</h3>
            <Link
              to="/profile"
              className="text-xs font-bold text-orange-500 hover:text-orange-600 transition"
            >
              View All
            </Link>
          </div>

          {achievements.length === 0 ? (
            <p className="text-sm text-gray-300 font-medium text-center py-4">
              Loading achievements...
            </p>
          ) : (
            <div className="space-y-3">
              {achievements.slice(0, 4).map((ach) => {
                const unlocked = userAchievements.some(
                  (ua) => {
                    const achId = ua.achievementId?._id || ua.achievementId;
                    return String(achId) === String(ach._id) && ua.isCompleted;
                  }
                );

                return (
                  <div
                    key={ach._id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition ${
                      unlocked
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-gray-50 border border-gray-200 opacity-50"
                    }`}
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${unlocked ? "text-gray-800" : "text-gray-400"}`}>
                        {ach.name}
                      </p>
                      <p className="text-xs text-gray-400 font-medium truncate">
                        {ach.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-bold text-amber-500">
                        +{ach.rewards?.xp ?? 0}
                      </span>
                    </div>
                    {unlocked && (
                      <span className="text-xs font-bold text-green-500">
                        Done!
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bg, border }) {
  return (
    <div
      className={`stat-card ${bg} border-2 ${border} rounded-2xl p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
    >
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm font-semibold text-gray-400">{label}</p>
    </div>
  );
}

function ActionCard({ icon, title, description, color, bg, border, mascot, to }) {
  return (
    <Link
      to={to}
      className={`action-card group ${bg} border-2 ${border} rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden block`}
    >
      <img
        src={mascot}
        alt=""
        className="absolute -bottom-2 -right-2 w-20 h-20 object-cover rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
      />
      <div className="relative z-10">
        <div
          className={`${color} w-14 h-14 rounded-xl flex items-center justify-center bg-white/80 mb-4 group-hover:scale-110 transition`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          {title}
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
        </h3>
        <p className="text-sm text-gray-400 font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
