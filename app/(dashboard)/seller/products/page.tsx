import { getProducts } from '@/app/lib/seller'
import Link from 'next/link'

const PAGE_SIZE = 20

export default async function SellerProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; active?: string; page?: string }>
}) {
  const { search, active: activeStr, page: pageStr } = await searchParams
  const page = Number(pageStr) || 1
  const active = activeStr === 'true' ? true : activeStr === 'false' ? false : undefined

  let data
  try {
    data = await getProducts({ search, active, page, limit: PAGE_SIZE })
  } catch {
    return (
      <p className="text-sm text-destructive">
        No se pudo conectar con la Seller App. Verificá que esté disponible.
      </p>
    )
  }

  const { products, total, totalPages } = data

  function pageHref(p: number) {
    const params: Record<string, string> = { page: String(p) }
    if (search) params.search = search
    if (activeStr) params.active = activeStr
    return `/seller/products?${new URLSearchParams(params)}`
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/seller" className="hover:text-foreground transition-colors">Seller App</Link>
        <span>/</span>
        <span>Productos</span>
      </div>

      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Seller App
        </p>
        <h1 className="font-serif text-3xl text-foreground">Productos</h1>
      </div>

      {/* Filtros */}
      <form method="GET" className="mb-6 flex items-center gap-3 flex-wrap">
        <input
          name="search"
          defaultValue={search ?? ''}
          placeholder="Buscar producto…"
          className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground w-52"
        />
        <select
          name="active"
          defaultValue={activeStr ?? ''}
          className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <button type="submit" className="btn btn-default btn-sm">Filtrar</button>
        {(search || activeStr) && (
          <Link href="/seller/products" className="text-sm text-muted-foreground hover:text-foreground">
            Limpiar
          </Link>
        )}
      </form>

      {/* Tabla */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Producto</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Categorías</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Precio</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No hay productos.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{product.name}</p>
                    {product.unit && (
                      <p className="text-xs text-muted-foreground">{product.unit}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.categories.slice(0, 2).map((cat) => (
                        <span key={cat} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(product.price)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/seller/products/${product.id}`}
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
        <span>{total} productos en total</span>
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
