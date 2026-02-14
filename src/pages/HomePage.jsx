import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Hand, BookOpen, Camera, Trophy, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mascotChef from "../assets/home/mascot-chef.jpeg";
import mascotStudy from "../assets/home/mascot-study.jpeg";
import mascotPainter from "../assets/home/mascot-painter.jpeg";
import mascotGardener from "../assets/home/mascot-gardener.jpeg";
import pose1 from "../assets/pose/book.jpeg";
import pose2 from "../assets/pose/camera.jpeg";
import pose3 from "../assets/pose/kertas.jpeg";
import pose4 from "../assets/pose/level.jpeg";
import logo from "../assets/logo/dreamina-2026-02-07-6658-Create a logo featuring only the face of....jpeg";
gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Feature cards stagger in
      gsap.fromTo(
        ".feature-card",
        { y: 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.4)",
        },
      );

      // Feature heading
      gsap.fromTo(
        ".features-heading",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
      );

      // CTA section
      gsap.fromTo(
        ".cta-content",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
      );

      // Parallax on decorative circles
      gsap.utils.toArray(".deco-circle").forEach((circle) => {
        gsap.to(circle, {
          scrollTrigger: {
            trigger: circle,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          y: -80,
          ease: "none",
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white font-cartoon">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b-2 border-orange-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500 flex items-center">
            <img
              className="w-10 h-10   bg-blue-400 rounded-full"
              src={logo}
              alt=""
            />{" "}
            S&S <span className="text-blue-500">signmaster</span>
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600 active:scale-[0.98] transition shadow-md shadow-orange-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden pt-20">
        {/* Mascot - Top Left (Study) */}
        <img
          src={mascotStudy}
          alt="Mascot studying"
          className="absolute top-24 left-4 lg:left-12 w-28 md:w-40 lg:w-52 object-contain -rotate-6 hover:rotate-0 hover:scale-110 transition duration-500 animate-float-in-left [animation-delay:0.2s]"
        />

        {/* Mascot - Top Right (Chef) */}
        <img
          src={mascotChef}
          alt="Mascot chef"
          className="absolute top-28 right-4 lg:right-12 w-24 md:w-36 lg:w-44 object-contain rotate-6 hover:rotate-0 hover:scale-110 transition duration-500 animate-float-in-right [animation-delay:0.4s]"
        />

        {/* Mascot - Bottom Left (Painter) */}
        <img
          src={mascotPainter}
          alt="Mascot painting"
          className="absolute bottom-8 left-4 lg:left-16 w-32 md:w-44 lg:w-56 object-contain rotate-3 hover:rotate-0 hover:scale-110 transition duration-500 animate-float-in-left [animation-delay:0.6s]"
        />

        {/* Mascot - Bottom Right (Gardener) */}
        <img
          src={mascotGardener}
          alt="Mascot gardening"
          className="absolute bottom-12 right-4 lg:right-16 w-28 md:w-40 lg:w-48 object-contain -rotate-3 hover:rotate-0 hover:scale-110 transition duration-500 animate-float-in-right [animation-delay:0.8s]"
        />

        {/* Motivational Text - Center */}
        <div className="relative z-10 text-center px-6 max-w-2xl animate-fade-in-up [animation-delay:0.3s]">
          <p className="text-orange-400 font-bold text-lg mb-4 tracking-wide uppercase">
            Learn Sign Language with AI
          </p>
          <h2 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight mb-6">
            The free, fun &
            <br />
            <span className="text-orange-500">effective</span> way
            <br />
            to learn!
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-4 font-medium">
            Master hand gestures A-Z
          </p>
          <p className="text-lg text-gray-300 mb-10 max-w-md mx-auto">
            Practice anytime, anywhere with real-time camera detection
          </p>

          {/* Motivational bubbles */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="px-4 py-2 bg-orange-50 text-orange-500 rounded-full text-sm font-bold border-2 border-orange-200">
              You can do it!
            </span>
            <span className="px-4 py-2 bg-amber-50 text-amber-500 rounded-full text-sm font-bold border-2 border-amber-200">
              Keep going!
            </span>
            <span className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-full text-sm font-bold border-2 border-yellow-200">
              Level up today!
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-10 py-4 bg-orange-500 text-white text-lg font-bold rounded-2xl hover:bg-orange-600 active:scale-[0.97] transition shadow-lg shadow-orange-300/50 uppercase tracking-wide"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 bg-white text-orange-500 text-lg font-bold rounded-2xl border-3 border-orange-300 hover:bg-orange-50 active:scale-[0.97] transition uppercase tracking-wide"
            >
              I Have an Account
            </Link>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="deco-circle absolute top-32 right-10 w-20 h-20 bg-orange-100 rounded-full opacity-40" />
        <div className="deco-circle absolute top-60 left-16 w-12 h-12 bg-amber-100 rounded-full opacity-40" />
        <div className="deco-circle absolute bottom-40 right-20 w-16 h-16 bg-yellow-100 rounded-full opacity-30" />
        <div className="deco-circle absolute top-40 left-1/4 w-8 h-8 bg-orange-200 rounded-full opacity-20" />
        <div className="deco-circle absolute bottom-60 right-1/3 w-10 h-10 bg-amber-200 rounded-full opacity-20" />
      </section>

      {/* Wave: Hero → Features */}
      <div className="relative -mt-1">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
        >
          <path
            d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120Z"
            fill="#fff7ed"
          />
        </svg>
      </div>

      {/* Features Section */}
      <section ref={featuresRef} className="pb-24 pt-8 bg-orange-50/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="features-heading">
            <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
              Why <span className="text-orange-500">SignMaster</span>?
            </h3>
            <p className="text-center text-gray-400 mb-16 max-w-xl mx-auto font-medium">
              Everything you need to learn sign language, powered by AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<img src={pose1} alt="" />}
              title="Learn"
              description="Study each sign letter with clear visuals and step-by-step guidance"
              color="bg-orange-50 text-orange-500"
            />
            <FeatureCard
              icon={<img src={pose3} alt="" />}
              title="Practice"
              description="Test your knowledge with interactive exercises and instant feedback"
              color="bg-green-50 text-green-500"
            />
            <FeatureCard
              icon={<img src={pose2} alt="" />}
              title="Camera Challenge"
              description="Use your camera for real-time AI hand gesture detection and scoring"
              color="bg-purple-50 text-purple-500"
            />
            <FeatureCard
              icon={<img src={pose4} alt="" />}
              title="Level Up"
              description="Earn XP, unlock achievements, and compete on the leaderboard"
              color="bg-amber-50 text-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Wave: Features → CTA */}
      <div className="relative -mt-1">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
        >
          <path
            d="M0,32 C240,96 480,0 720,48 C960,96 1200,16 1440,48 L1440,120 L0,120Z"
            fill="#f97316"
          />
          <path
            d="M0,64 C320,20 640,100 960,40 C1120,16 1320,60 1440,48 L1440,120 L0,120Z"
            fill="#f97316"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* CTA Section */}
      <section ref={ctaRef} className="pb-24 pt-8 bg-orange-500">
        <div className="cta-content max-w-3xl mx-auto text-center px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start your journey?
          </h3>
          <p className="text-orange-100 text-lg mb-10 font-medium">
            Join thousands of learners mastering sign language with AI
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-500 text-lg font-bold rounded-2xl hover:bg-orange-50 active:scale-[0.98] transition"
          >
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-center">
        <p className="text-gray-500 text-sm">
          &copy; 2025 SignMaster. Built with AI for everyone.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="feature-card bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group border-2 border-gray-100">
      <div
        className={`w-full  rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition`}
      >
        {icon}
      </div>
      <h4 className="text-lg font-bold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
