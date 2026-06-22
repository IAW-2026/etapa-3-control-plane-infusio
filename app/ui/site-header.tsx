import Link from 'next/link'
import ClerkInit from "./clerk-init"

export function SiteHeader() {
  return (
    <header className="border-b border-border/70 bg-background/80 px-6 py-5 backdrop-blur md:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="font-serif text-lg font-medium tracking-tight text-foreground">
          Infusio
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2 md:gap-3">
          <ClerkInit />
          <Link href="/system-users" className="btn btn-sm">
            Gestión de usuarios del sistema
          </Link>
        </nav>
      </div>
    </header>
  )
}
