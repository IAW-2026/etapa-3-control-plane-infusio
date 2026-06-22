import Link from 'next/link'
import { ShoppingBag, Package } from 'lucide-react'

const sections = [
  {
    href: '/seller/orders',
    label: 'Órdenes',
    description: 'Listado global de órdenes de compra y cambio de estado.',
    icon: ShoppingBag,
  },
  {
    href: '/seller/products',
    label: 'Productos',
    description: 'Catálogo completo. Activá o desactivá productos.',
    icon: Package,
  },
]

export default function SellerPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Seller App
        </p>
        <h1 className="font-serif text-3xl text-foreground">Panel de vendedores</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-border bg-card p-6 flex items-start gap-4 hover:border-primary/40 transition-colors group"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground group-hover:bg-primary/10 transition-colors">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                {label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
