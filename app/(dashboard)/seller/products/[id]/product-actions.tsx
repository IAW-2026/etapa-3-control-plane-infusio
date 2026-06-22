'use client'

import { useTransition } from 'react'
import { toggleProductAction } from '../actions'

interface ProductActionsProps {
  productId: string
  isActive: boolean
}

export function ProductActions({ productId, isActive }: ProductActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleProductAction(productId, !isActive)
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
      <h2 className="font-medium text-foreground">Acciones</h2>

      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Estado actual:{' '}
          <span className={`font-medium ${isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
            {isActive ? 'Activo' : 'Inactivo'}
          </span>
        </p>
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`btn btn-sm w-full ${isActive ? 'btn-destructive' : 'btn-default'}`}
        >
          {isPending
            ? 'Actualizando…'
            : isActive
            ? 'Desactivar producto'
            : 'Activar producto'}
        </button>
      </div>
    </div>
  )
}
