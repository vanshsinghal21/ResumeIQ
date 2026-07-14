import {
    LayoutDashboard,
    Upload,
    Brain,
    History,
    User,
    LogOut
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const menu = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        name: "Documents",
        icon: Upload,
        path: "/documents",
    },
    {
        name: "Activity",
        icon: History,
        path: "/activity",
    },
    {
        name: "Profile",
        icon: User,
        path: "/profile",
    },
];

export default function Sidebar() {
    const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/login");
};
    return (
        <aside className="w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">

            <h1 className="text-3xl font-bold mb-12">
                Resume<span className="text-blue-500">IQ</span>
            </h1>

            <nav className="space-y-3 flex-1">

                {menu.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-xl transition ${
                                    isActive
                                        ? "bg-blue-600"
                                        : "hover:bg-slate-800"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {item.name}
                        </NavLink>
                    );
                })}

            </nav>

            <button
                 onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-600 transition"
            >
                <LogOut size={20} />
                Logout
            </button>
        </aside>
    );
}