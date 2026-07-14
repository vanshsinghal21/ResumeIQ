import {
  FileText,
  Mail,
  ArrowUp,
  Code2,
  Briefcase,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDashboard = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <footer
      id="contact"
      className="border-t border-slate-800 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-3 mb-5">

              <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">

                <FileText size={22} />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  ResumeIQ
                </h2>

                <p className="text-sm text-slate-400">
                  AI Career Assistant
                </p>

              </div>

            </div>

            <p className="text-slate-400 leading-7">
              Build recruiter-ready resumes with AI powered
              resume analysis, ATS optimization and career guidance.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="font-bold text-lg mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-slate-400">

              <li>
                <button
                  onClick={backToTop}
                  className="hover:text-blue-400 transition"
                >
                  Home
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="hover:text-blue-400 transition"
                >
                  Features
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("workflow")}
                  className="hover:text-blue-400 transition"
                >
                  Workflow
                </button>
              </li>

              <li>
                <button
                  onClick={handleDashboard}
                  className="hover:text-blue-400 transition"
                >
                  Dashboard
                </button>
              </li>

            </ul>

          </div>

          {/* Resources */}

          <div>

            <h3 className="font-bold text-lg mb-5">
              Resources
            </h3>

            <ul className="space-y-3 text-slate-400">

              <li>
                <button
             disabled
             className="cursor-not-allowed text-slate-500"
             title="Documentation will be available after deployment."
              >
             Documentation (Coming Soon)
              </button>
              </li>

              <li>
                <button
                 disabled
                 className="cursor-not-allowed text-slate-500"
                >
                Privacy Policy
                </button>
              </li>

              <li>
                <button
              disabled
               className="cursor-not-allowed text-slate-500"
                >
                  Terms & Conditions
                  </button>
              </li>

              <li>
                <a
              href="mailto:resumeiq11@gmail.com"
                 className="hover:text-blue-400 transition"
                  >
                Support
              </a>

              </li>

            </ul>

          </div>

          {/* Connect */}

          <div>

            <h3 className="font-bold text-lg mb-5">
              Connect
            </h3>

            <div className="space-y-4">

              <a
                href="https://github.com/vanshsinghal21"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition"
              >
                <Code2 size={20} />
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/vansh-singhal-2491b7338/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition"
              >
                <Briefcase size={20} />
                LinkedIn
              </a>

              <a
                href="mailto:resumeiq11@gmail.com"
                className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition"
              >
                <Mail size={20} />
                Contact
              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-16 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">

          <p className="text-slate-500 text-sm">
            © 2026 ResumeIQ • Built with React, Tailwind CSS & AWS Services
          </p>

          <button
            onClick={backToTop}
            className="mt-6 md:mt-0 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
          >
            Back to Top
            <ArrowUp size={18} />
          </button>

        </div>

      </div>
    </footer>
  );
}