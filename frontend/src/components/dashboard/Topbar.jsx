import { Bell, Search } from "lucide-react";

export default function Topbar() {
    return (
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8">

            <div>
                <h2 className="text-2xl font-bold">
                    Welcome Back 👋
                </h2>

                <p className="text-slate-400">
                    Analyze your resume with AI.
                </p>
            </div>

            <div className="flex items-center gap-5">

                <div className="relative">

                    <Search
                        className="absolute left-3 top-3"
                        size={18}
                    />

                    <input
                        placeholder="Search..."
                        className="bg-slate-800 rounded-lg pl-10 pr-4 py-2 outline-none"
                    />

                </div>

                <Bell />

                <img
                    src="https://i.pravatar.cc/40"
                    className="rounded-full"
                    alt="profile"
                />

            </div>

        </header>
    );
}