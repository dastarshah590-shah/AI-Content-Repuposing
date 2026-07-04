import {
  CalendarDays,
  FileText,
  Hash,
  Mail,
  MessageSquareQuote,
  PenLine,
  Video,
  Workflow
} from "lucide-react";

function SvgLogo({ label, children, viewBox = "0 0 32 32", tone = "brand", color = "currentColor" }) {
  return (
    <svg
      className={`brand-logo brand-logo-${tone}`}
      viewBox={viewBox}
      role="img"
      aria-label={label}
      focusable="false"
    >
      <g fill={color}>{children}</g>
    </svg>
  );
}

export function AppLogoSymbol() {
  return (
    <svg className="app-logo-symbol" viewBox="0 0 64 64" role="img" aria-label="RepurposeAI logo">
      <defs>
        <linearGradient id="repurposeGradient" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#176F52" />
          <stop offset="0.52" stopColor="#276A9F" />
          <stop offset="1" stopColor="#E85F49" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="12" fill="url(#repurposeGradient)" />
      <path d="M20 21.5h17.8c6.2 0 10.2 3.4 10.2 8.9 0 4.4-2.5 7.5-6.5 8.6l7.2 9H38.4l-6.3-8.2h-3.7V48H20V21.5Zm8.4 7.2v4.7h8.5c1.7 0 2.8-.9 2.8-2.4s-1.1-2.3-2.8-2.3h-8.5Z" fill="#fff" />
      <path d="M16 16.5c5.8-4.2 14.8-4.9 22.3-1.4" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.78" />
      <path d="M48.5 17.8l-1.3 3.1 3.1 1.3-3.1 1.3 1.3 3.1-3.1-1.3-1.3 3.1-1.3-3.1-3.1 1.3 1.3-3.1-3.1-1.3 3.1-1.3-1.3-3.1 3.1 1.3 1.3-3.1 1.3 3.1 3.1-1.3Z" fill="#FFF6D7" />
    </svg>
  );
}

function LinkedinLogo() {
  return (
    <SvgLogo label="LinkedIn logo" color="#0A66C2">
      <path d="M6.8 4.7A3.8 3.8 0 1 1 6.8 12.3 3.8 3.8 0 0 1 6.8 4.7ZM3.9 14h5.8v14H3.9V14Zm8.7 0h5.5v1.9h.1c.8-1.4 2.7-2.3 5-2.3 5.3 0 6.3 3.1 6.3 7.8V28h-5.8v-6.2c0-2.2-.8-3.5-2.8-3.5-2.1 0-2.9 1.3-2.9 3.6V28h-5.8V14Z" />
    </SvgLogo>
  );
}

function XLogo() {
  return (
    <SvgLogo label="X logo" color="#111111">
      <path d="M4 5h7.4l6 7.9L24.5 5H28l-8.9 9.9L28.8 28h-7.4l-6.6-8.7L7 28H3.5l9.6-10.7L4 5Zm5.6 2.7 13.2 17.6h2.3L11.9 7.7H9.6Z" />
    </SvgLogo>
  );
}

function InstagramLogo() {
  return (
    <SvgLogo label="Instagram logo" tone="gradient" color="none">
      <defs>
        <linearGradient id="igGradient" x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset="0.35" stopColor="#FA7E1E" />
          <stop offset="0.62" stopColor="#D62976" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="24" height="24" rx="7" fill="url(#igGradient)" />
      <circle cx="16" cy="16" r="5.3" fill="none" stroke="#fff" strokeWidth="2.2" />
      <circle cx="23" cy="9" r="1.8" fill="#fff" />
    </SvgLogo>
  );
}

function FacebookLogo() {
  return (
    <SvgLogo label="Facebook logo" color="#1877F2">
      <path d="M18.5 28V17.4h3.6l.7-4.4h-4.3v-2.8c0-1.2.6-2.4 2.5-2.4h2V4.1c-.4-.1-1.8-.3-3.5-.3-3.6 0-6 2.2-6 6.1V13H9.6v4.4h3.9V28h5Z" />
    </SvgLogo>
  );
}

function YouTubeLogo() {
  return (
    <SvgLogo label="YouTube logo" color="#FF0033">
      <path d="M29 10.2a4 4 0 0 0-2.8-2.8C23.7 6.7 16 6.7 16 6.7s-7.7 0-10.2.7A4 4 0 0 0 3 10.2 41.8 41.8 0 0 0 2.3 16c0 2 .2 4 .7 5.8a4 4 0 0 0 2.8 2.8c2.5.7 10.2.7 10.2.7s7.7 0 10.2-.7a4 4 0 0 0 2.8-2.8c.5-1.8.7-3.8.7-5.8s-.2-4-.7-5.8ZM13.3 20.2v-8.4l7.3 4.2-7.3 4.2Z" />
    </SvgLogo>
  );
}

function NotionLogo() {
  return (
    <SvgLogo label="Notion logo" color="#111111">
      <path d="M6 5.5 21.2 4l4.8 3.5v18.8L10.7 28 6 24.6V5.5Zm5.1 4.2v13.8l9.7-.8V9.1l-9.7.6Zm1.8 2.1h2.9l4.4 7.1v-5.5l-1.6-.2v-1.3l4.4-.3v1.3l-1.2.4v8.3l-2.1.2-5.2-8.1v6.5l1.8.3v1.3l-4.8.4v-1.4l1.4-.4v-8.6Z" />
    </SvgLogo>
  );
}

function GoogleDocsLogo() {
  return (
    <SvgLogo label="Google Docs logo" color="none">
      <path d="M9 3h10l6 6v20H9V3Z" fill="#4285F4" />
      <path d="M19 3v6h6" fill="#AECBFA" />
      <path d="M13 15h9v2H13v-2Zm0 4h9v2H13v-2Zm0 4h6v2h-6v-2Z" fill="#fff" />
    </SvgLogo>
  );
}

