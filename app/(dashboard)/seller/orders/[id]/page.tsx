import { getOrder } from '@/app/lib/seller'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { OrderActions } from './order-actions'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  shipped: 'Enviada',
  delivered: 'Entregada',
  cancelled: 'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-primary/15 text-primary',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-muted text-muted-foreground',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
      STATUS_COLORS[status] ?? 'bg-muted text-muted-foreground'
    }`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

function formatARS(amount: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
}

function formatAddress(address: string | { street: string; city: string }) {
  if (typeof address === 'string') return address
  return `${address.street}, ${address.city}`
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let data
  try {
    data = await getOrder(id)
  } catch {
    notFound()
  }

  const { order } = data

  const orderTotal = order.cart_items.reduce(
    (acc, item) => acc + item.price_at_time * item.quantity,
    0,
  )

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/seller" className="hover:text-foreground transition-colors">Seller App</Link>
        <span>/</span>
        <Link href="/seller/orders" className="hover:text-foreground transition-colors">Órdenes</Link>
        <span>/</span>
        <span className="font-mono">{id.slice(0, 12)}…</span>
      </div>

      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Seller App
        </p>
        <h1 className="font-serif text-3xl text-foreground">Detalle de orden</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Info de la orden */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-medium text-foreground mb-4">Orden</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground mb-0.5">ID</dt>
                <dd className="font-mono text-xs break-all">{order.purchase_order_id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Estado</dt>
                <dd><StatusBadge status={order.status} /></dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Costo de envío</dt>
                <dd className="font-medium">{formatARS(order.shipping_cost)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Total productos</dt>
                <dd className="font-medium">{formatARS(orderTotal)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Dirección</dt>
                <dd>{formatAddress(order.address)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Fecha</dt>
                <dd>{new Date(order.created_at).toLocaleString('es-AR')}</dd>
              </div>
              {order.shipping_id && (
                <div>
                  <dt className="text-muted-foreground mb-0.5">ID envío</dt>
                  <dd className="font-mono text-xs">{order.shipping_id}</dd>
                </div>
              )}
              {order.payment_id && (
                <div>
                  <dt className="text-muted-foreground mb-0.5">ID pago</dt>
                  <dd className="font-mono text-xs">{order.payment_id}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Productos */}
          {order.cart_items.length > 0 && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-medium text-foreground">
                  Productos ({order.cart_items.length})
                </h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Producto</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Cantidad</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Precio unit.</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.cart_items.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{item.product_name}</p>
                        {item.product_variant && (
                          <p className="text-xs text-muted-foreground">{item.product_variant}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{item.quantity}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatARS(item.price_at_time)}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium">
                        {formatARS(item.price_at_time * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div>
          <OrderActions orderId={order.purchase_order_id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  )
}
