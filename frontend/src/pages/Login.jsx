
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const saveSession = (data) => {
    if (!data?.token) {
      throw new Error("Authentication token was not returned.");
    }

    if (!data?.user) {
      throw new Error("User information was not returned by the server.");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Notify components in this tab that user data has changed.
    window.dispatchEvent(new Event("resumeiq-user-updated"));
  };

  const handleLogin = async () => {
    if (loading) return;

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email: email.trim(),
          password,
        }
      );

      saveSession(res.data);

      toast.success("Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
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

      saveSession(res.data);

      toast.success("Google sign-in successful!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Google authentication failed:", err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
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
          Welcome Back 👋
        </h1>

        <p className="mt-3 text-slate-400">
          Sign in to continue using ResumeIQ.
        </p>

        <div className="mt-8">
          <label htmlFor="login-email" className="text-slate-300">
            Email
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
            <Mail size={18} className="text-slate-400" />

            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              placeholder="Enter email"
              className="w-full bg-transparent outline-none text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="login-password" className="text-slate-300">
            Password
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
            <Lock size={18} className="text-slate-400" />

            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              placeholder="Enter password"
              className="w-full bg-transparent outline-none text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mt-3 text-right">
          <Link
            to="/forgot-password"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="mt-7 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="flex justify-center items-center gap-2">
            {loading ? "Logging in..." : "Login"}
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
          Sign in securely using your Google account.
        </p>

        <div className="mt-8 text-center text-slate-400">
          Don't have an account?

          <Link
            to="/signup"
            className="ml-2 text-blue-400 hover:text-blue-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
