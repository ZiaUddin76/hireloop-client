// Decorative glow shared by the auth pages. Purely presentational, no hooks —
// renders on the server and inside client components alike.
export function AuthBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-fuchsia-500/25 via-fuchsia-500/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_40%,rgba(92,83,254,0.35),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08080a] to-transparent" />
    </div>
  )
}
