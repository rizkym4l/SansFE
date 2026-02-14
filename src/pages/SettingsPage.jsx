import { useEffect, useRef, useState } from "react";
import {
  Globe,
  Volume2,
  Bell,
  Save,
  User,
  FileText,
} from "lucide-react";
import gsap from "gsap";
import useAuthStore from "../context/AuthContext";
import userService from "../services/userService";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const pageRef = useRef(null);

  // Profile fields — disimpan ke backend via PUT /users/profile
  const [displayName, setDisplayName] = useState(user?.profile?.displayName || "");
  const [bio, setBio] = useState(user?.profile?.bio || "");

  // Preferences — disimpan ke localStorage (backend belum ada endpoint settings)
  const savedPrefs = JSON.parse(localStorage.getItem("signmaster_prefs") || "{}");
  const [language, setLanguage] = useState(savedPrefs.language || user?.settings?.language || "id");
  const [soundEnabled, setSoundEnabled] = useState(savedPrefs.soundEnabled ?? user?.settings?.soundEnabled ?? true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(savedPrefs.notificationsEnabled ?? user?.settings?.notificationsEnabled ?? true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".settings-header",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );

      gsap.fromTo(
        ".settings-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(1.2)",
          delay: 0.2,
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      // 1. Save profile ke backend (PUT /users/profile)
      const updatedData = await userService.updateProfile({ displayName, bio });

      // Update user di Zustand store + localStorage
      if (updatedData.data) {
        setUser(updatedData.data);
        localStorage.setItem("user", JSON.stringify(updatedData.data));
      }

      // 2. Save preferences ke localStorage (belum ada backend endpoint)
      localStorage.setItem("signmaster_prefs", JSON.stringify({
        language,
        soundEnabled,
        notificationsEnabled,
      }));

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="settings-header mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-400 font-medium">
          Customize your profile and learning experience
        </p>
      </div>

      {/* Profile */}
      <div className="settings-card bg-white rounded-2xl border-2 border-gray-100 shadow-sm mb-4">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">Profile</h2>
              <p className="text-xs text-gray-400 font-medium">
                Update your display name and bio
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-800 focus:border-orange-300 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-800 focus:border-orange-300 focus:outline-none transition resize-none"
            />
            <p className="text-[10px] font-medium text-gray-300 mt-1 text-right">
              {bio.length}/200
            </p>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="settings-card bg-white rounded-2xl border-2 border-gray-100 shadow-sm mb-4">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">Language</h2>
              <p className="text-xs text-gray-400 font-medium">
                Choose your preferred language
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 flex gap-3">
          <button
            onClick={() => setLanguage("id")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              language === "id"
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-50 text-gray-400 border-2 border-gray-200 hover:border-orange-200"
            }`}
          >
            Bahasa Indonesia
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              language === "en"
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-50 text-gray-400 border-2 border-gray-200 hover:border-orange-200"
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Sound */}
      <div className="settings-card bg-white rounded-2xl border-2 border-gray-100 shadow-sm mb-4">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-800">Sound Effects</h2>
                <p className="text-xs text-gray-400 font-medium">
                  Play sounds for correct/wrong answers
                </p>
              </div>
            </div>
            <Toggle
              enabled={soundEnabled}
              onChange={() => setSoundEnabled(!soundEnabled)}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-card bg-white rounded-2xl border-2 border-gray-100 shadow-sm mb-8">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-800">Notifications</h2>
                <p className="text-xs text-gray-400 font-medium">
                  Daily reminders to keep your streak
                </p>
              </div>
            </div>
            <Toggle
              enabled={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-4 rounded-2xl text-base font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
          saved
            ? "bg-green-500 text-white"
            : saving
              ? "bg-orange-300 text-white cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl"
        }`}
      >
        {saved ? (
          <>
            <Save className="w-5 h-5" />
            Saved!
          </>
        ) : saving ? (
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Saving...
          </span>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Settings
          </>
        )}
      </button>
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-all cursor-pointer ${
        enabled ? "bg-orange-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
          enabled ? "left-5.5" : "left-0.5"
        }`}
      />
    </button>
  );
}
