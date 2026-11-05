type MarkProps = { width: number; height: number };

export function MotivoMark({ width, height }: MarkProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 119.06 31.18" aria-hidden="true">
      <circle fill="#ED1C24" cx="72.08" cy="5.41" r="3.4" />
      <path fill="#fff" d="M41,4.62A11.84,11.84,0,1,0,52.86,16.46,11.84,11.84,0,0,0,41,4.62ZM41,21.7a5.25,5.25,0,1,1,5.24-5.24A5.24,5.24,0,0,1,41,21.7Z" />
      <polygon fill="#fff" points="79.73 6.35 90.83 6.35 85.28 20.09 79.73 6.35" />
      <path fill="#fff" d="M102.71,6.29a11.66,11.66,0,0,0-5.55,1.4L91.39,21A11.72,11.72,0,1,0,102.71,6.29Zm0,16.83A5.12,5.12,0,1,1,107.83,18,5.12,5.12,0,0,1,102.71,23.12Z" />
      <path fill="#fff" d="M65.91,6.29H49.84a13.78,13.78,0,0,1,4.38,6.37H65.91Z" />
      <path fill="#fff" d="M55.93,2.76h0a6.37,6.37,0,0,1,6.37,6.37V20.3a0,0,0,0,1,0,0H55.93a0,0,0,0,1,0,0V2.76A0,0,0,0,1,55.93,2.76Z" />
      <path fill="#fff" d="M62,11.13a9.64,9.64,0,1,0,13.23,9H68.85a3.28,3.28,0,0,1-6.55-.06Z" />
      <path fill="#fff" d="M68.84,9.07V20.3h6.38V9.24a4.46,4.46,0,0,1-6.38-.17Z" />
      <polygon fill="#fff" points="16.05 23.13 13.54 15.19 20.23 5.5 28.02 5.54 16.05 23.13" />
      <path fill="#fff" d="M28,28.81h0l0-23.31H21.55l0,16.94A6.38,6.38,0,0,0,28,28.81Z" />
      <polygon fill="#fff" points="15.98 23.13 18.49 15.19 11.8 5.5 4.02 5.54 15.98 23.13" />
      <path fill="#fff" d="M4.07,28.81h0l0-23.31h6.37l0,16.94A6.38,6.38,0,0,1,4.07,28.81Z" />
    </svg>
  );
}

export function FolderGlyph({ tag, large }: { tag: string; large?: boolean }) {
  return (
    <svg
      width={large ? 68 : 58}
      height={large ? 56 : 48}
      viewBox="0 0 64 52"
      aria-hidden="true"
    >
      <path d="M2 8a4 4 0 0 1 4-4h16l6 6h30a4 4 0 0 1 4 4v32a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill="#3A3934" />
      <path d="M2 16a4 4 0 0 1 4-4h52a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill="#ECEAE2" />
      <rect x="8" y="40" width="12" height="3" rx="1.5" fill={tag} />
    </svg>
  );
}

export function FileGlyph({ tag }: { tag: string }) {
  return (
    <svg width="68" height="56" viewBox="0 0 64 52" aria-hidden="true">
      <rect x="4" y="6" width="56" height="40" rx="4" fill="#1C1B19" stroke="rgba(245,245,240,0.35)" />
      <path d="M27 18v16l13-8z" fill="#F5F5F0" />
      <rect x="4" y="40" width="56" height="6" fill={tag} />
    </svg>
  );
}

export function PictureIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="M21 16l-5-5-9 9" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M6 4.5v9l8-4.5z" fill="currentColor" />
    </svg>
  );
}

export function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function WorksIcon({ small }: { small?: boolean }) {
  const size = small ? 22 : 24;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </svg>
  );
}

export function AboutIcon({ small }: { small?: boolean }) {
  const size = small ? 22 : 24;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.01" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6l8.5 7 8.5-7" />
    </svg>
  );
}

export function WhatsAppIcon({ small }: { small?: boolean }) {
  const size = small ? 22 : 24;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.4-1.42a10.1 10.1 0 0 0 4.64 1.12h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.9c-.24.68-1.4 1.25-1.93 1.33-.49.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.63-.61-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.15-1.53-1.15-2.92s.73-2.07 1-2.35c.24-.28.64-.41 1.02-.41.12 0 .23 0 .33.01.3.01.44.03.64.49.24.58.82 2 .89 2.15.07.14.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.56.16.28.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.26.09 1.62.76 1.9.9.28.14.46.21.53.32.07.12.07.68-.17 1.36z"
      />
    </svg>
  );
}

export function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.5 8a5.5 5.5 0 1 1-1.4-3.7" />
      <path d="M13.6 2.8v3.2H10.4" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
