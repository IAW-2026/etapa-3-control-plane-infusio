'use client'

import { useState, useTransition } from 'react'
import { updateCartStatusAction, deleteCartAction } from '../actions'

const STATUSES = [
  { value: 'NOT_CHECKED_OUT', label: 'Activo' },
  { value: 'CHECKED_OUT', label: 'Completado' },
]

interface CartActionsProps {
  cartId: string
  currentStatus: string
}

export function CartActions({ cartId, currentStatus }: CartActionsProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleStatusUpdate() {
    setError(null)
    startTransition(async () => {
      const result = await updateCartStatusAction(cartId, status)
      if (result?.error) setError(result.error)
    })
  }

  function handleDelete() {
    if (!confirm('¿Eliminar este carrito? Esta acción no se puede deshacer.')) return
    setError(null)
    startTransition(async () => {
      const result = await deleteCartAction(cartId)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5">
      <h2 className="font-medium text-foreground">Acciones</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-muted-foreground">Cambiar estado</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isPending}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleStatusUpdate}
          disabled={isPending || status === currentStatus}
          className="btn btn-default btn-sm w-full"
        >
          {isPending ? 'Actualizando…' : 'Actualizar estado'}
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <hr className="border-border" />

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="btn btn-destructive btn-sm w-full"
      >
        {isPending ? 'Eliminando…' : 'Eliminar carrito'}
      </button>
    </div>
  )
}
