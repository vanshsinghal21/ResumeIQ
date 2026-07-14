import {
  Upload,
  BrainCircuit,
  ScanSearch,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Resume",
    description:
      "Upload your resume in PDF or DOCX format securely in just one click.",
  },
  {
    icon: BrainCircuit,
    title: "AI Analysis",
    description:
      "ResumeIQ analyzes your resume using AI to identify strengths and weaknesses.",
  },
  {
    icon: ScanSearch,
    title: "ATS Evaluation",
    description:
      "Check ATS compatibility, keyword matching and recruiter readiness.",
  },
  {
    icon: TrendingUp,
    title: "Career Insights",
    description:
      "Receive personalized suggestions, career recommendations and improvement tips.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="workflow"
      className="py-28 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-20">

          <span className="text-blue-400 uppercase tracking-widest font-semibold">
            Workflow
          </span>

          <h2 className="mt-4 text-5xl font-bold">
            How ResumeIQ Works
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-slate-400 text-lg">
            Upload your resume, let AI analyze it, receive an ATS score,
            and get personalized recommendations to improve your chances
            of getting shortlisted.
          </p>

        </div>

        {/* Steps */}

        <div className="grid gap-8 lg:grid-cols-4">

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 mb-6">

                  <step.icon
                    size={34}
                    className="text-blue-500"
                  />

                </div>

                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                  {index + 1}
                </div>

                <h3 className="mt-4 text-2xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-4 text-slate-400 leading-7">
                  {step.description}
                </p>

              </div>

              {/* Arrow (Desktop only) */}

              {index !== steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-6 -translate-y-1/2 z-10">
                  <ArrowRight
                    className="text-blue-500"
                    size={28}
                  />
                </div>
              )}

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}