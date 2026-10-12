
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (loading) return;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          name: name.trim(),
          email: email.trim(),
          password,
        }
      );

      toast.success("OTP sent successfully!");

      navigate("/verify-otp", {
        state: {
          email: email.trim(),
          name: name.trim(),
          password,
        },
      });
    } catch (err) {
      console.error("Signup failed:", err);

      toast.error(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        { credential }
      );

      if (!res.data?.token) {
        throw new Error("Authentication token was not returned.");
      }

      localStorage.setItem("token", res.data.token);

      toast.success("Google sign-in successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google authentication failed:", err);

      toast.error(
        err.response?.data?.message ||
          "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-10 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] top-10 left-10 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] bottom-10 right-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10">
        <h1 className="text-4xl font-bold text-white">
          Create Account 🚀
        </h1>

        <p className="mt-3 text-slate-400">
          Join ResumeIQ and improve your resume with AI.
        </p>

        <div className="mt-7">
          <label htmlFor="signup-name" className="text-slate-300">
            Full Name
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
            <User size={18} className="text-slate-400" />

            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-transparent outline-none text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="signup-email" className="text-slate-300">
            Email
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
            <Mail size={18} className="text-slate-400" />

            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full bg-transparent outline-none text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="signup-password" className="text-slate-300">
            Password
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
            <Lock size={18} className="text-slate-400" />

            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full bg-transparent outline-none text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="signup-confirm-password" className="text-slate-300">
            Confirm Password
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
            <Lock size={18} className="text-slate-400" />

            <input
              id="signup-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSignup();
              }}
              placeholder="Confirm password"
              className="w-full bg-transparent outline-none text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignup}
          disabled={loading}
          className="mt-7 w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="flex justify-center items-center gap-2">
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <ArrowRight size={18} />}
          </span>
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-sm text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          disabled={loading}
        />

        <p className="mt-3 text-center text-xs text-slate-500">
          Create an account quickly with Google.
        </p>

        <div className="mt-8 text-center text-slate-400">
          Already have an account?

          <Link
            to="/login"
            className="ml-2 text-blue-400 hover:text-blue-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
