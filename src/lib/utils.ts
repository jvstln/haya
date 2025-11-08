import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
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
