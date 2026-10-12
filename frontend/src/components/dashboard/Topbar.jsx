
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Search,
  UserRound,
  LogOut,
  FileText,
  Loader2,
  X,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Topbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const requestRef = useRef(0);

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "null"));
        setAvatarFailed(false);
      } catch {
        setUser(null);
        setAvatarFailed(false);
      }
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("resumeiq-user-updated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("resumeiq-user-updated", syncUser);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setDocuments([]);
      setLoading(false);
      setSearchOpen(false);
      return;
    }

    const requestId = ++requestRef.current;
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          setDocuments([]);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/resume/my-resumes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (cancelled || requestId !== requestRef.current) return;

        const resumes = Array.isArray(response.data.resumes)
          ? response.data.resumes
          : [];

        const normalizedQuery = query.toLowerCase();

        setDocuments(
          resumes
            .filter((resume) => {
              const title = String(resume.title || "").toLowerCase();
              const fileName = String(resume.fileName || "").toLowerCase();

              return (
                title.includes(normalizedQuery) ||
                fileName.includes(normalizedQuery)
              );
            })
            .slice(0, 6)
        );

        setSearchOpen(true);
      } catch (error) {
        if (!cancelled && requestId === requestRef.current) {
          console.error("Resume search failed:", error);
          setDocuments([]);
          setSearchOpen(true);
        }
      } finally {
        if (!cancelled && requestId === requestRef.current) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  const displayName = user?.name || "ResumeIQ User";
  const displayEmail = user?.email || "";
  const avatar = user?.avatar || "";

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("resumeiq-user-updated"));

    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  };

  const openResume = (resume) => {
    setSearchOpen(false);
    setSearch("");
    navigate(`/ai-insights/${resume._id}`);
  };

  return (
    <header className="sticky top-0 z-40 min-h-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white sm:text-2xl">
            Welcome Back 👋
          </h2>
          <p className="hidden text-sm text-slate-400 sm:block">
            Analyze your resume with AI.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <div ref={searchRef} className="relative w-36 sm:w-52 lg:w-64">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onFocus={() => {
                if (search.trim()) setSearchOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setSearchOpen(false);
                  setSearch("");
                }

                if (event.key === "Enter" && documents.length > 0) {
                  openResume(documents[0]);
                }
              }}
              placeholder="Search resumes..."
              aria-label="Search uploaded resumes"
              aria-expanded={searchOpen}
              className="w-full rounded-xl border border-transparent bg-slate-800 py-3 pl-10 pr-9 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSearchOpen(false);
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={15} />
              </button>
            )}

            {searchOpen && search.trim() && (
              <div className="absolute right-0 top-full mt-3 w-72 max-w-[85vw] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl sm:w-80">
                <div className="border-b border-slate-800 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Resume results
                  </p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-slate-400">
                    <Loader2 size={17} className="animate-spin" />
                    Searching resumes...
                  </div>
                ) : documents.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto py-1">
                    {documents.map((resume) => (
                      <button
                        key={resume._id}
                        type="button"
                        onClick={() => openResume(resume)}
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-800"
                      >
                        <span className="mt-0.5 rounded-lg bg-blue-500/15 p-2 text-blue-400">
                          <FileText size={18} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-white">
                            {resume.title || resume.fileName || "Untitled resume"}
                          </span>
                          <span className="mt-1 block truncate text-xs text-slate-400">
                            {resume.fileName || "Uploaded resume"}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-slate-400">
                    No matching resumes found.
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    navigate("/documents");
                  }}
                  className="w-full border-t border-slate-800 px-4 py-3 text-sm font-medium text-blue-400 transition hover:bg-slate-800"
                >
                  View all documents
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => toast("Notifications will be available here soon.")}
            aria-label="Notifications"
            title="Notifications"
            className="rounded-lg p-2 text-slate-200 transition hover:bg-slate-800 hover:text-blue-400"
          >
            <Bell size={23} />
          </button>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-full outline-none ring-offset-2 ring-offset-slate-950 transition hover:ring-2 hover:ring-blue-500"
            >
              {avatar && !avatarFailed ? (
                <img
                  key={avatar}
                  src={avatar}
                  alt={`${displayName}'s profile`}
                  className="h-10 w-10 rounded-full border border-slate-700 object-cover"
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/30 bg-blue-600/20 text-sm font-bold text-blue-300">
                  {initials}
                </span>
              )}

              <ChevronDown
                size={15}
                className="hidden text-slate-400 sm:block"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-4">
                  {avatar && !avatarFailed ? (
                    <img
                      key={`menu-${avatar}`}
                      src={avatar}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                      onError={() => setAvatarFailed(true)}
                    />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/20 font-bold text-blue-300">
                      {initials}
                    </span>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {displayName}
                    </p>
                    {displayEmail && (
                      <p className="mt-1 truncate text-sm text-slate-400">
                        {displayEmail}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  <UserRound size={18} />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 border-t border-slate-800 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
