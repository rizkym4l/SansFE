import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import useAuthStore from "../../context/AuthContext";
import { MailCheck, X, Loader } from "lucide-react";
import { showSuccess, showError } from "../../utils/alert";

export default function AuthLayout() {
  const { user, verifyEmail } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const isVerified = user?.isVerified ?? true; // fallback true supaya user lama tidak kena lock

  async function handleVerify() {
    if (!token.trim()) return;
    try {
      setLoading(true);
      await verifyEmail(token.trim());
      showSuccess("Email berhasil diverifikasi!");
      setShowModal(false);
      setToken("");
    } catch {
      showError("Token tidak valid atau sudah kadaluarsa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50/40 font-cartoon">
      <Navbar />
      <Sidebar locked={!isVerified} />

      {/* Email verification banner */}
      {!isVerified && (
        <div className="md:ml-60 bg-amber-50 border-b-2 border-amber-200 px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MailCheck className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-sm font-semibold text-amber-700">
              Verifikasi emailmu untuk mengakses semua fitur.{" "}
              <span className="text-amber-500">Cek inbox kamu untuk token verifikasi.</span>
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-amber-600 transition cursor-pointer"
          >
            Verify Now
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="md:ml-60 min-h-[calc(100vh-57px)] pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Verify Email Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <MailCheck className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Verify Email</h2>
              </div>
              <button
                onClick={() => { setShowModal(false); setToken(""); }}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-400 font-medium mb-4">
              Paste token dari email verifikasi yang kami kirimkan saat kamu mendaftar.
            </p>

            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste verification token here"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-800 focus:border-amber-400 focus:outline-none transition mb-4"
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            />

            <button
              onClick={handleVerify}
              disabled={loading || !token.trim()}
              className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
