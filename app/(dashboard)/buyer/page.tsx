import { getCarts } from '@/app/lib/buyer'
import Link from 'next/link'

const PAGE_SIZE = 20

const STATUS_LABELS: Record<string, string> = {
  NOT_CHECKED_OUT: 'Activo',
  CHECKED_OUT: 'Completado',
}

const STATUS_COLORS: Record<string, string> = {
  NOT_CHECKED_OUT: 'bg-primary/15 text-primary',
  CHECKED_OUT: 'bg-green-100 text-green-700',
}

export default async function BuyerPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status, page: pageStr } = await searchParams
  const page = Number(pageStr) || 1

  let data
  try {
    data = await getCarts({ status, page, limit: PAGE_SIZE })
  } catch {
    return (
      <p className="text-sm text-destructive">
        No se pudo conectar con la Buyer App. Verificá que esté disponible.
      </p>
    )
  }

  const { carts, total, totalPages } = data

  function pageHref(p: number) {
    const params: Record<string, string> = { page: String(p) }
    if (status) params.status = status
    return `/buyer?${new URLSearchParams(params)}`
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Buyer App
        </p>
        <h1 className="font-serif text-3xl text-foreground">Carritos</h1>
      </div>

      {/* Filtros */}
      <form method="GET" className="mb-6 flex items-center gap-3">
        <select
          name="status"
          defaultValue={status ?? ''}
          className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="">Todos los estados</option>
          <option value="NOT_CHECKED_OUT">Activo</option>
          <option value="CHECKED_OUT">Completado</option>
        </select>
        <button type="submit" className="btn btn-default btn-sm">
          Filtrar
        </button>
        {status && (
          <Link href="/buyer" className="text-sm text-muted-foreground hover:text-foreground">
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
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usuario</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Subtotal</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Creado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {carts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No hay carritos.
                </td>
              </tr>
            ) : (
              carts.map((cart) => (
                <tr
                  key={cart.id}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {cart.id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3">
                    {cart.user ? (
                      <div>
                        <p className="font-medium text-foreground">
                          {cart.user.name} {cart.user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{cart.user.email}</p>
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground">
                        {cart.userId.slice(0, 12)}…
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[cart.status] ?? 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {STATUS_LABELS[cart.status] ?? cart.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {cart.subtotal != null
                      ? new Intl.NumberFormat('es-AR', {
                          style: 'currency',
                          currency: 'ARS',
                        }).format(cart.subtotal)
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(cart.createdAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/buyer/${cart.id}`}
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
        <span>{total} carritos en total</span>
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
