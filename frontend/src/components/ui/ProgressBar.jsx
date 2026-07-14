export default function ProgressBar({
  value,
  color = "bg-green-500",
}) {
  return (
    <div className="mt-3 h-3 rounded-full bg-slate-700 overflow-hidden">

      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />

    </div>
  );
}