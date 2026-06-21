import Link from 'next/link'
import {
	ArrowLeft,
	MapPinned,
	PackageCheck,
	Route,
	Truck,
	Users,
} from 'lucide-react'

const shippingAppUrl =
	process.env.SHIPPING_APP_URL ?? 'https://proyecto-c-shipping-infusio.vercel.app'
const shippingApiKey = process.env.SHIPPING_API_KEY!

type ShipmentsResponse = {
	shipments?: Shipment[]
}

type Shipment = {
	id: string
	origin: string
	destination: string
	originDatetime: string
	destinationDatetime: string
	buyerId: string
	sellerId: string
	active: boolean
	deletedAt: string | null
	DeliveryAssignment: Array<{
		id: string
		shipmentId: string
		riderId: string
		logisticOperatorId: string
	}>
	Tracking: Array<{
		shipmentId: string
		orderId: string
		datetime: string
		status: string
		currentCity: string
		nextCity: string
		completed: boolean
		current: boolean
		active: boolean
		deletedAt: string | null
	}>
}

function authHeaders() {
	return { Authorization: `Bearer ${shippingApiKey}` }
}

function statusClass(status: string) {
	switch (status.toUpperCase()) {
		case 'CONFIRMED':
			return 'bg-primary/15 text-primary'
		case 'PREPARING':
			return 'bg-yellow-100 text-yellow-700'
		case 'IN_TRANSIT':
			return 'bg-blue-100 text-blue-700'
		case 'ARRIVED_CITY':
			return 'bg-cyan-100 text-cyan-700'
		case 'OUT_FOR_DELIVERY':
			return 'bg-violet-100 text-violet-700'
		case 'DELIVERED':
			return 'bg-green-100 text-green-700'
		case 'CANCELLED':
			return 'bg-muted text-muted-foreground'
		default:
			return 'bg-muted text-muted-foreground'
	}
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat('es-AR', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(new Date(value))
}

function formatDateOnly(value: string) {
	return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(value))
}

function getLatestTracking(shipment: Shipment) {
	return shipment.Tracking[shipment.Tracking.length - 1]
}

async function getShipments(): Promise<ShipmentsResponse> {
	const res = await fetch(new URL('/api/control-plane/shipments', shippingAppUrl), {
		cache: 'no-store',
		headers: authHeaders(),
	})

	if (!res.ok) {
		throw new Error(`Shipping API ${res.status}`)
	}

	return res.json()
}

