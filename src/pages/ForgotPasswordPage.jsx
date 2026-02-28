import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import mascotVideo from "../assets/karakterVideo/mascot.mp4";
import logo from "../assets/logo/dreamina-2026-02-07-6658-Create a logo featuring only the face of....jpeg";
import authService from "../services/authService";
import { showError } from "../utils/alert";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("form"); // 'form' | 'sent'
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setStep("sent");
    } catch {
      showError("Gagal mengirim email, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-cartoon">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-orange-50 items-center justify-center relative overflow-hidden">
        <div className="absolute z-30 top-0 left-12 mt-10 font-cartoon flex items-center font-extrabold text-4xl text-blue-500 border-orange-500">
          <img className="w-14 mr-2 rounded-full" src={logo} alt="" />
          <b className="text-orange-500">S&S </b>signmaster
        </div>
        <div className="relative z-10 flex flex-col items-center px-12">
          <video autoPlay muted loop playsInline className="w-80 h-80 object-contain rounded-3xl">
            <source src={mascotVideo} type="video/mp4" />
          </video>
          <h2 className="text-3xl font-bold text-gray-800 mt-8 text-center">
            No worries!<br />
            <span className="text-orange-500">We got you covered</span>
          </h2>
          <p className="text-gray-400 mt-3 text-center max-w-sm font-medium">
            Enter your email and we'll send you a reset token
          </p>
        </div>
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-100 rounded-full opacity-60" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-amber-100 rounded-full opacity-60" />
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {step === "form" ? (
            <>
              <h1 className="text-3xl font-bold text-orange-500 mb-1">
                Forgot <b className="text-blue-500">Password?</b>
              </h1>
              <p className="text-gray-400 text-sm mb-10 font-medium">
                Enter your email to receive a reset token
              </p>

              <div className="flex lg:hidden justify-center mb-8">
                <video autoPlay muted loop playsInline className="w-40 h-40 object-contain rounded-2xl">
                  <source src={mascotVideo} type="video/mp4" />
                </video>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("email", {
                        required: "Email wajib diisi",
                        pattern: { value: /^\S+@\S+$/i, message: "Email tidak valid" },
                      })}
                      type="email"
                      placeholder="Email"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Token"
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-8 font-medium">
                Already have a token?{" "}
                <Link to="/reset-password" className="text-orange-500 font-bold hover:underline">
                  Reset Password
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Check your email!</h1>
              <p className="text-gray-400 text-sm font-medium mb-8">
                We sent a reset token to your email. Copy the token and use it to reset your password.
              </p>
              <Link
                to="/reset-password"
                className="w-full bg-orange-500 text-white py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide uppercase hover:bg-orange-600 shadow-md shadow-orange-200 transition inline-block"
              >
                Enter Reset Token
              </Link>
              <button
                onClick={() => setStep("form")}
                className="w-full mt-3 text-gray-400 py-3 text-sm font-semibold hover:text-gray-600 transition"
              >
                Try different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
