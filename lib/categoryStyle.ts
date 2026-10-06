// Rotating accent palette used for category badges (blog, portfolio, related posts).
// Solid, saturated backgrounds with white text — always prominent and readable
// regardless of what photo or graphic sits behind the badge.
const palette = [
  { bg: "bg-brand-start", text: "text-white", dot: "bg-white" },
  { bg: "bg-accent-violet", text: "text-white", dot: "bg-white" },
  { bg: "bg-teal-600", text: "text-white", dot: "bg-white" },
  { bg: "bg-amber-600", text: "text-white", dot: "bg-white" },
  { bg: "bg-slate-700", text: "text-white", dot: "bg-white" },
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getCategoryStyle(category: string) {
  const index = hashString(category) % palette.length;
  return palette[index];
}
