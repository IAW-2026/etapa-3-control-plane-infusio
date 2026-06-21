import Link from 'next/link'
import { BadgeDollarSign, MapPinned, Truck } from 'lucide-react'

const shippingAppUrl =
  process.env.SHIPPING_APP_URL ?? 'https://proyecto-c-shipping-infusio.vercel.app'

const sections = [
  {
    label: 'Operación',
    description: 'Despachos activos, incidencias y cambios de estado desde el módulo de shipping.',
    icon: Truck,
  },
  {
    label: 'Trazabilidad',
    description: 'Seguimiento de envíos y eventos logísticos para cada orden.',
    icon: MapPinned,
  },
  {
    label: 'Cobertura y tarifas',
    description: 'Zonas habilitadas, costos y reglas de entrega por región.',
    icon: BadgeDollarSign,
  },
]

export default function ShippingPage() {
  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Shipping App
          </p>
          <h1 className="font-serif text-3xl text-foreground">Panel de envíos</h1>
        </div>

        <Link
          href={shippingAppUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
        >
          Abrir app
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ label, description, icon: Icon }) => (
          <Link
            key={label}
            href={shippingAppUrl}
            target="_blank"
            rel="noreferrer"
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

      <p className="mt-6 text-sm text-muted-foreground">
        El módulo de shipping se abre en una app separada. Usá cualquiera de estas entradas para
        llegar al panel operativo.
      </p>
    </div>
  )
}