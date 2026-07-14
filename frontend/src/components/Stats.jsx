import {
  FileCheck,
  Users,
  Award,
  Briefcase,
} from "lucide-react";

const stats = [
  {
    icon: FileCheck,
    number: "50K+",
    label: "Resumes Analyzed",
  },
  {
    icon: Award,
    number: "95%",
    label: "ATS Accuracy",
  },
  {
    icon: Briefcase,
    number: "120+",
    label: "Career Skills",
  },
  {
    icon: Users,
    number: "15K+",
    label: "Students Helped",
  },
];

export default function Stats() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">

          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center transition duration-300 hover:-translate-y-2 hover:border-blue-500"
            >
              <item.icon
                size={40}
                className="mx-auto mb-6 text-blue-500"
              />

              <h2 className="text-4xl font-bold">
                {item.number}
              </h2>

              <p className="mt-3 text-slate-400">
                {item.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}