export type IconName =
  | "home"
  | "playstation"
  | "xbox"
  | "nintendo"
  | "pc"
  | "review"
  | "guide"
  | "deal"
  | "search"
  | "menu"
  | "close";

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, React.ReactNode> = {
    home: <><path {...common} d="m3 10 9-7 9 7" /><path {...common} d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    playstation: <><path {...common} d="M7 18V5c4-1 7 1 7 4 0 2-1 3-3 3V8" /><path {...common} d="M4 16c3-1 5-1 7 0M12 15c4-2 7-2 9-1-2 3-5 4-8 4" /></>,
    xbox: <><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="m7 7 5 5 5-5M6 18l6-6 6 6" /></>,
    nintendo: <><rect {...common} x="4" y="3" width="16" height="18" rx="5" /><path {...common} d="M12 3v18" /><circle cx="8" cy="9" r="1" fill="currentColor" /><circle cx="16" cy="15" r="1" fill="currentColor" /></>,
    pc: <><rect {...common} x="3" y="4" width="18" height="13" rx="2" /><path {...common} d="M8 21h8M12 17v4" /></>,
    review: <path {...common} d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    guide: <><path {...common} d="M4 5c3-1 5 0 8 2v14c-3-2-5-3-8-2V5Z" /><path {...common} d="M20 5c-3-1-5 0-8 2v14c3-2 5-3 8-2V5Z" /></>,
    deal: <><path {...common} d="M20 13 12 21l-9-9V4h8l9 9Z" /><circle cx="8" cy="8" r="1.2" fill="currentColor" /></>,
    search: <><circle {...common} cx="10.5" cy="10.5" r="6.5" /><path {...common} d="m16 16 5 5" /></>,
    menu: <><path {...common} d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <path {...common} d="m5 5 14 14M19 5 5 19" />,
  };

  return <svg aria-hidden viewBox="0 0 24 24" className={className}>{paths[name]}</svg>;
}
