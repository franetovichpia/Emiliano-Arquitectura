export type ResourceIcon =
  | "document"
  | "download";

export type ResourceItem = {
  number: string;
  title: string;
  subtitle: string;
  format: string;
  action: string;
  icon: ResourceIcon;
  href: string | null;
};

export const resources: readonly ResourceItem[] = [
  {
    number: "01",
    title: "Territorios en Integración",
    subtitle: "Leyes abusivas y alternativas",
    format: "Documento e investigación",
    action: "Consultar",
    icon: "document",
    href: "https://onedrive.live.com/?cid=112313fa9482f324&id=112313FA9482F324%21s449b94c1560c407585370ed121b2b471&resid=112313FA9482F324%21s449b94c1560c407585370ed121b2b471&ithint=folder&e=cNVSko&migratedtospo=true&redeem=aHR0cHM6Ly8xZHJ2Lm1zL2YvYy8xMTIzMTNmYTk0ODJmMzI0L0lnREJsSnRFREZaMVFJVTNEdEVoc3JSeEFhUlRoUWFoR3BlY1lHb1MyREduTldzP2U9Y05WU2tv&v=validatepermission",
  },
  {
    number: "02",
    title: "Superadobe",
    subtitle: "Descargar recursos",
    format: "Autoconstrucción",
    action: "Descargar",
    icon: "download",
    href: "https://www.dropbox.com/scl/fo/1gxd4cb1einslr0vv006e/AM7yMAvroaR9YXRUdGqgKwU?rlkey=f3uy5t9mhk8nrt39rbihd842g&st=i0esiw14&dl=0",
  },
];