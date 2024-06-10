import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function daysBetween(
    date1: string | Date,
    date2: string | Date
): number {
    // Convert the inputs to Date objects if they are not already
    const startDate = new Date(date1);
    const endDate = new Date(date2);

    // Ensure both dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date");
    }

    // Calculate the difference in time (in milliseconds)
    const timeDifference = endDate.getTime() - startDate.getTime();

    // Convert the time difference from milliseconds to days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const dayDifference = timeDifference / millisecondsPerDay;

    // Return the rounded absolute value to ensure a positive integer
    return Math.round(Math.abs(dayDifference));
}
