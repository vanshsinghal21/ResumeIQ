import { motion } from "framer-motion";

export default function StatsCard({
    title,
    value,
    icon: Icon,
    color,
}) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
            <div className="flex justify-between items-center">

                <div>

                    <p className="text-slate-400">
                        {title}
                    </p>

                    <h2 className="text-4xl font-bold mt-2">
                        {value}
                    </h2>

                </div>

                <div
                    className={`p-4 rounded-xl ${color}`}
                >
                    <Icon size={30}/>
                </div>

            </div>
        </motion.div>
    );
}