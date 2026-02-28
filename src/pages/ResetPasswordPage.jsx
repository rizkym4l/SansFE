import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import mascotVideo from "../assets/karakterVideo/mascot.mp4";
import logo from "../assets/logo/dreamina-2026-02-07-6658-Create a logo featuring only the face of....jpeg";
import authService from "../services/authService";
import { showSuccess, showError } from "../utils/alert";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  const onSubmit = async ({ token, newPassword }) => {
    try {
      setLoading(true);
      await authService.resetPassword(token, newPassword);
      showSuccess("Password berhasil direset!");
      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || "Token tidak valid atau sudah kadaluarsa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-cartoon">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-orange-50 items-center justify-center relative overflow-hidden">
        <div className="absolute z-30 top-0 left-12 mt-10 font-cartoon flex items-center font-extrabold text-4xl text-blue-500">
          <img className="w-14 mr-2 rounded-full" src={logo} alt="" />
          <b className="text-orange-500">S&S </b>signmaster
        </div>
        <div className="relative z-10 flex flex-col items-center px-12">
          <video autoPlay muted loop playsInline className="w-80 h-80 object-contain rounded-3xl">
            <source src={mascotVideo} type="video/mp4" />
          </video>
          <h2 className="text-3xl font-bold text-gray-800 mt-8 text-center">
            Set a new<br />
            <span className="text-orange-500">password</span>
          </h2>
          <p className="text-gray-400 mt-3 text-center max-w-sm font-medium">
            Paste the token from your email and create a new password
          </p>
        </div>
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-100 rounded-full opacity-60" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-amber-100 rounded-full opacity-60" />
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <h1 className="text-3xl font-bold text-orange-500 mb-1">
            Reset <b className="text-blue-500">Password</b>
          </h1>
          <p className="text-gray-400 text-sm mb-10 font-medium">
            Paste the token from your email and set a new password
          </p>

          <div className="flex lg:hidden justify-center mb-8">
            <video autoPlay muted loop playsInline className="w-40 h-40 object-contain rounded-2xl">
              <source src={mascotVideo} type="video/mp4" />
            </video>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Token */}
            <div>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register("token", { required: "Token wajib diisi" })}
                  type="text"
                  placeholder="Reset token from email"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition"
                />
              </div>
              {errors.token && (
                <p className="text-red-500 text-xs mt-1">{errors.token.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <div className="relative">
                <input
                  {...register("newPassword", {
                    required: "Password wajib diisi",
                    minLength: { value: 6, message: "Minimal 6 karakter" },
                  })}
                  type={showPass ? "text" : "password"}
                  placeholder="New password"
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <input
                  {...register("confirmPassword", {
                    required: "Konfirmasi password wajib diisi",
                    validate: (v) => v === newPassword || "Password tidak sama",
                  })}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide uppercase hover:bg-orange-600 active:scale-[0.98] shadow-md shadow-orange-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8 font-medium">
            Remembered your password?{" "}
            <Link to="/login" className="text-orange-500 font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
