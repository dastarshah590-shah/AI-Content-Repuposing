export const brandColors = {
  linkedin: "#0A66C2",
  x: "#111111",
  twitter: "#111111",
  instagram: "#D62976",
  facebook: "#1877F2",
  youtube: "#FF0033",
  notion: "#111111",
  google_docs: "#4285F4",
  airtable: "#F82B60",
  wordpress: "#21759B",
  buffer: "#111111",
  hootsuite: "#003265",
  zapier: "#FF4F00"
};

export function getBrandColor(id) {
  return brandColors[id] || "#176F52";
}