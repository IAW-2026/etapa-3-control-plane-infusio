import Link from 'next/link'
import { Users, Truck, BadgeCheck, ArrowLeft } from 'lucide-react'
import { clerkClient } from '@clerk/nextjs/server'

type ClerkUser = Awaited<ReturnType<typeof clerkClient>> extends infer Client
  ? Client extends { users: { getUserList: (...args: any[]) => Promise<{ data: UserRecord[] }> } }
    ? UserRecord
    : never
  : never

type UserRecord = {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: Array<{ emailAddress: string }>
  publicMetadata: {
    roles?: string[] | string | null
  }
}

const ROLE_ALIASES: Record<string, 'rider' | 'logistic_operator'> = {
  rider: 'rider',
  riders: 'rider',
  repartidor: 'rider',
  repartidores: 'rider',
  driver: 'rider',
  logistic_operator: 'logistic_operator',
  logisticoperator: 'logistic_operator',
  logistic_operator_role: 'logistic_operator',
  operator: 'logistic_operator',
  operators: 'logistic_operator',
  operador: 'logistic_operator',
  operadores: 'logistic_operator',
}

function normalizeRoles(value: UserRecord['publicMetadata']['roles']) {
  const rawRoles = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []
  return rawRoles
    .map((role) => role.toLowerCase().replace(/\s+/g, '_'))
    .map((role) => ROLE_ALIASES[role] ?? null)
    .filter((role): role is 'rider' | 'logistic_operator' => Boolean(role))
}

function fullName(user: UserRecord) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Sin nombre'
}

function emailAddress(user: UserRecord) {
  return user.emailAddresses[0]?.emailAddress ?? 'Sin email'
}

function getRoleLabel(role: 'rider' | 'logistic_operator') {
  return role === 'rider' ? 'Rider' : 'Operador logístico'
}

function UserCard({ user, role }: { user: UserRecord; role: 'rider' | 'logistic_operator' }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-foreground">{fullName(user)}</p>
          <p className="mt-1 truncate text-sm text-muted-foreground">{emailAddress(user)}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            role === 'rider' ? 'bg-blue-100 text-blue-700' : 'bg-primary/15 text-primary'
          }`}
        >
          {getRoleLabel(role)}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <BadgeCheck className="h-4 w-4" aria-hidden="true" />
        <span className="font-mono">{user.id}</span>
      </div>
    </article>
  )
}

async function getClerkUsers() {
  const client = await clerkClient()
  const response = await client.users.getUserList({ limit: 500 })
  return response.data as UserRecord[]
}

export default async function ShippingUsersPage() {
  let users: UserRecord[] = []

  try {
    users = await getClerkUsers()
  } catch {
    return (
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/shipping" className="hover:text-foreground transition-colors">
            Shipping App
          </Link>
          <span>/</span>
          <span>Usuarios</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-destructive">
          No se pudo obtener la lista de usuarios desde Clerk.
        </div>
      </div>
    )
  }

  const classifiedUsers = users
    .map((user) => ({ user, roles: normalizeRoles(user.publicMetadata?.roles) }))
    .filter(({ roles }) => roles.length > 0)

  const riders = classifiedUsers.filter(({ roles }) => roles.includes('rider'))
  const logisticOperators = classifiedUsers.filter(({ roles }) => roles.includes('logistic_operator'))

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/shipping" className="hover:text-foreground transition-colors">
          Shipping App
        </Link>
        <span>/</span>
        <span>Usuarios</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Shipping App
          </p>
          <h1 className="font-serif text-3xl text-foreground">Riders y operadores logísticos</h1>
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
          label="Riders"
          value={String(riders.length)}
          description="Usuarios marcados como repartidores"
          icon={Truck}
        />
        <MetricCard
          label="Operadores logísticos"
          value={String(logisticOperators.length)}
          description="Usuarios marcados como operadores"
          icon={BadgeCheck}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-medium text-foreground">Riders</h2>
              <p className="text-sm text-muted-foreground">Usuarios con rol de repartidor.</p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {riders.length}
            </span>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
            {riders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay riders cargados en Clerk.</p>
            ) : (
              riders.map(({ user }) => <UserCard key={user.id} user={user} role="rider" />)
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-medium text-foreground">Operadores logísticos</h2>
              <p className="text-sm text-muted-foreground">Usuarios con rol de coordinación logística.</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {logisticOperators.length}
            </span>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
            {logisticOperators.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay operadores logísticos cargados en Clerk.
              </p>
            ) : (
              logisticOperators.map(({ user }) => (
                <UserCard key={user.id} user={user} role="logistic_operator" />
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
  icon: typeof Users
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
