'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { updateShipmentStatusAction } from './actions'

const STATUSES = [
	{ value: 'CONFIRMED', label: 'Confirmado' },
	{ value: 'PREPARING', label: 'Preparando' },
	{ value: 'IN_TRANSIT', label: 'En tránsito' },
	{ value: 'ARRIVED_CITY', label: 'Llegó a ciudad' },
	{ value: 'OUT_FOR_DELIVERY', label: 'En reparto' },
	{ value: 'DELIVERED', label: 'Entregado' },
	{ value: 'CANCELLED', label: 'Cancelado' },
]

interface ShipmentStatusActionsProps {
	shipmentId: string
	currentStatus: string
}

export function ShipmentStatusActions({ shipmentId, currentStatus }: ShipmentStatusActionsProps) {
	const router = useRouter()
	const isDelivered = currentStatus === 'DELIVERED'
	const [status, setStatus] = useState(currentStatus)
	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	function handleUpdate() {
		setError(null)
		setSuccess(false)
		startTransition(async () => {
			const result = await updateShipmentStatusAction(shipmentId, status)
			if (result?.error) {
				setError(result.error)
				return
			}

			setSuccess(true)
			router.refresh()
		})
	}

	if (isDelivered) {
		return (
			<div className="flex min-w-55 flex-col gap-2">
				<span className="inline-flex w-fit rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
					Entregado
				</span>
				<p className="text-xs text-muted-foreground">
					No se puede modificar un envío entregado.
				</p>
			</div>
		)
	}

	return (
		<div className="flex min-w-55 flex-col gap-2">
			<select
				value={status}
				onChange={(e) => {
					setStatus(e.target.value)
					setSuccess(false)
				}}
				disabled={isPending}
				className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
			>
				{STATUSES.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>

			<button
				type="button"
				onClick={handleUpdate}
				disabled={isPending || status === currentStatus}
				className="btn btn-default btn-sm"
			>
				{isPending ? 'Actualizando…' : 'Actualizar'}
			</button>

			{success && <p className="text-xs text-green-600">Estado actualizado.</p>}
			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	)
}