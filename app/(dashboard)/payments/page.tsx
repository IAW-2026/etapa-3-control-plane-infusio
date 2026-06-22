import { getPaymentOrders, type PaymentOrder } from '@/app/lib/payments'

import Link from 'next/link'

const PAGE_SIZE = 5

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const page = Number(pageStr) || 1

  let data
  try {
    data = await getPaymentOrders({ page, limit: PAGE_SIZE })
  } catch {
    return (
      <p className="text-sm text-destructive">
        No se pudo conectar con la Payments App. Verificá que esté disponible.
      </p>
    )
  }

  const { orders, total, totalPages } = data

  function pageHref(p: number) {
    return `/payments?${new URLSearchParams({ page: String(p) })}`
  }

  function orderLabel(order: PaymentOrder) {
    return String(
      order.id ?? order.order_id ?? order.purchase_order_id ?? order.payment_id ?? '—',
    )
  }

  function formatValue(value: unknown): string {
    if (value === null || value === undefined) return '—'
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    if (Array.isArray(value)) return value.map(formatValue).join(', ')
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  function formatAmount(order: PaymentOrder) {
    const amount = typeof order.amount === 'number' ? order.amount : order.total
    if (typeof amount !== 'number') return '—'

    const currency = typeof order.currency === 'string' && order.currency ? order.currency : 'ARS'
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount)
  }

  function formatDate(order: PaymentOrder) {
    const rawDate = order.created_at ?? order.updated_at
    if (!rawDate) return '—'

    const parsedDate = new Date(rawDate)
    return Number.isNaN(parsedDate.getTime())
      ? rawDate
      : parsedDate.toLocaleDateString('es-AR')
  }

  function formatStatus(status: unknown) {
    if (typeof status !== 'string' || !status) return 'Sin estado'

    const labels: Record<string, string> = {
      pending: 'Pendiente',
      paid: 'Pagado',
      completed: 'Completado',
      failed: 'Fallido',
      cancelled: 'Cancelado',
      refunded: 'Reintegrado',
    }

    return labels[status] ?? status
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Payments App
        </p>
        <h1 className="font-serif text-3xl text-foreground">Órdenes de pago</h1>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-10 text-center text-muted-foreground">
            No hay órdenes de pago.
          </div>
        ) : (
          orders.map((order) => {
            const entries = Object.entries(order)

            return (
              <article key={orderLabel(order)} className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      Orden
                    </p>
                    <h2 className="font-mono text-sm text-foreground break-all">{orderLabel(order)}</h2>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      {formatStatus(order.status)}
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                      {formatAmount(order)}
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      {formatDate(order)}
                    </span>
                  </div>
                </div>

                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {entries.map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                      <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {key}
                      </dt>
                      <dd className="mt-1 text-sm text-foreground break-words">
                        {formatValue(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            )
          })
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>{total} órdenes en total</span>
        <div className="flex items-center gap-2">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="btn btn-outline btn-sm">
              ← Anterior
            </Link>
          )}
          <span>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={pageHref(page + 1)} className="btn btn-outline btn-sm">
              Siguiente →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}