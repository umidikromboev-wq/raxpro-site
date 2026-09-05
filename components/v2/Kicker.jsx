// Надзаголовок секции: узкая маркировочная строка, как на балке стеллажа.
export function Kicker({ children, light = false }) {
  return (
    <span className={`inline-flex items-center gap-2 font-num text-base uppercase tracking-[0.2em] ${light ? "text-beam-400" : "text-beam-600"}`}>
      <span aria-hidden="true" className="h-px w-8 bg-current" />
      {children}
    </span>
  );
}
