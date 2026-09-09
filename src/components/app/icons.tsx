type IconProps = { className?: string };

const base = "h-[18px] w-[18px]";

export function IconHome({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function IconTarget({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
export function IconBook({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" strokeLinejoin="round" />
      <path d="M4 18.5V5.5" strokeLinecap="round" />
    </svg>
  );
}
export function IconTrophy({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" strokeLinejoin="round" />
      <path d="M7 5H4v1a4 4 0 0 0 4 4M17 5h3v1a4 4 0 0 1-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14v3M9 20.5h6M9.5 20.5 10 17h4l.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function IconTimer({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2M10 2h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function IconCalendar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" strokeLinecap="round" />
    </svg>
  );
}
export function IconRefresh({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <path d="M4 12a8 8 0 0 1 13.66-5.66L20 8.5M20 12a8 8 0 0 1-13.66 5.66L4 15.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 4.5v4h-4M4 19.5v-4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function IconChart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <path d="M4 20V4M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 17V11M12 17V7M16.5 17v-5.5" strokeLinecap="round" />
    </svg>
  );
}
export function IconMap({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}
export function IconSettings({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <circle cx="12" cy="12" r="3" />
      <path
        strokeLinecap="round"
        d="M12 3v2.2M12 18.8V21M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M3 12h2.2M18.8 12H21M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"
      />
    </svg>
  );
}
export function IconFlame({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base}>
      <path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1-.5-2-1-2.5 2 .5 4 3 4 6a6 6 0 0 1-12 0c0-5 3-6 6-11.5Z" />
    </svg>
  );
}
export function IconBolt({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}
export function IconVideo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <rect x="3" y="6" width="13" height="12" rx="2" strokeLinejoin="round" />
      <path d="m16 10 5-3v10l-5-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function IconSparkles({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? base}>
      <path d="M11 3c.4 2.7 1.3 4.4 2.9 5.6 1.4 1 3.1 1.4 5.1 1.4-2 0-3.7.4-5.1 1.4C12.3 12.6 11.4 14.3 11 17c-.4-2.7-1.3-4.4-2.9-5.6C6.7 10.4 5 10 3 10c2 0 3.7-.4 5.1-1.4C9.7 7.4 10.6 5.7 11 3Z" />
      <path d="M18.5 15c.2 1.4.7 2.3 1.6 2.9.7.5 1.6.7 2.4.7-.9 0-1.7.2-2.4.7-.9.6-1.4 1.5-1.6 2.9-.2-1.4-.7-2.3-1.6-2.9-.7-.5-1.6-.7-2.4-.7.9 0 1.7-.2 2.4-.7.9-.6 1.4-1.5 1.6-2.9Z" />
    </svg>
  );
}
export function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className ?? base}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" strokeLinejoin="round" />
    </svg>
  );
}
