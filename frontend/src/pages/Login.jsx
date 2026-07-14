import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      toast.success("Login Successful!");

      navigate("/dashboard");

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Login Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] top-10 left-10" />
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] bottom-10 right-10" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-10">

        <h1 className="text-4xl font-bold text-white">
          Welcome Back 👋
        </h1>

        <p className="mt-3 text-slate-400">
          Sign in to continue using ResumeIQ.
        </p>

        <div className="mt-10">

          <label className="text-slate-300">
            Email
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">

            <Mail size={18} className="text-slate-400"/>

            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full bg-transparent outline-none text-white placeholder:text-slate-400"
            />

          </div>

        </div>

        <div className="mt-6">

          <label className="text-slate-300">
            Password
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">

            <Lock size={18} className="text-slate-400"/>

            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
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
          onClick={handleLogin}
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >

          <span className="flex justify-center items-center gap-2">

            {loading ? "Logging in..." : "Login"}

            {!loading && <ArrowRight size={18}/>}

          </span>

        </button>

        <div className="mt-8 text-center text-slate-400">

          Don't have an account?

          <Link
            to="/signup"
            className="ml-2 text-blue-400"
          >
            Sign Up
          </Link>

        </div>

      </div>

    </div>
  );
}