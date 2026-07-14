import {
  BrainCircuit,
  ScanSearch,
  SearchCheck,
  BriefcaseBusiness,
  BarChart3,
  FileDown,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    color: "from-blue-500 to-cyan-500",
    title: "AI Resume Analysis",
    description:
      "Analyze every section of your resume using AI and receive actionable feedback.",
    points: [
      "Smart resume review",
      "Content analysis",
      "AI suggestions",
    ],
  },
  {
    icon: ScanSearch,
    color: "from-emerald-500 to-green-500",
    title: "ATS Compatibility",
    description:
      "Measure how well your resume performs with Applicant Tracking Systems.",
    points: [
      "ATS score",
      "Formatting check",
      "Recruiter ready",
    ],
  },
  {
    icon: SearchCheck,
    color: "from-violet-500 to-purple-500",
    title: "Keyword Detection",
    description:
      "Identify missing keywords and improve your chances of getting shortlisted.",
    points: [
      "Missing skills",
      "Keyword matching",
      "Optimization",
    ],
  },
  {
    icon: BriefcaseBusiness,
    color: "from-orange-500 to-amber-500",
    title: "Career Match",
    description:
      "Receive personalized career recommendations based on your resume.",
    points: [
      "Job suggestions",
      "Career roadmap",
      "Skill growth",
    ],
  },
  {
    icon: BarChart3,
    color: "from-cyan-500 to-sky-500",
    title: "Resume Analytics",
    description:
      "Understand your resume with visual insights and performance metrics.",
    points: [
      "Performance graphs",
      "Resume insights",
      "Progress tracking",
    ],
  },
  {
    icon: FileDown,
    color: "from-pink-500 to-rose-500",
    title: "Download Report",
    description:
      "Export a complete AI-generated report with all recommendations.",
    points: [
      "PDF export",
      "Detailed summary",
      "Share easily",
    ],
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-28 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">

          <span className="text-blue-400 font-semibold uppercase tracking-widest">
            Why Choose ResumeIQ
          </span>

          <h2 className="mt-4 text-5xl font-bold">
            Everything You Need
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-400">
            ResumeIQ combines AI, ATS optimization and career intelligence
            into one modern platform designed to help you land interviews.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10"
            >

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color}`}
              >
                <feature.icon className="text-white" size={32} />
              </div>

              <h3 className="mt-8 text-2xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-4 text-slate-400 leading-7">
                {feature.description}
              </p>

              <div className="mt-8 space-y-3">

                {feature.points.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-green-400"
                    />

                    {point}
                  </div>
                ))}

              </div>

              <button className="mt-10 flex items-center gap-2 text-blue-400 font-semibold transition-all group-hover:gap-4">
                Learn More
                <ArrowRight size={18} />
              </button>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}