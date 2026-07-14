import { User, Mail, Shield, Lock, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile } from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-white text-2xl font-semibold">
          Loading Profile...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold">
          Profile
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your account and security settings.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Profile Card */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center">

  <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold">
    {user.name?.charAt(0).toUpperCase()}
  </div>

  <h2 className="mt-6 text-2xl font-semibold">
    {user.name}
  </h2>

  <p className="text-slate-400">
    ResumeIQ User
  </p>

  <p className="text-sm text-slate-500 mt-2">
    Member Since {new Date(user.createdAt).toLocaleDateString()}
  </p>

  {/* Resume Statistics */}

  <div className="mt-8 w-full space-y-4">

    <div className="bg-slate-800 rounded-xl p-4">

      <p className="text-slate-400 text-sm">
        Email Verification
      </p>

      <h3 className="text-green-400 font-semibold">
        ✓ Verified
      </h3>

    </div>

    <div className="bg-slate-800 rounded-xl p-4">

      <p className="text-slate-400 text-sm">
        Account Status
      </p>

      <h3 className="text-blue-400 font-semibold">
        Active
      </h3>

    </div>

  </div>

</div>

        {/* Details */}

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="space-y-6">

            <div>

              <label className="text-slate-400 flex items-center gap-2 mb-2">
                <User size={18} />
                Full Name
              </label>

              <input
                value={user.name}
                readOnly
                className="w-full bg-slate-800 rounded-xl px-4 py-3 outline-none"
              />

            </div>

            <div>

              <label className="text-slate-400 flex items-center gap-2 mb-2">
                <Mail size={18} />
                Email
              </label>

              <input
                value={user.email}
                readOnly
                className="w-full bg-slate-800 rounded-xl px-4 py-3 outline-none"
              />

            </div>

            <div>

              <label className="text-slate-400 flex items-center gap-2 mb-2">
                <Lock size={18} />
                Password
              </label>

              <input
                type="password"
                value="************"
                readOnly
                className="w-full bg-slate-800 rounded-xl px-4 py-3 outline-none"
              />

            </div>

          </div>

        </div>

      </div>

      {/* Security */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <div className="flex items-center gap-3 mb-6">

          <Shield className="text-green-400" />

          <h2 className="text-2xl font-bold">
            Security Status
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-slate-800 rounded-xl p-6">

            <h3 className="font-semibold">
              Authentication
            </h3>

            <p className="text-green-400 mt-2">
              Protected
            </p>

          </div>

          <div className="bg-slate-800 rounded-xl p-6">

            <h3 className="font-semibold">
              Cloud Storage
            </h3>

            <p className="text-green-400 mt-2">
              AWS Connected
            </p>

          </div>

          <div className="bg-slate-800 rounded-xl p-6">

            <h3 className="font-semibold">
              Encryption
            </h3>

            <p className="text-green-400 mt-2">
              JWT Enabled
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}