export type ProfessionalLinkIcon =
  | "linkedin"
  | "portfolio"
  | "facebook";

export type ProfessionalLink = {
  label: string;
  description: string;
  icon: ProfessionalLinkIcon;
  href: string | null;
};

export const professionalLinks: readonly ProfessionalLink[] = [
  {
    label: "LinkedIn",
    description: "Trayectoria laboral",
    icon: "linkedin",
    href: "https://www.linkedin.com/in/emilianobim/",
  },
  {
    label: "Behance",
    description: "Portfolio profesional",
    icon: "portfolio",
    href: "https://www.behance.net/emilianobim",
  },
  {
    label: "Facebook",
    description: "Contacto",
    icon: "facebook",
    href: "https://www.facebook.com/profile.php?id=100085397250330",
  },
];