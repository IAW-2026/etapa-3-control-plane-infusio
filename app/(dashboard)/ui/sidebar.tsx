'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Store, Truck, CreditCard, UsersRound } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

const nav = [
  { href: '/buyer', label: 'Buyer', icon: ShoppingBag },
  { href: '/seller', label: 'Seller', icon: Store },
  { href: '/shipping', label: 'Shipping', icon: Truck },
  { href: '/system-users', label: 'Usuarios del sistema', icon: UsersRound },
  { href: '/payments', label: 'Payments', icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 flex flex-col border-r border-border bg-card px-4 py-6">
      <Link href="/" className="infusio mb-8 px-2 hover:opacity-80 transition-opacity">
        infusio
      </Link>

      <p className="px-2 mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Apps
      </p>

      <nav className="flex flex-col gap-1 flex-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
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

      <div className="px-2">
        <UserButton />
      </div>
    </aside>
  )
}
