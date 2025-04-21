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
