import Link from "next/link";
import { Icon } from "@/components/icons";
import { Brand } from "./brand";
import { MobileHeader } from "./mobile-header";
import { navigationLinks } from "./navigation-data";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col border-r border-line bg-surface px-5 py-7 lg:flex">
        <Brand />
        <nav aria-label="Navegação principal" className="mt-9 space-y-1">
          {navigationLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-[0.92rem] font-bold transition hover:bg-canvas hover:text-brand ${index === 0 ? "bg-canvas text-brand" : "text-muted"}`}
            >
              <Icon name={link.icon} className="size-[1.15rem] transition group-hover:scale-110" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-7 border-t border-line pt-7">
          <Link
            href="/buscar/"
            className="flex min-h-11 items-center gap-3 rounded-xl border border-line px-3 text-sm font-semibold text-muted transition hover:border-brand hover:text-brand"
          >
            <Icon name="search" className="size-[1.15rem]" />
            Buscar no PromoGames
          </Link>
        </div>
        <div className="mt-auto">
          <div className="rounded-card bg-ink p-4 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-lilac">Checkpoint</p>
            <p className="mt-2 text-sm font-semibold leading-5">As notícias que importam, uma vez por semana.</p>
            <a href="#newsletter" className="mt-4 inline-flex text-xs font-black text-white underline underline-offset-4">
              Entrar na lista
            </a>
          </div>
          <p className="mt-5 text-xs text-muted">© {new Date().getFullYear()} PromoGames</p>
        </div>
      </aside>
      <div className="min-w-0 lg:col-start-2">
        <MobileHeader />
        {children}
      </div>
    </div>
  );
}
