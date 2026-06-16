import { Truck, CreditCard, ShoppingBag, Store } from "lucide-react"

const apps = [
  {
    name: "Shipping",
    description: "Envíos y trazabilidad",
    icon: Truck,
  },
  {
    name: "Payments",
    description: "Pagos y conciliación",
    icon: CreditCard,
  },
  {
    name: "Buyer",
    description: "Experiencia de compra",
    icon: ShoppingBag,
  },
  {
    name: "Seller",
    description: "Gestión de vendedores",
    icon: Store,
  },
]

export function AppsPanel() {
  return (
    <section className="rounded-3xl border border-border bg-card p-7 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-xl text-card-foreground">Apps conectadas</h2>
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium tracking-wide text-primary-foreground">
          4 MÓDULOS
        </span>
      </div>

      <ul className="flex flex-col">
        {apps.map((app, index) => (
          <li
            key={app.name}
            className={`flex items-center gap-4 py-4 ${
              index !== apps.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <app.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-medium text-card-foreground">{app.name}</p>
              <p className="text-sm text-muted-foreground">{app.description}</p>
            </div>
            <span className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-label="Activo" />
          </li>
        ))}
      </ul>

      <p className="mt-6 text-pretty text-sm leading-relaxed text-muted-foreground">
        Un solo acceso para orquestar Shipping, Payments, Buyer y Seller desde un panel unificado.
      </p>
    </section>
  )
}
