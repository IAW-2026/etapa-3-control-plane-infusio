import Link from 'next/link'
import {
	AlertTriangle,
	ArrowLeft,
	BarChart3,
	PackageCheck,
	Truck,
	Users,
} from 'lucide-react'

const shippingAppUrl =
	process.env.SHIPPING_APP_URL ?? 'https://proyecto-c-shipping-infusio.vercel.app'
const shippingApiKey = process.env.SHIPPING_API_KEY!

type DashboardData = {
	stats?: {
		total?: number
		inTransit?: number
		delivered?: number
		incidents?: number
	}
	monthlyShipments?: Array<{
		month: string
		envios: number
	}>
	latestShipments?: Array<{
		code: string
		destination: string
		status: string
		date: string
	}>
	users?: Array<{
		id: string
		name: string
		email: string
	}>
}

function authHeaders() {
	return { Authorization: `Bearer ${shippingApiKey}` }
}

function formatCount(value?: number) {
	return new Intl.NumberFormat('es-AR').format(value ?? 0)
}

function statusClass(status: string) {
	switch (status.toUpperCase()) {
		case 'CONFIRMED':
			return 'bg-primary/15 text-primary'
		case 'DELIVERED':
			return 'bg-green-100 text-green-700'
		case 'IN_TRANSIT':
			return 'bg-blue-100 text-blue-700'
		case 'CANCELLED':
			return 'bg-muted text-muted-foreground'
		case 'INCIDENT':
			return 'bg-red-100 text-red-700'
		default:
			return 'bg-muted text-muted-foreground'
	}
}

async function getDashboard(): Promise<DashboardData> {
	const res = await fetch(new URL('/api/admin/dashboard', shippingAppUrl), {
		cache: 'no-store',
		headers: authHeaders(),
	})

	if (!res.ok) {
		throw new Error(`Shipping API ${res.status}`)
	}

	return res.json()
}

export default async function ShippingMetricsPage() {
	let dashboard: DashboardData

	try {
		dashboard = await getDashboard()
	} catch {
		return (
			<div>
				<div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
					<Link href="/shipping" className="hover:text-foreground transition-colors">
						Shipping App
					</Link>
					<span>/</span>
					<span>Métricas</span>
				</div>

				<div className="rounded-2xl border border-border bg-card p-6 text-sm text-destructive">
					No se pudo conectar con la API de shipping. Verificá que la app esté disponible.
				</div>
			</div>
		)
	}

	const stats = dashboard.stats ?? {}
	const monthlyShipments = dashboard.monthlyShipments ?? []
	const latestShipments = dashboard.latestShipments ?? []
	const recentShipments = latestShipments.slice(0, 10)
	const users = dashboard.users ?? []
	const maxMonthly = Math.max(...monthlyShipments.map((item) => item.envios), 1)

	return (
		<div>
			<div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
				<Link href="/shipping" className="hover:text-foreground transition-colors">
					Shipping App
				</Link>
				<span>/</span>
				<span>Métricas</span>
			</div>

			<div className="mb-6 flex items-start justify-between gap-4">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
						Shipping App
					</p>
					<h1 className="font-serif text-3xl text-foreground">Métricas del dashboard</h1>
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
					value={formatCount(stats.total)}
					description="Acumulado general del módulo"
					icon={Truck}
				/>
				<MetricCard
					label="En tránsito"
					value={formatCount(stats.inTransit)}
					description="Órdenes activas en seguimiento"
					icon={BarChart3}
				/>
				<MetricCard
					label="Entregados"
					value={formatCount(stats.delivered)}
					description="Pedidos finalizados correctamente"
					icon={PackageCheck}
				/>
				<MetricCard
					label="Incidentes"
					value={formatCount(stats.incidents)}
					description="Casos que requieren atención"
					icon={AlertTriangle}
				/>
			</div>

			<div className="mt-6 grid gap-6 lg:grid-cols-5">
				<section className="rounded-2xl border border-border bg-card p-6 lg:col-span-3">
					<div className="mb-5 flex items-center justify-between gap-3">
						<div>
							<h2 className="text-lg font-medium text-foreground">Envíos por mes</h2>
							<p className="text-sm text-muted-foreground">
								Evolución mensual de los envíos registrados.
							</p>
						</div>
						<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
							{monthlyShipments.length} meses
						</span>
					</div>

					<div className="space-y-4">
						{monthlyShipments.length === 0 ? (
							<p className="py-8 text-sm text-muted-foreground">No hay datos mensuales disponibles.</p>
						) : (
							monthlyShipments.map((item) => {
								const width = `${Math.max((item.envios / maxMonthly) * 100, item.envios > 0 ? 12 : 4)}%`

								return (
									<div key={item.month} className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<span className="font-medium text-foreground">{item.month}</span>
											<span className="text-muted-foreground">{formatCount(item.envios)}</span>
										</div>
										<div className="h-2 rounded-full bg-muted overflow-hidden">
											<div
												className="h-full rounded-full bg-primary/80 transition-all"
												style={{ width }}
												aria-hidden="true"
											/>
										</div>
									</div>
								)
							})
						)}
					</div>
				</section>

				<section className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
					<div className="mb-5">
						<h2 className="text-lg font-medium text-foreground">Últimos envíos</h2>
						<p className="text-sm text-muted-foreground">Movimientos más recientes del tablero.</p>
					</div>

					<div className="max-h-136 space-y-4 overflow-y-auto pr-1">
						{recentShipments.length === 0 ? (
							<p className="py-8 text-sm text-muted-foreground">No hay envíos recientes.</p>
						) : (
							recentShipments.map((shipment) => (
								<article key={shipment.code} className="rounded-xl border border-border p-4">
									<div className="mb-3 flex items-start justify-between gap-3">
										<div>
											<p className="font-mono text-xs text-muted-foreground">{shipment.code}</p>
											<p className="mt-1 text-sm font-medium text-foreground">{shipment.destination}</p>
										</div>
										<span
											className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(
												shipment.status,
											)}`}
										>
											{shipment.status}
										</span>
									</div>
									<p className="text-xs text-muted-foreground">{shipment.date}</p>
								</article>
							))
						)}
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