export default async function ShippingShipmentsPage() {
	let data: ShipmentsResponse

	try {
		data = await getShipments()
	} catch {
		return (
			<div>
				<div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
					<Link href="/shipping" className="hover:text-foreground transition-colors">
						Shipping App
					</Link>
					<span>/</span>
					<span>Envíos</span>
				</div>

				<div className="rounded-2xl border border-border bg-card p-6 text-sm text-destructive">
					No se pudo conectar con la API de shipping. Verificá que la app esté disponible.
				</div>
			</div>
		)
	}

	const shipments = data.shipments ?? []
	const total = shipments.length
	const activeCount = shipments.filter((shipment) => shipment.active).length
	const assignedCount = shipments.filter((shipment) => shipment.DeliveryAssignment.length > 0).length
	const deliveredCount = shipments.filter((shipment) => getLatestTracking(shipment)?.status === 'DELIVERED').length

	return (
		<div>
			<div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
				<Link href="/shipping" className="hover:text-foreground transition-colors">
					Shipping App
				</Link>
				<span>/</span>
				<span>Envíos</span>
			</div>

			<div className="mb-6 flex items-start justify-between gap-4">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
						Shipping App
					</p>
					<h1 className="font-serif text-3xl text-foreground">Panel de envíos</h1>
				</div>

				<Link
					href="/shipping"
					className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					Volver
				</Link>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					label="Envíos totales"
					value={String(total)}
					description="Registros visibles en el control plane"
					icon={Truck}
				/>
				<MetricCard
					label="Activos"
					value={String(activeCount)}
					description="Envíos que siguen operativos"
					icon={Route}
				/>
				<MetricCard
					label="Asignados"
					value={String(assignedCount)}
					description="Con delivery assignment creado"
					icon={Users}
				/>
				<MetricCard
					label="Entregados"
					value={String(deliveredCount)}
					description="Con tracking finalizado"
					icon={PackageCheck}
				/>
			</div>

			<div className="mt-6 grid gap-6 lg:grid-cols-5">
				<section className="rounded-2xl border border-border bg-card p-6 lg:col-span-5">
					<div className="mb-5 flex items-center justify-between gap-3">
						<div>
							<h2 className="text-lg font-medium text-foreground">Listado de envíos</h2>
							<p className="text-sm text-muted-foreground">
								Información consolidada desde /api/control-plane/shipments.
							</p>
						</div>
						<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
							{total} registros
						</span>
					</div>

					<div className="overflow-hidden rounded-2xl border border-border">
						<div className="max-h-168 overflow-y-auto">
							<table className="w-full text-sm">
								<thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur supports-backdrop-filter:bg-muted/80">
									<tr className="border-b border-border">
										<th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
										<th className="px-4 py-3 text-left font-medium text-muted-foreground">Origen</th>
										<th className="px-4 py-3 text-left font-medium text-muted-foreground">Destino</th>
										<th className="px-4 py-3 text-left font-medium text-muted-foreground">Tracking</th>
										<th className="px-4 py-3 text-left font-medium text-muted-foreground">Asignación</th>
										<th className="px-4 py-3 text-left font-medium text-muted-foreground">Fechas</th>
										<th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
									</tr>
								</thead>
								<tbody>
									{shipments.length === 0 ? (
										<tr>
											<td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
												No hay envíos disponibles.
											</td>
										</tr>
									) : (
										shipments.map((shipment) => {
											const latestTracking = getLatestTracking(shipment)
											const status = latestTracking?.status ?? 'SIN_TRACKING'

											return (
												<tr
													key={shipment.id}
													className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
												>
													<td className="px-4 py-3 align-top">
														<div>
															<p className="font-mono text-xs text-muted-foreground">{shipment.id}</p>
															<p className="mt-1 text-xs text-muted-foreground">
																{shipment.active ? 'Activo' : 'Inactivo'}
															</p>
														</div>
													</td>
													<td className="px-4 py-3 align-top max-w-60">
														<p className="text-foreground">{shipment.origin}</p>
														<p className="mt-1 text-xs text-muted-foreground">{formatDateOnly(shipment.originDatetime)}</p>
													</td>
													<td className="px-4 py-3 align-top max-w-60">
														<p className="text-foreground">{shipment.destination}</p>
														<p className="mt-1 text-xs text-muted-foreground">{formatDateOnly(shipment.destinationDatetime)}</p>
													</td>
													<td className="px-4 py-3 align-top">
														{latestTracking ? (
															<div className="space-y-1">
																<span
																	className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(
																		status,
																	)}`}
																>
																	{status}
																</span>
																<p className="text-xs text-muted-foreground">{latestTracking.currentCity}</p>
																<p className="text-xs text-muted-foreground">
																	{formatDate(latestTracking.datetime)}
																</p>
															</div>
														) : (
															<span className="text-xs text-muted-foreground">Sin tracking</span>
														)}
													</td>
													<td className="px-4 py-3 align-top">
														<div>
															<p className="font-medium text-foreground">{shipment.DeliveryAssignment.length}</p>
															<p className="text-xs text-muted-foreground">asignaciones</p>
														</div>
													</td>
													<td className="px-4 py-3 align-top text-muted-foreground">
														<p>{formatDateOnly(shipment.originDatetime)}</p>
														<p>{formatDateOnly(shipment.destinationDatetime)}</p>
													</td>
													<td className="px-4 py-3 align-top">
														{shipment.active ? (
															<span className="inline-flex rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
																Activo
															</span>
														) : (
															<span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
																Inactivo
															</span>
														)}
													</td>
												</tr>
										)
									})
								)}
							</tbody>
						</table>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

function MetricCard({
	label,
	value,
	description,
	icon: Icon,
}: {
	label: string
	value: string
	description: string
	icon: typeof Truck
}) {
	return (
		<section className="rounded-2xl border border-border bg-card p-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm font-medium text-muted-foreground">{label}</p>
					<p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
				</div>
				<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
					<Icon className="h-5 w-5" aria-hidden="true" />
				</span>
			</div>
			<p className="mt-4 text-sm text-muted-foreground">{description}</p>
		</section>
	)
}
