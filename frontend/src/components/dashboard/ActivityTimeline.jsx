import {
    CheckCircle
} from "lucide-react";

const activity = [
    "Resume Uploaded",
    "ATS Score Generated",
    "AI Suggestions Ready",
    "Resume Downloaded",
];

export default function ActivityTimeline() {

    return (

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

            <h2 className="text-2xl font-bold mb-6">
                Recent Activity
            </h2>

            <div className="space-y-5">

                {activity.map((item, index) => (

                    <div
                        key={index}
                        className="flex items-center gap-4"
                    >

                        <CheckCircle
                            className="text-green-400"
                        />

                        {item}

                    </div>

                ))}

            </div>

        </div>

    );
}