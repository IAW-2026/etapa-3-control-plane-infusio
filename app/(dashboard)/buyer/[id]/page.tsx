import { getCart } from '@/app/lib/buyer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CartActions } from './cart-actions'

const STATUS_LABELS: Record<string, string> = {
  NOT_CHECKED_OUT: 'Activo',
  CHECKED_OUT: 'Completado',
}

const STATUS_COLORS: Record<string, string> = {
  NOT_CHECKED_OUT: 'bg-primary/15 text-primary',
  CHECKED_OUT: 'bg-green-100 text-green-700',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STATUS_COLORS[status] ?? 'bg-muted text-muted-foreground'
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

function formatARS(amount: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let data
  try {
    data = await getCart(id)
  } catch {
    notFound()
  }

  const { cart } = data

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/buyer" className="hover:text-foreground transition-colors">
          Carritos
        </Link>
        <span>/</span>
        <span className="font-mono">{id.slice(0, 8)}…</span>
      </div>

      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Buyer App
        </p>
        <h1 className="font-serif text-3xl text-foreground">Detalle de carrito</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Info del carrito */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-medium text-foreground mb-4">Carrito</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground mb-0.5">ID</dt>
                <dd className="font-mono text-xs break-all">{cart.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Estado</dt>
                <dd>
                  <StatusBadge status={cart.status} />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Subtotal</dt>
                <dd className="font-medium">
                  {cart.subtotal != null ? formatARS(cart.subtotal) : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Actualizado</dt>
                <dd>{new Date(cart.updatedAt).toLocaleString('es-AR')}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground mb-0.5">Creado</dt>
                <dd>{new Date(cart.createdAt).toLocaleString('es-AR')}</dd>
              </div>
            </dl>
          </div>

          {/* Info del comprador */}
          {cart.user && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-medium text-foreground mb-4">Comprador</h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-muted-foreground mb-0.5">Nombre</dt>
                  <dd className="font-medium">
                    {cart.user.name} {cart.user.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground mb-0.5">Email</dt>
                  <dd>{cart.user.email}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Items */}
          {cart.items && cart.items.length > 0 && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-medium text-foreground">
                  Productos ({cart.items.length})
                </h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Precio unit.
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{item.productName}</p>
                        {item.productVariant && (
                          <p className="text-xs text-muted-foreground">{item.productVariant}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{item.quantity}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatARS(item.priceAtTime)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium">
                        {formatARS(item.priceAtTime * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Columna de acciones */}
        <div>
          <CartActions cartId={cart.id} currentStatus={cart.status} />
        </div>
      </div>
    </div>
  )
}
