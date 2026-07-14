import { useEffect, useState } from "react";
import axios from "axios";
import { Brain, Eye, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Activity() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/resume/my-resumes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setActivities(res.data.resumes);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Resume Activity
        </h1>

        <p className="text-slate-400 mt-2">
          View all your previous AI resume analyses.
        </p>
      </div>

      <div className="grid gap-5">

        {activities.length === 0 ? (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <Brain
              size={60}
              className="mx-auto text-slate-500"
            />

            <h2 className="text-2xl font-semibold mt-6">
              No Resume Activity
            </h2>

            <p className="text-slate-400 mt-3">
              Upload your first resume to start AI analysis.
            </p>

          </div>

        ) : (

          activities.map((resume) => (

            <div
              key={resume._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center hover:border-blue-500 transition"
            >

              <div>

                <h2 className="text-xl font-semibold">
                  {resume.title}
                </h2>

                <div className="flex items-center gap-5 mt-3 text-slate-400">

                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </div>

                  <div>
                    Status:
                    <span className="ml-2 text-green-400">
                      {resume.analysisStatus}
                    </span>
                  </div>

                </div>

              </div>

              <div className="flex items-center gap-8">

                <div className="text-center">

                  <p className="text-slate-400 text-sm">
                    ATS Score
                  </p>

                  <h2 className="text-3xl font-bold text-blue-400">
                    {resume.score}%
                  </h2>

                </div>

                <button
                  onClick={() =>
                    navigate(`/ai-insights/${resume._id}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl flex items-center gap-2"
                >
                  <Eye size={18} />
                  View
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}