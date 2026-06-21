import { getOrders } from '@/app/lib/seller'
import Link from 'next/link'

const PAGE_SIZE = 20

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  payment_confirmed: 'Pago confirmado',
  preparing: 'Preparando',
  dispatched: 'Despachada',
  delivered: 'Entregada',
  cancelled: 'Cancelada',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  payment_confirmed: 'bg-primary/15 text-primary',
  preparing: 'bg-blue-50 text-blue-600',
  dispatched: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-muted text-muted-foreground',
}

export default async function SellerOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status, page: pageStr } = await searchParams
  const page = Number(pageStr) || 1

  let data
  try {
    data = await getOrders({ status, page, limit: PAGE_SIZE })
  } catch {
    return (
      <p className="text-sm text-destructive">
        No se pudo conectar con la Seller App. Verificá que esté disponible.
      </p>
    )
  }

  const { orders, total, totalPages } = data

  function pageHref(p: number) {
    const params: Record<string, string> = { page: String(p) }
    if (status) params.status = status
    return `/seller/orders?${new URLSearchParams(params)}`
  }

  function formatAddress(address: Order['address']) {
    if (typeof address === 'string') return address
    return `${address.street}, ${address.city}`
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/seller" className="hover:text-foreground transition-colors">Seller App</Link>
        <span>/</span>
        <span>Órdenes</span>
      </div>

      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Seller App
        </p>
        <h1 className="font-serif text-3xl text-foreground">Órdenes</h1>
      </div>

      {/* Filtros */}
      <form method="GET" className="mb-6 flex items-center gap-3">
        <select
          name="status"
          defaultValue={status ?? ''}
          className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="payment_confirmed">Pago confirmado</option>
          <option value="preparing">Preparando</option>
          <option value="dispatched">Despachada</option>
          <option value="delivered">Entregada</option>
          <option value="cancelled">Cancelada</option>
        </select>
        <button type="submit" className="btn btn-default btn-sm">Filtrar</button>
        {status && (
          <Link href="/seller/orders" className="text-sm text-muted-foreground hover:text-foreground">
            Limpiar
          </Link>
        )}
      </form>

      {/* Tabla */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dirección</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Envío</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No hay órdenes.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.purchase_order_id}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {order.purchase_order_id.slice(0, 12)}…
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_COLORS[order.status] ?? 'bg-muted text-muted-foreground'
                    }`}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                    {formatAddress(order.address)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(order.shipping_cost)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/seller/orders/${order.purchase_order_id}`}
                      className="text-primary hover:text-accent text-sm font-medium transition-colors"
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} órdenes en total</span>
        <div className="flex items-center gap-2">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="btn btn-outline btn-sm">← Anterior</Link>
          )}
          <span>Página {page} de {totalPages}</span>
          {page < totalPages && (
            <Link href={pageHref(page + 1)} className="btn btn-outline btn-sm">Siguiente →</Link>
          )}
        </div>
      </div>
    </div>
  )
}

type Order = Awaited<ReturnType<typeof getOrders>>['orders'][number]
