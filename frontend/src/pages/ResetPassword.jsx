import { useState } from "react";
import axios from "axios";
import { Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {

    if (loading) return;

    if (!password.trim() || !confirmPassword.trim()) {
      return toast.error("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          email,
          password,
        }
      );

      toast.success(res.data.message);

      navigate("/login");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Password Reset Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-950 flex justify-center items-center">

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 w-[430px]">

        <h1 className="text-3xl font-bold text-center">
          Reset Password
        </h1>

        <p className="text-slate-400 text-center mt-3">
          Enter your new password.
        </p>

        <div className="mt-8 flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-4">

          <Lock className="text-slate-400" />

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder:text-slate-400"
          />

        </div>

        <div className="mt-5 flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-4">

          <Lock className="text-slate-400" />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder:text-slate-400"
          />

        </div>

        <button
          onClick={handleReset}
          disabled={loading}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Updating Password..." : "Reset Password"}
        </button>

      </div>

    </div>

  );

}