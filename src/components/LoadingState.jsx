import { useEffect, useState } from "react";

const messages = [
  "Analyzing your content...",
  "Extracting key ideas...",
  "Finding the strongest hooks...",
  "Adapting content for each platform...",
  "Creating platform-ready assets..."
];

export function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 1400);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loader" aria-hidden="true" />
      <span>{messages[index]}</span>
    </div>
  );
}
