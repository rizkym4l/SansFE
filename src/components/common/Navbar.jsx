import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Flame, User, LogOut, UserCircle, ChevronDown } from "lucide-react";
import useAuthStore from "../../context/AuthContext";
import logo from "../../assets/logo/dreamina-2026-02-07-6658-Create a logo featuring only the face of....jpeg";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
console.log('user', user)
  const displayName =
    user?.profile?.displayName || user?.username || "Learner";
  const totalXP = user?.stats?.totalXP ?? 0;
  const currentStreak = user?.stats?.currentStreak ?? 0;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b-2 border-orange-100">
      <div className="max-w-full mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            className="w-9 h-9 bg-blue-400 rounded-full"
            src={logo}
            alt="SignMaster Logo"
          />
          <span className="text-xl font-bold text-orange-500 hidden sm:inline">
            S&S <span className="text-blue-500">signmaster</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* XP Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-600">
              {totalXP} XP
            </span>
          </div>

          {/* Streak Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-200">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-600">
              {currentStreak}
            </span>
          </div>

          {/* Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-3 border-l-2 border-gray-100 cursor-pointer hover:opacity-80 transition"
            >
              <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center ring-2 ring-orange-200">
                <User className="w-5 h-5 text-orange-500" />
              </div>
              <span className="hidden md:block text-sm font-semibold text-gray-700 max-w-30 truncate">
                {displayName}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border-2 border-gray-100 py-2 animate-fade-in-up">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email || ""}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition"
                  >
                    <UserCircle className="w-4 h-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
