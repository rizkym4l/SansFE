import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Camera,
  Trophy,
  UserCircle,
  Settings,
  BookOpen,
  Lock,
} from "lucide-react";

const sidebarLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, alwaysUnlocked: true },
  { to: "/levels", label: "Levels", icon: Map },
  { to: "/camera-challenge", label: "Test Camera", icon: Camera },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/profile", label: "Profile", icon: UserCircle, alwaysUnlocked: true },
  { to: "/settings", label: "Settings", icon: Settings, alwaysUnlocked: true },
];

export default function Sidebar({ locked = false }) {
  const location = useLocation();

  function renderLink({ to, label, icon: Icon, alwaysUnlocked }) {
    const active = location.pathname === to;
    const isLocked = locked && !alwaysUnlocked;

    const classes = `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      isLocked
        ? "text-gray-300 cursor-not-allowed opacity-60"
        : active
          ? "bg-orange-50 text-orange-500 shadow-sm"
          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
    }`;

    if (isLocked) {
      return (
        <div key={to} className={classes} title="Verify your email first">
          <Icon className="w-5 h-5" />
          {label}
          <Lock className="w-3.5 h-3.5 ml-auto" />
        </div>
      );
    }

    return (
      <Link key={to} to={to} className={classes}>
        <Icon className={`w-5 h-5 ${active ? "text-orange-500" : ""}`} />
        {label}
      </Link>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 fixed left-0 top-[57px] bottom-0 bg-white border-r-2 border-orange-100 z-40">
        <div className="flex-1 py-4 px-3 space-y-1">
          {sidebarLinks.map(renderLink)}
        </div>

        {/* Bottom decoration */}
        <div className="p-4 mx-3 mb-4 bg-linear-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-bold text-gray-800">Quick Tip</span>
          </div>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Practice daily to maintain your streak and earn bonus XP!
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-orange-100 z-50">
        <div className="flex items-center justify-around py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {sidebarLinks.map(({ to, label, icon: Icon, alwaysUnlocked }) => {
            const active = location.pathname === to;
            const isLocked = locked && !alwaysUnlocked;

            if (isLocked) {
              return (
                <div
                  key={to}
                  className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-gray-300 cursor-not-allowed"
                  title="Verify your email first"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-bold">{label}</span>
                </div>
              );
            }

            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
                  active ? "text-orange-500" : "text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
