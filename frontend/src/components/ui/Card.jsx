export default function Card({
  children,
  className = "",
  hover = true,
}) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-slate-800
        bg-slate-900/70
        backdrop-blur
        p-8
        transition-all
        duration-500
        ${
          hover
            ? "hover:-translate-y-3 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
            : ""
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}