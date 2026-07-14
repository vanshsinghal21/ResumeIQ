import { generatePDF } from "../utils/pdfGenerator";
import { Download } from "lucide-react";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Brain,
  Star,
  Loader2,
} from "lucide-react";

export default function AIInsights() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/resume/analysis/${id}`,
          {
          headers: {
         Authorization: `Bearer ${token}`,
        },
      }
    );

      setResume(response.data.resume);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-500" size={50} />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center mt-20 text-red-400">
        Failed to load AI Analysis.
      </div>
    );
  }

  const score = resume.score || 0;

  const circle = 427;
  const offset = circle - (circle * score) / 100;

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          AI Resume Analysis
        </h1>

        <p className="text-slate-400 mt-2">
          AI generated insights for your resume.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center">

          <div className="relative w-40 h-40">

            <svg className="w-40 h-40 -rotate-90">

              <circle
                cx="80"
                cy="80"
                r="68"
                stroke="#334155"
                strokeWidth="12"
                fill="none"
              />

              <circle
                cx="80"
                cy="80"
                r="68"
                stroke="#2563eb"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circle}
                strokeDashoffset={offset}
                fill="none"
              />

            </svg>

            <div className="absolute inset-0 flex flex-col justify-center items-center">

              <h1 className="text-5xl font-bold">
                {score}
              </h1>

              <span className="text-slate-400">
                ATS
              </span>

            </div>

          </div>

          <p className="mt-6 text-center">
            {resume.summary}
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex items-center gap-3">

            <Star className="text-yellow-400" />

            <h2 className="text-2xl font-semibold">
              AI Summary
            </h2>

          </div>

          <p className="mt-6 text-slate-300 leading-8">
            {resume.summary}
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex items-center gap-3">

            <Brain className="text-purple-500" />

            <h2 className="text-2xl font-semibold">
              Resume Score
            </h2>

          </div>

          <h1 className="text-6xl font-bold mt-8">
            {score}%
          </h1>

          <div className="w-full bg-slate-700 rounded-full h-3 mt-6">

            <div
              className="bg-purple-500 h-3 rounded-full"
              style={{
                width: `${score}%`,
              }}
            />

          </div>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Strengths
          </h2>

          <div className="space-y-4">

            {resume.strengths.map((item, index) => (

              <div
                key={index}
                className="flex items-center gap-3"
              >

                <CheckCircle className="text-green-500" />

                <span>{item}</span>

              </div>

            ))}

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Missing Skills
          </h2>

          <div className="space-y-4">

            {resume.missingSkills.map((item, index) => (

              <div
                key={index}
                className="flex items-center gap-3"
              >

                <XCircle className="text-red-500" />

                <span>{item}</span>

              </div>

            ))}

          </div>

        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h2 className="text-2xl font-bold mb-6">
          Weaknesses
        </h2>

        <div className="space-y-4">

          {resume.weaknesses.map((item, index) => (

            <div
              key={index}
              className="flex items-center gap-3"
            >

              <XCircle className="text-yellow-500" />

              <span>{item}</span>

            </div>

          ))}

        </div>

      </div>

      <div>

        <h2 className="text-2xl font-bold mb-6">
          AI Recommendations
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {resume.suggestions.map((item, index) => (

            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >

              <h3 className="text-xl font-semibold mb-4">
                💡 Recommendation {index + 1}
              </h3>

              <p className="text-slate-400">
                {item}
              </p>

            </div>

          ))}

        </div>

      </div>

      <div className="flex gap-4">

  <button
    onClick={() => generatePDF(resume)}
    className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl flex items-center gap-2"
  >
    <Download size={18} />
    Download Report
  </button>

  <button
    onClick={() => navigate("/documents")}
    className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl"
  >
    Back to Documents
  </button>

</div>

    </div>
  );
}