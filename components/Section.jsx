// Shared section primitives matching irstone's format: pill eyebrow + split header (heading left / desc right).

export function Eyebrow({ children, light = false }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide ${light ? 'bg-white/10 text-cloud-200' : 'bg-cloud-100 text-slate-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${light ? 'bg-sky-400' : 'bg-sky-400'}`} />
      {children}
    </span>
  );
}

export function SplitHead({ eyebrow, title, desc, light = false }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4 lg:gap-10 items-end">
      <div>
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2 className={`mt-4 font-display font-medium text-3xl sm:text-[2.6rem] leading-[1.1] tracking-tight ${light ? 'text-white' : 'text-navy-800'}`}>
          {title}
        </h2>
      </div>
      {desc && (
        <p className={`text-[15px] leading-relaxed lg:text-right max-w-md lg:justify-self-end ${light ? 'text-cloud-200/70' : 'text-slate-500'}`}>
          {desc}
        </p>
      )}
    </div>
  );
}
