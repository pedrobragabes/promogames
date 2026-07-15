import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" aria-label="PromoGames — início" className="inline-flex items-center gap-2">
      <span aria-hidden className="relative grid size-9 rotate-3 place-items-center rounded-[10px] bg-brand text-white shadow-[4px_4px_0_#f02f7d]">
        <span className="font-display text-xl font-black">P</span>
      </span>
      {!compact ? (
        <span className="font-display flex flex-col text-[1.05rem] font-black uppercase leading-[0.78] tracking-[-0.055em] text-ink">
          <span>Promo</span>
          <span className="text-brand">Games</span>
        </span>
      ) : null}
    </Link>
  );
}
