import { Link, useNavigate } from "react-router-dom";
import mascotVideo from "../assets/karakterVideo/mascot.mp4";
import useAuthStore from "../context/AuthContext";
import Logo from "../assets/logo/dreamina-2026-02-07-6658-Create a logo featuring only the face of....jpeg";
import Loading from "../components/common/Loading";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { showSuccess, showError, showWarning } from "../utils/alert";
export default function RegisterPage() {
  let { loading, register, initialize } = useAuthStore();
  const navigate = useNavigate();

  const {
    register: reg,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    initialize();
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await register(data);
      showSuccess("Account created!");
      navigate("/dashboard");
    } catch (err) {
      setIsLoading(false);

      showError(err.response?.data?.message || "Registration failed");
    }
  };

  return loading || isLoading ? (
    <Loading />
  ) : (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-cartoon">
      {/* Left Side - Mascot */}
      <div className="hidden lg:flex lg:w-1/2 bg-orange-50 items-center justify-center relative overflow-hidden">
        <div className="absolute z-30 top-0 left-12 mt-10 font-cartoon flex items-center font-extrabold text-4xl text-blue-500  border-orange-500">
          <img className="w-14 mr-2 rounded-full" src={Logo} alt="" />
          <b className="text-orange-500">S&S </b>signmaster
        </div>
        <div className="relative z-10 flex flex-col items-center px-12">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-80 h-80 object-contain rounded-3xl"
          >
            <source src={mascotVideo} type="video/mp4" />
          </video>
          <h2 className="text-3xl font-bold text-gray-800 mt-8 text-center">
            Start your journey
            <br />
            <span className="text-orange-500">today!</span>
          </h2>
          <p className="text-gray-400 mt-3 text-center max-w-sm font-medium">
            Join thousands learning sign language with AI
          </p>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-100 rounded-full opacity-60" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-amber-100 rounded-full opacity-60" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <h1 className="text-3xl font-bold text-orange-500 mb-1">Register</h1>
          <p className="text-gray-400 text-sm mb-10 font-medium">
            Create your free account
          </p>

          {/* Mobile mascot */}
          <div className="flex lg:hidden justify-center mb-8">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-40 h-40 object-contain rounded-2xl"
            >
              <source src={mascotVideo} type="video/mp4" />
            </video>
          </div>

          {/* Error Message */}
          {/* {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )} */}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div>
              <input
                {...reg("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Minimal 3 karakter" },
                })}
                placeholder="Username"
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                {...reg("email", {
                  required: "Email is required",
                  minLength: { value: 3, message: "Minimal 3 karakter" },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email tidak valid",
                  },
                })}
                placeholder="Email"
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                {...reg("password", {
                  required: "Password wajib diisi",
                  minLength: { value: 6, message: "Minimal 6 karakter" },
                })}
                type="password"
                placeholder="Password (min. 6 characters)"
                className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide uppercase hover:bg-orange-600 active:scale-[0.98] shadow-md shadow-orange-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-400 uppercase">
              or
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => showWarning('Google login coming soon')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed font-medium">
            By signing up, you agree to our{" "}
            <span className="text-orange-500 cursor-pointer hover:underline">
              Terms
            </span>{" "}
            and{" "}
            <span className="text-orange-500 cursor-pointer hover:underline">
              Privacy Policy
            </span>
          </p>

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-500 mt-6 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 font-bold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
