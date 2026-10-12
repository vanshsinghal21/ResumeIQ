
import {
  User,
  Mail,
  Shield,
  Lock,
  Camera,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getProfile } from "../services/api";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (!active) return;

        const profileUser = data.user;

        setUser(profileUser);
        setAvatarFailed(false);

        let storedUser = {};

        try {
          storedUser = JSON.parse(
            localStorage.getItem("user") || "{}"
          );
        } catch {
          storedUser = {};
        }

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            _id: profileUser._id || profileUser.id,
            name: profileUser.name,
            email: profileUser.email,
            avatar: profileUser.avatar || "",
          })
        );

        window.dispatchEvent(new Event("resumeiq-user-updated"));
      } catch (error) {
        if (active) {
          toast.error(
            error.response?.data?.message ||
              "Unable to load your profile."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Your profile photo must be 2 MB or smaller.");
      return;
    }

    const localPreview = URL.createObjectURL(file);

    setPreview((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return localPreview;
    });

    setAvatarFailed(false);
    setUploadSuccess(false);
    setUploading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again to update your photo.");
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      setUser((current) => ({
        ...current,
        ...updatedUser,
      }));

      setPreview("");
      setAvatarFailed(false);
      setUploadSuccess(true);

      let storedUser = {};

      try {
        storedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );
      } catch {
        storedUser = {};
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          _id: updatedUser._id || updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar || "",
        })
      );

      window.dispatchEvent(new Event("resumeiq-user-updated"));

      toast.success("Profile photo updated successfully.");
    } catch (error) {
      setPreview("");
      setAvatarFailed(false);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to upload your photo."
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-300">
        <LoaderCircle className="mr-3 animate-spin" size={22} />
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-300">
        Unable to load your profile. Please refresh the page or sign in again.
      </div>
    );
  }

  const avatar = preview || user.avatar || "";
  const initials =
    user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">Profile</h1>
        <p className="mt-2 text-slate-400">
          Manage your account and profile photo.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="relative flex h-28 w-28 items-center justify-center">
            {avatar && !avatarFailed ? (
              <img
                key={avatar}
                src={avatar}
                alt={`${user.name || "User"}'s profile`}
                className="absolute inset-0 h-full w-full rounded-full border-2 border-slate-700 object-cover"
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-blue-400/30 bg-blue-600/20 text-4xl font-bold text-blue-300">
                {initials}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="Choose profile photo"
              className="absolute -bottom-1 -right-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Camera size={18} />
              )}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <h2 className="mt-5 break-words text-center text-xl font-semibold">
            {user.name}
          </h2>

          <p className="mt-1 break-all text-center text-sm text-slate-400">
            {user.email}
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-500 hover:bg-blue-500/10 disabled:opacity-60"
          >
            {uploading ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Uploading photo...
              </>
            ) : (
              <>
                <Camera size={16} />
                Change photo
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-slate-500">
            JPG, PNG or WebP · Maximum 2 MB
          </p>

          {uploadSuccess && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-green-400">
              <CheckCircle2 size={16} />
              Photo saved
            </p>
          )}

          <p className="mt-6 text-sm text-slate-500">
            Member since{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "—"}
          </p>

          <div className="mt-8 w-full space-y-4">
            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">
                Email verification
              </p>
              <p
                className={`mt-1 font-semibold ${
                  user.isVerified ? "text-green-400" : "text-amber-400"
                }`}
              >
                {user.isVerified ? "Verified" : "Not verified"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Account status</p>
              <p className="mt-1 font-semibold text-blue-400">Active</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 lg:col-span-2">
          <h2 className="mb-6 text-xl font-bold">Account details</h2>

          <div className="space-y-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <User size={18} />
                Full name
              </label>
              <input
                value={user.name || ""}
                readOnly
                className="w-full rounded-xl border border-slate-800 bg-slate-800 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <Mail size={18} />
                Email
              </label>
              <input
                value={user.email || ""}
                readOnly
                className="w-full rounded-xl border border-slate-800 bg-slate-800 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                <Lock size={18} />
                Password
              </label>
              <input
                type="password"
                value={user.hasPassword ? "************" : ""}
                placeholder={
                  user.hasPassword
                    ? ""
                    : "This account uses Google sign-in"
                }
                readOnly
                className="w-full rounded-xl border border-slate-800 bg-slate-800 px-4 py-3 text-white outline-none"
              />
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <Shield className="text-green-400" />
          <h2 className="text-xl font-bold sm:text-2xl">
            Security status
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl bg-slate-800 p-5">
            <h3 className="font-semibold">Authentication</h3>
            <p className="mt-2 text-green-400">Protected</p>
          </div>

          <div className="rounded-xl bg-slate-800 p-5">
            <h3 className="font-semibold">Cloud storage</h3>
            <p className="mt-2 text-green-400">AWS configured</p>
          </div>

          <div className="rounded-xl bg-slate-800 p-5">
            <h3 className="font-semibold">Authentication token</h3>
            <p className="mt-2 text-green-400">JWT enabled</p>
          </div>
        </div>
      </section>
    </div>
  );
}
