import { getProduct } from '@/app/lib/seller'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductActions } from './product-actions'

function formatARS(amount: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let data
  try {
    data = await getProduct(id)
  } catch {
    notFound()
  }

  const { product } = data

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/seller" className="hover:text-foreground transition-colors">Seller App</Link>
        <span>/</span>
        <Link href="/seller/products" className="hover:text-foreground transition-colors">Productos</Link>
        <span>/</span>
        <span className="truncate max-w-[160px]">{product.name}</span>
      </div>

      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
          Seller App
        </p>
        <h1 className="font-serif text-3xl text-foreground">{product.name}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Imagen */}
          {product.imageUrl && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-56 object-cover"
              />
            </div>
          )}

          {/* Info principal */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-medium text-foreground mb-4">Información</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground mb-0.5">Precio</dt>
                <dd className="font-medium text-lg">{formatARS(product.price)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Stock</dt>
                <dd className="font-medium">{product.stock} unidades</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Estado</dt>
                <dd>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    product.isActive ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </dd>
              </div>
              {product.unit && (
                <div>
                  <dt className="text-muted-foreground mb-0.5">Unidad</dt>
                  <dd>{product.unit}</dd>
                </div>
              )}
              {product.location && (
                <div>
                  <dt className="text-muted-foreground mb-0.5">Origen</dt>
                  <dd>{product.location}</dd>
                </div>
              )}
              {product.badge && (
                <div>
                  <dt className="text-muted-foreground mb-0.5">Badge</dt>
                  <dd>{product.badge}</dd>
                </div>
              )}
              {product.isLimitedEdition && (
                <div className="col-span-2">
                  <span className="inline-flex rounded-full bg-accent/15 text-accent px-2.5 py-0.5 text-xs font-medium">
                    Edición limitada
                  </span>
                </div>
              )}
              {product.availableUntil && (
                <div>
                  <dt className="text-muted-foreground mb-0.5">Disponible hasta</dt>
                  <dd>{new Date(product.availableUntil).toLocaleDateString('es-AR')}</dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground mb-0.5">Creado</dt>
                <dd>{new Date(product.createdAt).toLocaleDateString('es-AR')}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-0.5">Actualizado</dt>
                <dd>{new Date(product.updatedAt).toLocaleDateString('es-AR')}</dd>
              </div>
            </dl>

            {product.description && (
              <div className="mt-4 pt-4 border-t border-border">
                <dt className="text-sm text-muted-foreground mb-1">Descripción</dt>
                <dd className="text-sm">{product.description}</dd>
              </div>
            )}
          </div>

          {/* Categorías y colores */}
          {(product.categories.length > 0 || product.colors.length > 0) && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-medium text-foreground mb-4">Clasificación</h2>
              {product.categories.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Categorías</p>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((cat) => (
                      <span key={cat} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.colors.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Colores</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span key={color} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div>
          <ProductActions productId={product.id} isActive={product.isActive} />
        </div>
      </div>
    </div>
  )
}
