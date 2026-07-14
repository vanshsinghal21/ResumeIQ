import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50 px-4"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">

              <div className="flex justify-center">

                <div className="bg-red-500/20 p-4 rounded-full">

                  <AlertTriangle
                    size={42}
                    className="text-red-500"
                  />

                </div>

              </div>

              <h2 className="text-2xl font-bold text-center mt-6">
                Delete Resume
              </h2>

              <p className="text-slate-400 text-center mt-4">
                Are you sure you want to permanently delete this
                resume?
              </p>

              <p className="text-red-400 text-center mt-2 text-sm">
                This action cannot be undone.
              </p>

              <div className="flex gap-4 mt-8">

                <button
                  disabled={loading}
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  onClick={onConfirm}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition flex justify-center items-center"
                >
                  {loading ? (
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                  ) : (
                    "Delete"
                  )}
                </button>

              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}