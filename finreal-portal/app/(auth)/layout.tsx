/**
 * Shared split-screen shell for /login and /signup, matching the provided
 * design: a branded panel on the left, the form on the right.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-gradient-to-br from-orange-900 via-orange-950 to-slate-900 p-10 text-white lg:flex">
        <div className="flex items-center gap-2 text-lg font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-sm">
            F
          </div>
          Finreal
        </div>

        <div className="flex flex-1 items-center justify-center opacity-90">
          <span className="text-[220px] font-black leading-none text-white/10 select-none">
            F
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Secure Financial Administration</h2>
          <p className="mt-2 max-w-sm text-sm text-white/70">
            Centralized control and streamlined operations for authorized personnel.
            Ensure data integrity and operational efficiency.
          </p>
        </div>
      </aside>

      <main className="flex w-full flex-1 items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
