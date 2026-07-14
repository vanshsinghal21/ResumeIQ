export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40",

    secondary:
      "border border-slate-700 bg-transparent text-white hover:border-blue-500 hover:bg-blue-500/10",

    success:
      "bg-green-600 hover:bg-green-700 text-white",
  };

  return (
    <button
      {...props}
      className={`
        group
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-6
        py-3
        font-semibold
        transition-all
        duration-300
        hover:scale-105
        active:scale-95
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}