export default function RecentAnalysis({ resumes = [] }) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 className="text-2xl font-bold mb-5">
        Recent Analysis
      </h2>

      {resumes.length === 0 ? (
        <div className="text-slate-400 text-center py-8">
          No resumes uploaded yet.
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="pb-3">Resume</th>
              <th className="pb-3">ATS</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {resumes.map((resume) => (
              <tr
                key={resume._id}
                className="border-t border-slate-800 h-14"
              >
                <td>
                  {resume.title || resume.fileName}
                </td>

                <td className="font-bold text-green-400">
                  {resume.score}%
                </td>

                <td>
                  {new Date(resume.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                    {resume.analysisStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}