import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6">

        <div className="h-20 flex items-center justify-between">

          {/* Logo */}

          <a href="#" className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">

              <FileText size={22} />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-white">
                ResumeIQ
              </h1>

              <p className="text-slate-400 text-sm">
                AI Career Assistant
              </p>

            </div>

          </a>

          {/* Links */}

          <div className="hidden md:flex gap-10">

            <a
              href="#features"
              className="text-slate-300 hover:text-blue-400 transition"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="text-slate-300 hover:text-blue-400 transition"
            >
              Workflow
            </a>

            <a
              href="#dashboard"
              className="text-slate-300 hover:text-blue-400 transition"
            >
              Dashboard
            </a>

            <a
              href="#contact"
              className="text-slate-300 hover:text-blue-400 transition"
            >
              Contact
            </a>

          </div>

          {/* Buttons */}

          <div className="flex gap-4">

            <Link
            to="/login"
            className="px-6 py-3 rounded-xl border border-slate-700 hover:border-blue-500 transition"
            >
           Login or Signup
            </Link>

            <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center justify-center"
            >
            Analyze Resume
            </Link>

          </div>

        </div>

      </div>
    </nav>
  );
}