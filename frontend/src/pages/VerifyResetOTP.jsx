import { useState } from "react";
import axios from "axios";
import { ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyResetOTP() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {

    if (loading) return;

    if (!otp.trim()) {
      return toast.error("Please enter OTP");
    }

    setLoading(true);

    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-reset-otp`,
        {
          email,
          otp,
        }
      );

      toast.success(res.data.message);

      navigate("/reset-password", {
        state: { email },
      });

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "OTP Verification Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex justify-center items-center">

      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-10 w-[420px]">

        <div className="flex justify-center">

          <ShieldCheck
            size={60}
            className="text-blue-500"
          />

        </div>

        <h1 className="text-3xl font-bold text-center mt-6">
          Verify OTP
        </h1>

        <p className="text-slate-400 text-center mt-3">
          Enter the OTP sent to your registered email.
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="mt-8 w-full bg-slate-800 rounded-xl px-5 py-4 outline-none text-white placeholder:text-slate-400"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
        >

          {loading ? "Verifying..." : "Verify OTP"}

        </button>

      </div>

    </div>

  );

}