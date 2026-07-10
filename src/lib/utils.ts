import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string | null) {
  if (!name) return "";
  
  let initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // If initials doesnt contains only one character
  if (initials.length === 1 && name.length > 1) {
    initials += name[1].toUpperCase();
  }

  return initials;
}

export function truncate(string: string, startLength: number, endLength = 0) {
  if (startLength + endLength >= string.length) return string;

  // const delta = string.length - (startLength + endLength);
  return `${string.slice(0, startLength)}...${string.slice(-endLength)}`;
}

export function toTitleCase(str: string) {
  return str
    .split(/_(?=\w)|(?<=[a-z])(?=[A-Z])/g)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function shuffleArray<T>(arr: T[]) {
  return arr.toSorted(() => Math.random() - 0.5);
}

export function random<T>(min: number | T[] = 0, max = 1) {
  if (Array.isArray(min)) {
    const randomIndex = Math.floor(Math.random() * min.length);
    return min[randomIndex];
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isEmpty(value?: object | null) {
  if (!value) return true;
  return Object.keys(value).length === 0;
}

export function stringToHashedNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export const getPlaceholderArrays = (() => {
  const store: Array<{ id: number }> = [];

  return function getPlaceholderArrays(count: number) {
    if (store.length >= count) return store.slice(0, count);
    for (let i = store.length; i < count; i++) {
      store.push({ id: Math.random() });
    }
    return store.slice(0, count);
  };
})();

export function isMobileDevice(
  userAgent: string,
  viewportWidth: number,
): boolean {
  return (
    userAgent.includes("iPhone") ||
    userAgent.includes("Android") ||
    viewportWidth < 768
  );
}

export * from "./color.util";
export * from "./date.util";
