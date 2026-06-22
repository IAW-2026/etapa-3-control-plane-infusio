import Link from 'next/link'
import { ArrowLeft, BadgeCheck, UsersRound } from 'lucide-react'
import { clerkClient } from '@clerk/nextjs/server'
import {
  clearSystemUserRolesAction,
  deleteSystemUserAction,
  setSystemUserRoleAction,
} from './actions'

type ClerkUser = Awaited<ReturnType<typeof clerkClient>> extends infer Client
  ? Client extends { users: { getUserList: (...args: any[]) => Promise<{ data: UserRecord[] }> } }
    ? UserRecord
    : never
  : never

type PublicMetadata = Record<string, unknown> & {
  roles?: string[] | string | null
}

type UserRecord = {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: Array<{ emailAddress: string }>
  publicMetadata: PublicMetadata
}

function fullName(user: UserRecord) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Sin nombre'
}

function emailAddress(user: UserRecord) {
  return user.emailAddresses[0]?.emailAddress ?? 'Sin email'
}

function getRoleLabel(value: UserRecord['publicMetadata']['roles']) {
  const rawRoles = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []
  const normalizedRoles = rawRoles.map((role) => role.toLowerCase().replace(/\s+/g, '_'))
  return normalizedRoles.length > 0 ? normalizedRoles.join(' · ') : 'Sin rol'
}

async function getClerkUsers() {
  const client = await clerkClient()
  const response = await client.users.getUserList({ limit: 500 })
  return response.data as UserRecord[]
}

function UserCard({ user }: { user: UserRecord }) {
  const roleLabel = getRoleLabel(user.publicMetadata?.roles)

  return (
    <article className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-foreground">{fullName(user)}</p>
          <p className="mt-1 truncate text-sm text-muted-foreground">{emailAddress(user)}</p>
        </div>
        <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {roleLabel}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <BadgeCheck className="h-4 w-4" aria-hidden="true" />
        <span className="font-mono">{user.id}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <form action={setSystemUserRoleAction.bind(null, user.id, 'admin')}>
          <button type="submit" className="btn btn-outline btn-sm">
            Admin
          </button>
        </form>
        <form action={setSystemUserRoleAction.bind(null, user.id, 'buyer')}>
          <button type="submit" className="btn btn-outline btn-sm">
            Buyer
          </button>
        </form>
        <form action={setSystemUserRoleAction.bind(null, user.id, 'seller')}>
          <button type="submit" className="btn btn-outline btn-sm">
            Seller
          </button>
        </form>
        <form action={clearSystemUserRolesAction.bind(null, user.id)}>
          <button type="submit" className="btn btn-outline btn-sm">
            Quitar roles
          </button>
        </form>
        <form action={deleteSystemUserAction.bind(null, user.id)}>
          <button type="submit" className="btn btn-destructive btn-sm">
            Eliminar
          </button>
        </form>
      </div>
    </article>
  )
}

export default async function SystemUsersPage() {
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
          <span>Usuarios del sistema</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-destructive">
          No se pudo obtener la lista de usuarios desde Clerk.
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/shipping" className="hover:text-foreground transition-colors">
          Shipping App
        </Link>
        <span>/</span>
        <span>Usuarios del sistema</span>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Clerk
          </p>
          <h1 className="font-serif text-3xl text-foreground">Usuarios generales del sistema</h1>
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
          label="Usuarios totales"
          value={String(users.length)}
          description="Usuarios recuperados desde Clerk"
          icon={UsersRound}
        />
        <MetricCard
          label="Usuarios con rol"
          value={String(users.filter((user) => getRoleLabel(user.publicMetadata?.roles) !== 'Sin rol').length)}
          description="Usuarios que tienen metadata de roles"
          icon={BadgeCheck}
        />
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium text-foreground">Listado general</h2>
            <p className="text-sm text-muted-foreground">Todos los usuarios sincronizados desde Clerk.</p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {users.length}
          </span>
        </div>

        <div className="max-h-128 space-y-3 overflow-y-auto pr-1">
          {users.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground">
              No hay usuarios disponibles.
            </p>
          ) : (
            users.map((user) => <UserCard key={user.id} user={user} />)
          )}
        </div>
      </section>
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
  icon: typeof UsersRound
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