function AirtableLogo() {
  return (
    <SvgLogo label="Airtable logo" color="none">
      <path d="M15.1 4.4 4.6 8.7c-.8.3-.8 1.5 0 1.8l10.5 4.3c.6.2 1.2.2 1.8 0l10.5-4.3c.8-.3.8-1.5 0-1.8L16.9 4.4c-.6-.2-1.2-.2-1.8 0Z" fill="#FCB400" />
      <path d="m14.1 17.2-9.7-4v9.4c0 .4.2.7.6.9l9.1 3.8V17.2Z" fill="#18BFFF" />
      <path d="m17.9 17.2 9.7-4v9.4c0 .4-.2.7-.6.9l-9.1 3.8V17.2Z" fill="#F82B60" />
    </SvgLogo>
  );
}

function WordPressLogo() {
  return (
    <SvgLogo label="WordPress logo" color="#21759B">
      <path d="M16 3.5A12.5 12.5 0 1 0 16 28.5 12.5 12.5 0 0 0 16 3.5Zm-10 12.5c0-1.45.3-2.82.84-4.06l4.77 13.06A10 10 0 0 1 6 16Zm10 10c-.98 0-1.92-.14-2.81-.4l3-8.72 3.07 8.4c.02.05.05.1.08.14-1.03.38-2.15.58-3.34.58Zm1.38-14.7c.6-.03 1.15-.1 1.15-.1.54-.07.48-.86-.06-.83 0 0-1.63.13-2.68.13-.98 0-2.64-.13-2.64-.13-.54-.03-.6.8-.06.83 0 0 .51.07 1.05.1l1.56 4.28-2.2 6.6-3.66-10.93c.6-.03 1.15-.1 1.15-.1.54-.07.47-.86-.07-.83 0 0-1.62.13-2.67.13-.18 0-.39 0-.62-.02A10 10 0 0 1 16 6c2.47 0 4.72.9 6.46 2.38h-.13c-.98 0-1.68.86-1.68 1.78 0 .83.48 1.53.99 2.36.38.67.83 1.53.83 2.78 0 .86-.33 1.86-.77 3.26l-1 3.35-3.32-10.61Zm7.62 13.08 3.05-8.82c.57-1.43.76-2.57.76-3.57 0-.36-.02-.7-.07-1.02A9.96 9.96 0 0 1 26 16c0 3.12-1.43 5.9-3.68 7.73Z" />
    </SvgLogo>
  );
}

function BufferLogo() {
  return (
    <SvgLogo label="Buffer logo" color="#111111">
      <path d="M16 4 29 10.7 16 17.4 3 10.7 16 4Zm0 9.9 7.8-4L16 6 8.2 10l7.8 3.9Zm-9.6 2.3L16 21l9.6-4.8 3.4 1.7L16 24.6 3 17.9l3.4-1.7Zm0 6.2L16 27.2l9.6-4.8 3.4 1.7L16 30.8 3 24.1l3.4-1.7Z" />
    </SvgLogo>
  );
}

function ZapierLogo() {
  return (
    <SvgLogo label="Zapier logo" color="#FF4F00">
      <path d="M14.1 3h3.8v9.5l6.7-6.7 2.7 2.7-6.7 6.7H30v3.8h-9.4l6.7 6.7-2.7 2.7-6.7-6.7V31h-3.8v-9.3l-6.7 6.7-2.7-2.7 6.7-6.7H2v-3.8h9.4L4.7 8.5l2.7-2.7 6.7 6.7V3Z" />
    </SvgLogo>
  );
}

function HootsuiteLogo() {
  return (
    <SvgLogo label="Hootsuite logo" color="#003265">
      <path d="M9 5h14v5h3v8c0 5.2-4.5 9-10 9S6 23.2 6 18v-8h3V5Zm3 4v4H9v5c0 3.7 3 6.5 7 6.5s7-2.8 7-6.5v-5h-3V9h-8Zm.5 7.5A2.5 2.5 0 1 1 15 19a2.5 2.5 0 0 1-2.5-2.5Zm7 0A2.5 2.5 0 1 1 22 19a2.5 2.5 0 0 1-2.5-2.5Z" />
    </SvgLogo>
  );
}

function GenericPlatformIcon({ id }) {
  const iconProps = { size: 22, strokeWidth: 2.2 };
  const Icon = {
    video_script: Video,
    email: Mail,
    blog_summary: FileText,
    hooks: MessageSquareQuote,
    ctas: PenLine,
    hashtags: Hash,
    content_calendar: CalendarDays
  }[id] || Workflow;

  return <Icon {...iconProps} />;
}

export function PlatformLogo({ id }) {
  const Logo = {
    linkedin: LinkedinLogo,
    twitter: XLogo,
    instagram: InstagramLogo,
    facebook: FacebookLogo,
    youtube_description: YouTubeLogo
  }[id];

  return Logo ? <Logo /> : <GenericPlatformIcon id={id} />;
}

export function IntegrationLogo({ id }) {
  const Logo = {
    linkedin: LinkedinLogo,
    x: XLogo,
    instagram: InstagramLogo,
    facebook: FacebookLogo,
    youtube: YouTubeLogo,
    notion: NotionLogo,
    google_docs: GoogleDocsLogo,
    airtable: AirtableLogo,
    wordpress: WordPressLogo,
    buffer: BufferLogo,
    hootsuite: HootsuiteLogo,
    zapier: ZapierLogo
  }[id];

  return Logo ? <Logo /> : <Workflow size={22} strokeWidth={2.2} />;
}

