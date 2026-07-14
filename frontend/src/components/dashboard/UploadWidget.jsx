import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

export default function UploadWidget({ onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOC and DOCX files are allowed.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5 MB.");
      return false;
    }

    return true;
  };

  const uploadResume = async (file) => {
    if (!validateFile(file)) return;

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append(
        "title",
        file.name.replace(/\.[^/.]+$/, "")
      );
      formData.append("resume", file);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/resume/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Resume uploaded successfully!");

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      uploadResume(file);
    }
  };

  const handleBrowse = (e) => {
    const file = e.target.files[0];

    if (file) {
      uploadResume(file);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
    >
      <h2 className="text-2xl font-bold mb-6">
        Upload Resume
      </h2>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center transition-all duration-300 ${
          dragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700"
        }`}
      >
        {uploading ? (
          <>
            <Loader2
              size={55}
              className="animate-spin text-blue-500"
            />

            <h3 className="text-xl font-semibold mt-4">
              Uploading...
            </h3>

            <p className="text-slate-400 mt-2">
              Please wait while we upload your resume.
            </p>
          </>
        ) : (
          <>
            <UploadCloud
              size={60}
              className={`mb-4 transition ${
                dragging
                  ? "text-blue-400"
                  : "text-blue-500"
              }`}
            />

            <h3 className="text-xl font-semibold">
              {dragging
                ? "Drop your resume here"
                : "Drag & Drop Resume"}
            </h3>

            <p className="text-slate-400 mt-2">
              PDF, DOC or DOCX • Max 5MB
            </p>

            <button
              onClick={() => fileInputRef.current.click()}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition"
            >
              Choose File
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleBrowse}
              className="hidden"
            />
          </>
        )}
      </div>
    </motion.div>
  );
}