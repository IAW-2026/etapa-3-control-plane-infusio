'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Store, Truck, CreditCard, User } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

const nav = [
  { href: '/buyer', label: 'Buyer', icon: ShoppingBag },
  { href: '/seller', label: 'Seller', icon: Store },
  { href: '/shipping', label: 'Shipping', icon: Truck },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { href: '/system-users', label: 'Usuarios del sistema', icon: User}
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 z-40 flex w-full shrink-0 flex-col border-b border-border bg-card/95 backdrop-blur md:h-screen md:w-72 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-3 px-4 py-4 md:block md:px-5 md:py-6">
        <Link href="/" className="infusio hover:opacity-80 transition-opacity">
          infusio
        </Link>

        <div className="md:hidden">
          <UserButton />
        </div>
      </div>

      <p className="px-4 text-xs font-medium uppercase tracking-widest text-muted-foreground md:px-5">
        Apps
      </p>

      <nav className="flex gap-2 overflow-x-auto px-4 py-4 md:flex-1 md:flex-col md:gap-1 md:overflow-visible md:px-5 md:py-4">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors md:w-full md:rounded-xl md:px-3 ${
                active
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="hidden px-5 pb-5 md:block">
        <UserButton />
      </div>
    </aside>
  )
}
