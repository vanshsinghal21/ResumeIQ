import {
  LayoutDashboard,
  History,
  User,
  Upload,
  BrainCircuit,
  FileCheck,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Card from "./ui/Card";
import ProgressBar from "./ui/ProgressBar";
import SectionHeading from "./ui/SectionHeading";

export default function DashboardPreview() {
  const navigate = useNavigate();

  const handleDashboard = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section
      id="dashboard"
      className="py-28 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6">

        <SectionHeading
          badge="PREVIEW"
          title="Dashboard Preview"
          subtitle="See how ResumeIQ helps you upload resumes, analyze ATS scores and receive AI-powered career insights."
        />

        <div className="mb-8 text-center">
          <p className="text-slate-400 max-w-3xl mx-auto">
            This is a preview of the ResumeIQ dashboard.
            Sign in to upload your own resume and access your personalized
            ATS score, AI analysis and document library.
          </p>
        </div>

        <Card className="p-0 overflow-hidden">

          <div className="grid lg:grid-cols-4">

            {/* Sidebar */}

            <div className="border-r border-slate-800 bg-slate-950 p-8">

              <h3 className="text-2xl font-bold mb-8">
                ResumeIQ
              </h3>

              <div className="space-y-5">

                <div className="flex items-center gap-3 text-blue-400">
                  <LayoutDashboard size={20} />
                  Dashboard
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                  <Upload size={20} />
                  Upload
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                  <History size={20} />
                  Activity
                </div>

                <div className="flex items-center gap-3 text-slate-400">
                  <User size={20} />
                  Profile
                </div>

              </div>

            </div>

            {/* Main */}

            <div className="lg:col-span-3 p-8">

              <h2 className="text-3xl font-bold mb-10">
                Resume Dashboard
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <Card>

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-slate-400">
                        ATS Score
                      </p>

                      <h2 className="text-5xl font-bold mt-2">
                        92%
                      </h2>

                    </div>

                    <FileCheck
                      size={42}
                      className="text-green-400"
                    />

                  </div>

                  <ProgressBar value={92} />

                </Card>

                <Card>

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-slate-400">
                        Resume Status
                      </p>

                      <h3 className="text-2xl font-bold mt-2">
                        Ready to Analyze
                      </h3>

                    </div>

                    <Upload
                      size={42}
                      className="text-blue-500"
                    />

                  </div>

                </Card>

              </div>

              {/* Skills */}

              <Card className="mt-6">

                <div className="flex items-center gap-3 mb-8">

                  <BrainCircuit className="text-blue-500" />

                  <h3 className="text-2xl font-bold">
                    Skills Analysis
                  </h3>

                </div>

                <div className="space-y-6">

                  <div>

                    <div className="flex justify-between">

                      <span>React.js</span>

                      <span>95%</span>

                    </div>

                    <ProgressBar value={95} />

                  </div>

                  <div>

                    <div className="flex justify-between">

                      <span>Node.js</span>

                      <span>82%</span>

                    </div>

                    <ProgressBar
                      value={82}
                      color="bg-blue-500"
                    />

                  </div>

                  <div>

                    <div className="flex justify-between">

                      <span>Python</span>

                      <span>88%</span>

                    </div>

                    <ProgressBar
                      value={88}
                      color="bg-purple-500"
                    />

                  </div>

                </div>

              </Card>

              {/* AI Suggestions */}

              <Card className="mt-6">

                <div className="flex items-center gap-3 mb-6">

                  <TrendingUp className="text-green-400" />

                  <h3 className="text-2xl font-bold">
                    AI Suggestions
                  </h3>

                </div>

                <ul className="space-y-4 text-slate-300">

                  <li>✓ Add measurable achievements.</li>

                  <li>✓ Improve professional summary.</li>

                  <li>✓ Include ATS-friendly keywords.</li>

                  <li>✓ Highlight technical projects.</li>

                </ul>

              </Card>

              {/* CTA */}

              <div className="mt-10 flex justify-center">

                <button
                  onClick={handleDashboard}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-700 hover:scale-105"
                >
                  {localStorage.getItem("token")
                    ? "Open Dashboard"
                    : "Sign In to Access Dashboard"}

                  <ArrowRight size={18} />
                </button>

              </div>

            </div>

          </div>

        </Card>

      </div>

    </section>
  );
}