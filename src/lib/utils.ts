import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
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

export function random(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
