export default function SectionHeading({
  badge,
  title,
  subtitle,
}) {
  return (
    <div className="text-center mb-20">

      {badge && (
        <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-blue-400">
          {badge}
        </span>
      )}

      <h2 className="mt-6 text-5xl font-extrabold">
        {title}
      </h2>

      <p className="mt-6 max-w-3xl mx-auto text-lg leading-8 text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}