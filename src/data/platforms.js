export const platforms = [
  {
    id: "linkedin",
    label: "LinkedIn",
    shortLabel: "LinkedIn",
    description: "Point-of-view post",
    recommended: true
  },
  {
    id: "twitter",
    label: "X/Twitter",
    shortLabel: "X",
    description: "6 to 8 post thread",
    recommended: true
  },
  {
    id: "instagram",
    label: "Instagram",
    shortLabel: "IG",
    description: "Caption and hashtags",
    recommended: true
  },
  {
    id: "video_script",
    label: "Short Video",
    shortLabel: "Video",
    description: "30 to 60 second script",
    recommended: true
  },
  {
    id: "email",
    label: "Email",
    shortLabel: "Email",
    description: "Newsletter draft",
    recommended: true
  },
  {
    id: "blog_summary",
    label: "Blog Summary",
    shortLabel: "Blog",
    description: "SEO summary",
    recommended: false
  },
  {
    id: "hooks",
    label: "Hooks",
    shortLabel: "Hooks",
    description: "Reusable openers",
    recommended: false
  },
  {
    id: "ctas",
    label: "CTAs",
    shortLabel: "CTAs",
    description: "Action prompts",
    recommended: false
  },
  {
    id: "hashtags",
    label: "Hashtags",
    shortLabel: "Tags",
    description: "Social hashtag sets",
    recommended: false
  },
  {
    id: "content_calendar",
    label: "Calendar",
    shortLabel: "Calendar",
    description: "Publishing ideas",
    recommended: false
  }
];

export const defaultPlatformIds = platforms
  .filter((platform) => platform.recommended)
  .map((platform) => platform.id);

export function getPlatformLabel(platformId) {
  return platforms.find((platform) => platform.id === platformId)?.label || platformId;
}
