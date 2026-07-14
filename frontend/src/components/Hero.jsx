import {
  ArrowRight,
  Upload,
  FileText,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Hero() {
  const navigate = useNavigate();

  const handleUpload = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    navigate("/dashboard");

  } catch (error) {

    localStorage.removeItem("token");

    navigate("/login");

  }
};

  const handleViewFeatures = () => {
    const section = document.getElementById("features");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-20 lg:flex-row lg:px-8">
        {/* LEFT */}
        <div className="flex-1">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            AI Powered Resume Analysis
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight lg:text-7xl">
            Build a
            <span className="text-blue-500"> Resume </span>
            Recruiters
            <br />
            Can't Ignore.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
            Upload your resume and receive an ATS score, skill analysis,
            missing keywords, AI suggestions and career recommendations
            powered by intelligent resume analysis.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-5">
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-semibold transition duration-300 hover:bg-blue-700 hover:scale-105"
            >
              <Upload size={18} />
              Upload Resume
            </button>

            <button
              onClick={handleViewFeatures}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-7 py-4 font-semibold transition duration-300 hover:border-blue-500 hover:bg-slate-900 hover:scale-105"
            >
              View Features
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur transition hover:scale-[1.02]">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                Resume Analysis
              </h3>

              <FileText className="text-blue-500" />
            </div>

            {/* ATS Score */}
            <div className="mb-6 rounded-2xl bg-slate-800 p-5">
              <div className="flex items-center justify-between">
                <span>ATS Score</span>

                <span className="font-bold text-green-400">
                  92%
                </span>
              </div>

              <div className="mt-4 h-3 rounded-full bg-slate-700">
                <div className="h-3 w-[92%] rounded-full bg-green-500" />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400" />
                React.js
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400" />
                Node.js
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400" />
                MongoDB
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="mt-8 rounded-2xl bg-blue-600/20 p-5">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-blue-400" />

                <div>
                  <h4 className="font-semibold">
                    AI Suggestion
                  </h4>

                  <p className="text-sm text-slate-300">
                    Add measurable achievements and improve keyword
                    matching to increase your ATS score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}