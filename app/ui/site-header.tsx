import Link from 'next/link'
import ClerkInit from "./clerk-init"

export function SiteHeader() {
  return (
    <header className="border-b border-border/70 bg-background/80 px-4 py-4 backdrop-blur sm:px-6 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="font-serif text-lg font-medium tracking-tight text-foreground">
          Infusio
        </Link>

        <nav className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end md:gap-3">
          <ClerkInit />
          <Link href="/system-users" className="btn btn-sm w-full sm:w-auto">
            Gestión de usuarios del sistema
          </Link>
        </nav>
      </div>
    </header>
  )
}
