'use client'

import { useState, useTransition } from 'react'
import { updateOrderStatusAction } from '../actions'

const STATUSES = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'payment_confirmed', label: 'Pago confirmado' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'dispatched', label: 'Despachada' },
  { value: 'delivered', label: 'Entregada' },
  { value: 'cancelled', label: 'Cancelada' },
]

interface OrderActionsProps {
  orderId: string
  currentStatus: string
}

export function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleUpdate() {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, status)
      if (result?.error) setError(result.error)
      else setSuccess(true)
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5">
      <h2 className="font-medium text-foreground">Acciones</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-muted-foreground">Cambiar estado</label>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setSuccess(false) }}
          disabled={isPending}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button
          onClick={handleUpdate}
          disabled={isPending || status === currentStatus}
          className="btn btn-default btn-sm w-full"
        >
          {isPending ? 'Actualizando…' : 'Actualizar estado'}
        </button>
        {success && (
          <p className="text-sm text-green-600">Estado actualizado.</p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  )
}
