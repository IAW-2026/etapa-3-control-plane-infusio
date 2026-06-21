import { Sidebar } from './ui/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background px-8 py-10">
        {children}
      </main>
    </div>
  )
}
