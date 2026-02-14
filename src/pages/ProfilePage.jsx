import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Trophy,
  Flame,
  Star,
  Zap,
  TrendingUp,
  Edit3,
  Settings,
  Shield,
} from "lucide-react";
import gsap from "gsap";
import useAuthStore from "../context/AuthContext";
import achievementService from "../services/achievementService";
import userService from "../services/userService";
import mascotChef from "../assets/home/mascot-chef.jpeg";
import { showConfirm } from "../utils/alert";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const displayName = user?.profile?.displayName || user?.username || "Learner";
  const email = user?.email || "";
  const bio =
    user?.profile?.bio || "Learning sign language one gesture at a time!";
  const totalXP = user?.stats?.totalXP ?? 0;
  const currentLevel = user?.stats?.currentLevel ?? 1;
  const currentStreak = user?.stats?.currentStreak ?? 0;
  const longestStreak = user?.stats?.longestStreak ?? 0;

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const [allData, userData] = await Promise.all([
          achievementService.getAll(),
          achievementService.getUserAchievements(),
        ]);
        setAchievements(allData.data || []);
        setUserAchievements(userData.data || []);
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
      }
    }
    fetchAchievements();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".profile-header",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      );

      gsap.fromTo(
        ".profile-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.2)",
          delay: 0.2,
        },
      );

      gsap.to(".float-mascot-profile", {
        y: -8,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  async function handleDeleteAccount() {
    const real = await showConfirm("Sure", "you want to delete this account?");
    if (!real) return;
    setDeleting(true);
    try {
      await userService.deleteAccount();
      logout();
      navigate("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
      setDeleting(false);
    }
  }

  const statsItems = [
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Total XP",
      value: totalXP,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Level",
      value: currentLevel,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: <Flame className="w-5 h-5" />,
      label: "Current Streak",
      value: `${currentStreak} days`,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: "Best Streak",
      value: `${longestStreak} days`,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div ref={pageRef} className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Profile Header Card */}
      <div className="profile-header relative bg-linear-to-br from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 mb-6 overflow-hidden">
        <div className="absolute top-4 right-4 w-28 h-28 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-white/5 rounded-full" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/40">
              <User className="w-12 h-12 text-white" />
            </div>
            <Link
              to="/settings"
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
            >
              <Edit3 className="w-4 h-4 text-orange-500" />
            </Link>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {displayName}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-orange-100 mb-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">{email}</span>
            </div>
            <p className="text-orange-100/80 text-sm font-medium max-w-sm">
              {bio}
            </p>
          </div>

          {/* Mascot */}
          <img
            src={mascotChef}
            alt="Mascot"
            className="float-mascot-profile hidden sm:block w-24 rounded-2xl border-3 border-white/30 shadow-lg"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="profile-card grid grid-cols-2 gap-4 mb-6">
        {statsItems.map((item) => (
          <div
            key={item.label}
            className={`${item.bg} rounded-2xl p-4 border-2 border-gray-100`}
          >
            <div className={`${item.color} mb-1.5`}>{item.icon}</div>
            <p className="text-xl font-bold text-gray-800">{item.value}</p>
            <p className="text-xs font-semibold text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Account Info */}
      <div className="profile-card bg-white rounded-2xl border-2 border-gray-100 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Account</h2>
          <Link
            to="/settings"
            className="flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition"
          >
            <Settings className="w-3.5 h-3.5" />
            Edit Settings
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          <SettingRow
            icon={<User className="w-5 h-5 text-orange-500" />}
            label="Display Name"
            value={displayName}
          />
          <SettingRow
            icon={<Mail className="w-5 h-5 text-blue-500" />}
            label="Email"
            value={email}
          />
        </div>
      </div>

      {/* Achievements */}
      <div className="profile-card bg-white rounded-2xl border-2 border-gray-100 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Achievements</h2>
            {achievements.length > 0 && (
              <span className="text-xs font-bold text-orange-500">
                {userAchievements.length}/{achievements.length}
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          {achievements.length === 0 ? (
            <p className="text-sm text-gray-300 font-medium text-center py-4">
              Loading achievements...
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {achievements.map((ach) => {
                const unlocked = userAchievements.some(
                  (ua) => ua.achievementId === ach._id || ua._id === ach._id,
                );
                return (
                  <AchievementBadge
                    key={ach._id}
                    emoji={ach.icon}
                    label={ach.name}
                    description={ach.description}
                    rarity={ach.rarity}
                    xp={ach.rewards?.xp}
                    unlocked={unlocked}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="profile-card bg-white rounded-2xl border-2 border-red-100 shadow-sm">
        <div className="px-6 py-4 border-b border-red-100">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold text-gray-800">Danger Zone</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-400 font-medium mb-4">
            Once you delete your account, there is no going back.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="px-5 py-2.5 text-sm font-bold text-red-500 border-2 border-red-200 rounded-xl hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xs font-semibold text-gray-400">{label}</p>
          <p className="text-sm font-bold text-gray-700">{value}</p>
        </div>
      </div>
    </div>
  );
}

const rarityColors = {
  common: "border-gray-300",
  rare: "border-blue-300",
  epic: "border-purple-300",
  legendary: "border-amber-400",
};

function AchievementBadge({ emoji, label, description, rarity, xp, unlocked }) {
  const borderColor = unlocked
    ? rarityColors[rarity] || "border-amber-200"
    : "border-gray-200";

  return (
    <div
      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition ${
        unlocked
          ? `bg-amber-50 border-2 ${borderColor}`
          : "bg-gray-50 border-2 border-gray-200 opacity-40 grayscale"
      }`}
      title={description || label}
    >
      <span className="text-2xl">{emoji}</span>
      <span
        className={`text-[10px] font-bold text-center leading-tight ${
          unlocked ? "text-gray-700" : "text-gray-400"
        }`}
      >
        {label}
      </span>
      {unlocked && xp > 0 && (
        <span className="text-[9px] font-bold text-amber-500">+{xp} XP</span>
      )}
    </div>
  );
}
