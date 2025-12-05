import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to merge Tailwind CSS classes using `clsx` and `tailwind-merge`.
 */
export const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs));
};

/**
 * Checks if a variable is empty
 */
export const isEmpty = <T>(value: T): boolean => {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === "string") {
        return value.trim().length === 0;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (value instanceof Map || value instanceof Set) {
        return value.size === 0;
    }
    if (value !== null && typeof value === "object") {
        return Object.keys(value).length === 0;
    }
    return false;
};

// ... other helpers if needed, keeping it minimal for now to match exactly what's used in tmdb.ts
