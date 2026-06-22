import { SiteHeader } from "@/app/ui/site-header"
import { AppsPanel } from "@/app/ui/apps-panel"

export default function Page() {
  return (
    <main className="min-h-svh flex flex-col">
      <SiteHeader />

      <div className="mx-auto grid flex-1 max-w-6xl items-center gap-10 px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-16 lg:grid-cols-2 lg:gap-16">
        <section className="flex max-w-3xl flex-col pt-2 sm:pt-4 lg:self-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-primary sm:text-sm">
            Control Panel
          </p>
          <h1 className="font-serif text-[3rem] leading-[0.92] tracking-[-0.03em] text-foreground text-balance sm:text-[3.95rem] md:text-[4.7rem] lg:text-[5.4rem]">
            <span className="block">Tu operación,</span>
            <span className="block">bajo control.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[0.97rem] leading-8 text-muted-foreground sm:text-[1.05rem]">
            Ingresá a tu cuenta y gestioná todas tus apps desde un único panel.
          </p>
        </section>

        <div className="lg:pl-4">
          <AppsPanel />
        </div>
      </div>
    </main>
  )
}
