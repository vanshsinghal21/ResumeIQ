import { useState, useEffect } from "react";
import axios from "axios";
import { ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyOTP() {

  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);

  const email = location.state?.email;

  useEffect(() => {

    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  const handleVerify = async () => {

    if (loading) return;

    if (!otp.trim()) {
      return toast.error("Please enter OTP");
    }

    setLoading(true);

    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          email,
          otp,
        }
      );

      toast.success(res.data.message);

      navigate("/login");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "OTP Verification Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  const handleResendOTP = async () => {

    if (resending) return;

    try {

      setResending(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/resend-otp`,
        {
          email,
        }
      );

      toast.success(res.data.message);

      setTimer(60);

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Failed to resend OTP"
      );

    } finally {

      setResending(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex justify-center items-center">

      <div className="bg-slate-900 rounded-3xl p-10 w-[420px] border border-slate-800">

        <div className="flex justify-center mb-6">

          <ShieldCheck
            size={60}
            className="text-blue-500"
          />

        </div>

        <h1 className="text-3xl font-bold text-center">
          Verify OTP
        </h1>

        <p className="text-slate-400 text-center mt-3">
          Enter the OTP sent to
        </p>

        <p className="text-blue-400 text-center mb-8">
          {email}
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full bg-slate-800 rounded-xl px-5 py-4 outline-none text-white placeholder:text-slate-400 mb-6"
        />

        <div className="text-center mb-6">

          {timer > 0 ? (

            <p className="text-slate-400">

              Resend OTP in

              <span className="text-blue-400 font-semibold">
                {" "}
                {timer}s
              </span>

            </p>

          ) : (

            <button
              onClick={handleResendOTP}
              disabled={resending}
              className="text-blue-500 hover:text-blue-400 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>

          )}

        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </div>

    </div>

  );

}