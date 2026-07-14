import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Loader2 } from "lucide-react";

export default function ATSChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchATSData();
  }, []);

  const fetchATSData = async () => {
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

      const resumes = res.data.resumes || [];

      const data = resumes
        .sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        )
        .map((resume, index) => ({
          resume: `R${index + 1}`,
          score: resume.score || 0,
        }));

      setChartData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 h-80 flex justify-center items-center">
        <Loader2
          className="animate-spin text-blue-500"
          size={40}
        />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 h-80 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">
          ATS Trend
        </h2>

        <p className="text-slate-400">
          Upload your first resume to see ATS analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 className="text-2xl font-bold mb-5">
        ATS Trend
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#1E293B"
            />

            <XAxis
              dataKey="resume"
              stroke="#94A3B8"
            />

            <Tooltip
              contentStyle={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "12px",
              }}
            />

            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}