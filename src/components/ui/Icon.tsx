import type { SVGProps } from "react";

export type IconName = "menu" | "search" | "bell" | "chevronDown" | "logout" | "plus" | "arrowRight" | "arrowUpRight" | "close" | "dashboard" | "user" | "clock" | "sales" | "purchase" | "warehouse" | "finance" | "factory" | "team" | "store" | "projects" | "reports" | "settings" | "trend" | "profit" | "order" | "alert" | "wallet";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; size?: number; title?: string };

export function Icon({ name, size = 18, title, ...props }: IconProps) {
  const common = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.8 };
  const paths: Record<IconName, JSX.Element> = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    search: <><circle cx="10.8" cy="10.8" r="5.8" /><path d="m15.2 15.2 4.2 4.2" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 22h4" /></>,
    chevronDown: <path d="m7 10 5 5 5-5" />,
    logout: <><path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5" /><path d="m14 8 4 4-4 4M18 12H8" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    arrowRight: <path d="M5 12h14m-5-5 5 5-5 5" />,
    arrowUpRight: <path d="M7 17 17 7M9 7h8v8" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    dashboard: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    user: <><circle cx="12" cy="8" r="3.3" /><path d="M5.5 20c.7-3.4 3-5.2 6.5-5.2s5.8 1.8 6.5 5.2" /></>,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3.5 2" /></>,
    sales: <><path d="M4 19V9m5 10V5m5 14v-8m5 8V7" /><path d="m4 6 4-3 4 3 7-3" /></>,
    purchase: <><path d="M4 6h15l-1 9H7L5 4H2" /><circle cx="8" cy="19" r="1" /><circle cx="17" cy="19" r="1" /></>,
    warehouse: <><path d="m3 10 9-6 9 6v10H3z" /><path d="M3 10h18M8 14h8M8 18h8" /></>,
    finance: <><path d="M7 4h10M7 20h10M12 3v18" /><path d="M15.5 8.3c-.6-.8-1.6-1.3-3-1.3-2 0-3.2 1-3.2 2.4 0 3.8 6.2 1.5 6.2 5.1 0 1.4-1.2 2.5-3.4 2.5-1.5 0-2.7-.5-3.5-1.5" /></>,
    factory: <><path d="M3 20V10l6 3V9l6 3V5h6v15z" /><path d="M7 20v-3m5 3v-3m5 3v-3" /></>,
    team: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.3" /><path d="M3.5 20c.6-3.5 2.4-5.3 5.5-5.3s4.9 1.8 5.5 5.3M15 15c2.8.1 4.4 1.7 5 4.5" /></>,
    store: <><path d="M4 10h16v10H4zM3 10l2-6h14l2 6" /><path d="M8 14h4v6M15 14h2" /></>,
    projects: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M8 12h8M8 16h5" /></>,
    reports: <><path d="M5 20V10m5 10V5m5 15v-7m5 7V8" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.5 2.5-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.6v.2h-3.5v-.2a1.8 1.8 0 0 0-1.1-1.6 1.8 1.8 0 0 0-2 .4l-.1.1L5 17.1l.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.6-1.1h-.2v-3.5h.2A1.8 1.8 0 0 0 5.5 9a1.8 1.8 0 0 0-.4-2L5 6.9 7.5 4.4l.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1.1-1.6v-.2h3.5v.2A1.8 1.8 0 0 0 15.3 5a1.8 1.8 0 0 0 2-.4l.1-.1L20 7l-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.6 1.1h.2v3.5h-.2a1.8 1.8 0 0 0-1.7 1.3Z" /></>,
    trend: <><path d="M4 17 10 11l4 4 6-8" /><path d="M15 7h5v5" /></>,
    profit: <><path d="m12 3 2.2 5 5.4.5-4.1 3.6 1.2 5.3-4.7-2.8-4.7 2.8 1.2-5.3-4.1-3.6L9.8 8z" /></>,
    order: <><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
    alert: <><path d="M12 4 21 20H3z" /><path d="M12 9v5m0 3h.01" /></>,
    wallet: <><path d="M4 7a3 3 0 0 1 3-3h11v16H7a3 3 0 0 1-3-3z" /><path d="M4 8h15a2 2 0 0 1 2 2v5h-5a2.5 2.5 0 0 1 0-5h5" /><circle cx="16" cy="12.5" r=".7" fill="currentColor" stroke="none" /></>,
  };
  return <svg aria-hidden={title ? undefined : true} aria-label={title} viewBox="0 0 24 24" width={size} height={size} {...common} {...props}>{title ? <title>{title}</title> : null}{paths[name]}</svg>;
}
