import { useState, useEffect } from "react";
import axios from "axios";
import UploadModal from "../components/dashboard/UploadModal";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Upload,
  Search,
  FileText,
  Download,
  Trash2,
  Brain,
  Loader2,
  FolderOpen,
} from "lucide-react";

export default function Documents() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/resume/my-resumes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const docs = response.data.resumes.map((resume) => ({
        id: resume._id,
        name: resume.title,
        type: resume.fileName.split(".").pop().toUpperCase(),
        uploaded: new Date(
          resume.createdAt
        ).toLocaleDateString(),

        score: resume.score || 0,
        status: resume.analysisStatus,
        url: resume.fileUrl,
      }));

      setDocuments(docs);

    } catch (err) {

      console.log(err);

      toast.error("Failed to load documents.");

    } finally {

      setLoading(false);

    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (file) => {
    try {

      setUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", file.name);
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

      await fetchResumes();

      setShowModal(false);

      toast.success("Resume uploaded successfully!");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          "Upload Failed"
      );

    } finally {

      setUploading(false);

    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this resume?")) return;

    try {

      setDeletingId(id);

      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/resume/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDocuments((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("Resume deleted!");

    } catch (err) {

      toast.error("Delete Failed");

    } finally {

      setDeletingId(null);

    }
  };

  const handleDownload = async (doc) => {
  try {
    setDownloadingId(doc.id);

    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/resume/download/${doc.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    window.open(response.data.url, "_blank");

  } catch (error) {

    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Unable to download resume."
    );

  } finally {

    setDownloadingId(null);

  }
};

  return (
  <div className="space-y-8">

    {/* Header */}

    <div className="flex justify-between items-center">

      <div>

        <h1 className="text-4xl font-bold">
          Resume Library
        </h1>

        <p className="text-slate-400 mt-2">
          Securely manage and analyze all your resumes.
        </p>

      </div>

      <button
        onClick={() => setShowModal(true)}
        disabled={uploading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3 rounded-xl flex items-center gap-2 transition"
      >

        {uploading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={18} />
            Upload Resume
          </>
        )}

      </button>

    </div>

    {/* Search */}

    <div>

      <div className="relative">

        <Search
          className="absolute left-4 top-4 text-slate-400"
          size={18}
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resumes..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition"
        />

      </div>

      <p className="text-slate-400 text-sm mt-3">

        Showing

        <span className="text-white font-semibold mx-1">
          {filteredDocs.length}
        </span>

        of

        <span className="text-white font-semibold mx-1">
          {documents.length}
        </span>

        resumes

      </p>

    </div>

    {/* Loading */}

    {loading ? (

      <div className="flex justify-center items-center h-72">

        <Loader2
          className="animate-spin text-blue-500"
          size={50}
        />

      </div>

    ) : filteredDocs.length === 0 ? (

      <div className="bg-slate-900 border border-dashed border-slate-700 rounded-3xl py-20">

        <FolderOpen
          size={80}
          className="mx-auto text-slate-600"
        />

        <h2 className="text-3xl font-bold text-center mt-6">

          No Resumes Yet

        </h2>

        <p className="text-slate-400 text-center mt-4">

          Upload your first resume to unlock AI analysis.

        </p>

        <div className="flex justify-center mt-8">

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
          >

            Upload Resume

          </button>

        </div>

      </div>

    ) : (

      <div className="grid gap-6">

        {filteredDocs.map((doc) => (

          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6"
          >

            <div className="flex justify-between items-start">

              <div className="flex gap-5">

                <div className="bg-blue-600/20 p-4 rounded-xl">

                  <FileText
                    className="text-blue-400"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-semibold">

                    {doc.name}

                  </h2>

                  <div className="flex gap-3 mt-3 flex-wrap">

                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">

                      {doc.type}

                    </span>

                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">

                      ATS {doc.score}

                    </span>

                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">

                      {doc.status}

                    </span>

                  </div>

                  <p className="text-slate-400 mt-4 text-sm">

                    Uploaded on {doc.uploaded}

                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => handleDownload(doc)}
                  disabled={downloadingId === doc.id}
                  className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl"
                >

                  {downloadingId === doc.id ? (

                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                  ) : (

                    <Download size={18} />

                  )}

                </button>

                <button
                  onClick={() =>
                    navigate(`/ai-insights/${doc.id}`)
                  }
                  className="bg-purple-600 hover:bg-purple-700 p-3 rounded-xl"
                >

                  <Brain size={18} />

                </button>

                <button
                  onClick={() =>
                    handleDelete(doc.id)
                  }
                  disabled={deletingId === doc.id}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-60 p-3 rounded-xl"
                >

                  {deletingId === doc.id ? (

                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                  ) : (

                    <Trash2 size={18} />

                  )}

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    )}

    {showModal && (

      <UploadModal
        onClose={() => setShowModal(false)}
        onUpload={handleUpload}
      />

    )}

  </div>
  ) 
};