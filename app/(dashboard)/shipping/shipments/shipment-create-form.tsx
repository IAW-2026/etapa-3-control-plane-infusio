'use client'

import { useState, useTransition } from 'react'

import { createShipmentAction } from './actions'

export function ShipmentCreateForm() {
	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	function handleSubmit(formData: FormData) {
		setError(null)
		setSuccess(false)
		startTransition(async () => {
			const result = await createShipmentAction(formData)
			if (result?.error) {
				setError(result.error)
				return
			}

			setSuccess(true)
		})
	}

	return (
		<section className="rounded-2xl border border-border bg-card p-6 lg:col-span-5">
			<div className="mb-5">
				<h2 className="text-lg font-medium text-foreground">Crear nuevo envío</h2>
			</div>

			<form action={handleSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				<label className="flex flex-col gap-2">
					<span className="text-sm text-muted-foreground">Order ID</span>
					<input
						name="order_id"
						required
						placeholder="ORDER-101056"
						className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
					/>
				</label>

				<label className="flex flex-col gap-2">
					<span className="text-sm text-muted-foreground">Seller ID</span>
					<input
						name="seller_id"
						required
						placeholder="user_..."
						className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
					/>
				</label>

				<label className="flex flex-col gap-2">
					<span className="text-sm text-muted-foreground">Buyer ID</span>
					<input
						name="buyer_id"
						required
						placeholder="user_..."
						className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
					/>
				</label>

				<label className="flex flex-col gap-2 md:col-span-2 xl:col-span-3">
					<span className="text-sm text-muted-foreground">Origen - dirección</span>
					<input
						name="origin_address_address"
						required
						placeholder="Santiago del Estero 685, Bahía Blanca, Buenos Aires, Argentina"
						className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
					/>
				</label>

				<label className="flex flex-col gap-2">
					<span className="text-sm text-muted-foreground">Origen - código postal</span>
					<input
						name="origin_address_postal_code"
						required
						placeholder="8000"
						className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
					/>
				</label>

				<label className="flex flex-col gap-2 md:col-span-2 xl:col-span-3">
					<span className="text-sm text-muted-foreground">Destino - dirección</span>
					<input
						name="destination_address_address"
						required
						placeholder="Av. Alem 1015, Bahía Blanca, Buenos Aires, Argentina"
						className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
					/>
				</label>

				<label className="flex flex-col gap-2">
					<span className="text-sm text-muted-foreground">Destino - código postal</span>
					<input
						name="destination_address_postal_code"
						required
						placeholder="8000"
						className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
					/>
				</label>

				<div className="md:col-span-2 xl:col-span-3 flex flex-col gap-3">
					<button
						type="submit"
						disabled={isPending}
						className="btn btn-default btn-sm w-full md:w-fit"
					>
						{isPending ? 'Creando…' : 'Crear envío'}
					</button>

					{success && <p className="text-sm text-green-600">Envío creado correctamente.</p>}
					{error && <p className="text-sm text-destructive">{error}</p>}
				</div>
			</form>
		</section>
	)
}