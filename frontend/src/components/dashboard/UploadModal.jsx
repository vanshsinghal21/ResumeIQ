import { useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";

export default function UploadModal({ onClose, onUpload }) {
  const [file, setFile] = useState(null);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    onUpload(file);
    setFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-3xl font-bold text-white">
              Upload Document
            </h2>

            <p className="text-slate-400 mt-1">
              Upload a PDF or DOCX document securely.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="text-slate-400" />
          </button>

        </div>

        {!file ? (
          <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 transition rounded-2xl h-72 flex flex-col justify-center items-center cursor-pointer">

            <UploadCloud
              size={70}
              className="text-blue-500 mb-5"
            />

            <h3 className="text-2xl font-semibold text-white">
              Drag & Drop Document
            </h3>

            <p className="text-slate-400 mt-3">
              PDF or DOCX • Maximum 5 MB
            </p>

            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={handleFile}
            />

          </label>
        ) : (
          <div className="space-y-6">

            <div className="bg-slate-800 rounded-xl p-5 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="bg-blue-600/20 p-3 rounded-xl">
                  <FileText className="text-blue-400" />
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-white">
                    {file.name}
                  </h3>

                  <p className="text-slate-400 text-sm">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>

                </div>

              </div>

              <button
                onClick={() => setFile(null)}
                className="p-2 rounded-lg hover:bg-slate-700"
              >
                <X className="text-red-400" />
              </button>

            </div>

            <div className="flex gap-4">

              <button
                onClick={() => setFile(null)}
                className="flex-1 border border-slate-700 hover:bg-slate-800 py-3 rounded-xl font-medium transition"
              >
                Change File
              </button>

              <button
                onClick={handleUpload}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition"
              >
                Upload Document
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}