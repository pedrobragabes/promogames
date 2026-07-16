export function AdSlot({ name, format = "leaderboard" }: { name: string; format?: "leaderboard" | "billboard" | "rectangle" }) {
  return (
    <aside className={`ad-slot ad-slot--${format}`} aria-label="Publicidade" data-ad-slot={name} data-ad-format={format}>
      <span>Publicidade</span>
    </aside>
  );
}
