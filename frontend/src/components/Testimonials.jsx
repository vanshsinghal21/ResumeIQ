import { Star } from "lucide-react";
import Card from "./ui/Card";
import SectionHeading from "./ui/SectionHeading";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer",
    review:
      "ResumeIQ improved my ATS score from 64% to 92%. The AI suggestions were practical and helped me secure interview calls.",
  },
  {
    name: "Rohan Mehta",
    role: "Data Science Student",
    review:
      "I discovered missing keywords in my resume and improved my internship applications within a day.",
  },
  {
    name: "Ananya Verma",
    role: "Frontend Developer",
    review:
      "The dashboard is simple, modern and the resume feedback feels like guidance from an experienced recruiter.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-28 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6">

        <SectionHeading
          badge="Testimonials"
          title="Trusted by Students & Professionals"
          subtitle="Thousands of learners use ResumeIQ to build stronger resumes and prepare for better career opportunities."
        />

        <div className="grid lg:grid-cols-3 gap-8">

          {testimonials.map((item, index) => (
            <Card key={index}>

              <div className="flex gap-1 mb-6">

                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill="#facc15"
                    className="text-yellow-400"
                  />
                ))}

              </div>

              <p className="text-slate-300 leading-8">
                "{item.review}"
              </p>

              <div className="mt-8 flex items-center gap-4">

                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
                  {item.name.charAt(0)}
                </div>

                <div>

                  <h4 className="font-bold text-lg">
                    {item.name}
                  </h4>

                  <p className="text-slate-400">
                    {item.role}
                  </p>

                </div>

              </div>

            </Card>
          ))}

        </div>

      </div>
    </section>
  );
}