import type { IconName } from "@/components/icons";

export const navigationLinks: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "/", label: "Início", icon: "home" },
  { href: "/categoria/playstation/", label: "PlayStation", icon: "playstation" },
  { href: "/categoria/xbox/", label: "Xbox", icon: "xbox" },
  { href: "/categoria/nintendo/", label: "Nintendo", icon: "nintendo" },
  { href: "/categoria/pc/", label: "PC", icon: "pc" },
  { href: "/categoria/analise/", label: "Análises", icon: "review" },
  { href: "/categoria/guias/", label: "Guias", icon: "guide" },
  { href: "/categoria/promocao/", label: "Promoções", icon: "deal" },
];
