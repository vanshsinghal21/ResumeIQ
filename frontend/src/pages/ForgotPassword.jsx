import { useState } from "react";
import axios from "axios";
import { Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    if (loading) return;

    if (!email.trim()) {
      return toast.error("Please enter your email.");
    }

    setLoading(true);

    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          email,
        }
      );

      toast.success(res.data.message);

      navigate("/verify-reset-otp", {
        state: {
          email,
        },
      });

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Failed to send OTP"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex justify-center items-center">

      <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 w-[430px]">

        <h1 className="text-3xl font-bold text-center">
          Forgot Password
        </h1>

        <p className="text-slate-400 text-center mt-3">
          Enter your registered email.
        </p>

        <div className="mt-8 flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-4">

          <Mail className="text-slate-400" />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder:text-slate-400"
          />

        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold flex justify-center items-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >

          {loading ? "Sending OTP..." : "Send OTP"}

          {!loading && <ArrowRight size={18} />}

        </button>

      </div>

    </div>

  );

}