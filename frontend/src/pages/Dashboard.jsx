import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/api";

import {
  Award,
  Brain,
  FileText,
  Trophy,
  Loader2,
} from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import UploadWidget from "../components/dashboard/UploadWidget";
import ATSChart from "../components/dashboard/ATSChart";
import RecentAnalysis from "../components/dashboard/RecentAnalysis";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!stats) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <Loader2
          size={50}
          className="animate-spin text-blue-500"
        />

        <p className="text-slate-400 mt-5 text-lg">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back. Here's your latest resume performance.
        </p>

      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatsCard
          title="Average ATS Score"
          value={`${stats.averageScore}%`}
          icon={Award}
          color="bg-green-500/20"
        />

        <StatsCard
          title="Total Resumes"
          value={stats.totalResumes}
          icon={FileText}
          color="bg-blue-500/20"
        />

        <StatsCard
          title="AI Suggestions"
          value={stats.totalSuggestions}
          icon={Brain}
          color="bg-purple-500/20"
        />

        <StatsCard
          title="Best ATS Score"
          value={`${stats.bestScore || 0}%`}
          icon={Trophy}
          color="bg-yellow-500/20"
        />

      </div>

      {/* Upload + ATS */}

      <div className="grid xl:grid-cols-2 gap-6">

        <UploadWidget
          onUploadSuccess={fetchDashboard}
        />

        <ATSChart />

      </div>

      {/* Analysis + Activity */}

      <div className="grid xl:grid-cols-2 gap-6">

        <RecentAnalysis
          resumes={stats.resumes}
        />

        <ActivityTimeline />

      </div>

    </div>
  );
}