import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * This is a helper function to combine tailwind classes with clsx
 * @param inputs
 * @returns {string}
 * @example
 * const variantClasses = {
 *   default: "bg-gray-100 text-gray-800",
 *   success: "bg-green-100 text-green-800",
 *   error: "bg-red-100 text-red-800",
 * }
 * cn(
 *   "bg-gray-100 text-gray-800",
 *   variantClasses[variant || "default"],
 *   Platform.select({
 *     ios: "py-3",
 *     android: "py-2",
 *   })
 *   className
 * )
 * @see https://tailwindcss.com/docs/merge-classnames
 * @see https://github.com/lukeed/clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getChangedFields<T extends object>(
  original: T,
  updated: Partial<T>
): Partial<T> {
  const changes: Partial<T> = {};

  for (const key in updated) {
    if (Object.prototype.hasOwnProperty.call(updated, key)) {
      const originalValue = original[key];
      const updatedValue = updated[key];

      // Comparación profunda para objetos/arrays
      if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
        changes[key] = updatedValue;
      }
    }
  }

  return changes;
}

export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return color;
}
