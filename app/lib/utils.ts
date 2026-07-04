import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateInput: Date | string | number) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 45) {
    return diffSeconds >= 0 ? "in a few seconds" : "just now";
  }

  let unit: Intl.RelativeTimeFormatUnit = "second";
  let unitSeconds = 1;

  if (absSeconds < 60) {
    unit = "second";
    unitSeconds = 1;
  } else if (absSeconds < 3600) {
    unit = "minute";
    unitSeconds = 60;
  } else if (absSeconds < 86400) {
    unit = "hour";
    unitSeconds = 3600;
  } else if (absSeconds < 604800) {
    unit = "day";
    unitSeconds = 86400;
  } else if (absSeconds < 2629800) {
    unit = "week";
    unitSeconds = 604800;
  } else if (absSeconds < 31557600) {
    unit = "month";
    unitSeconds = 2629800;
  } else {
    unit = "year";
    unitSeconds = 31557600;
  }

  const value = Math.round(diffSeconds / unitSeconds);

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return formatter.format(value, unit);
}

export function formatViews(views?: number) {
  if (views === undefined) return "0";
  if (views < 1000) return `${views}`;
  if (views < 1_000_000)
    return `${(views / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
}

export function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export const generateArticleSlug = (title: string, id: string): string => {
  if (!title) return "untitled-post";

  const slug = title
    .toLowerCase()
    .replace(/’/g, "'") // normalize curly apostrophes
    .replace(/(\w)'s\b/g, "$1") // remove possessive 's
    .replace(/'/g, "") // remove any remaining apostrophes
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumerics with hyphen
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens

  const blogSlug = `${slug}-${id}`;
  return blogSlug;
};


export const purifyHTMLString = (dirtyString: string) => {
  let cleanString = DOMPurify.sanitize(dirtyString, {
    USE_PROFILES: { html: false },
  });

  cleanString = cleanString.replace(/\\u0026/g, '&');

  cleanString = cleanString.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');

  return cleanString;
};
