export const tones = [
  "professional",
  "friendly",
  "bold",
  "educational",
  "witty",
  "persuasive",
  "inspirational",
  "casual",
  "founder-style",
  "agency-style"
];

export function formatToneLabel(tone) {
  return tone
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
