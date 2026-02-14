import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Camera,
  Trophy,
  UserCircle,
  Settings,
  BookOpen,
} from "lucide-react";

const sidebarLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/levels", label: "Levels", icon: Map },
  { to: "/camera-challenge", label: "Test Camera", icon: Camera },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/profile", label: "Profile", icon: UserCircle },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 fixed left-0 top-[57px] bottom-0 bg-white border-r-2 border-orange-100 z-40">
        <div className="flex-1 py-4 px-3 space-y-1">
          {sidebarLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-orange-50 text-orange-500 shadow-sm"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-orange-500" : ""}`} />
                {label}
              </Link>
            );
          })}
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
          {sidebarLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
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
