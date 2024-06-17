import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { formatDistanceToNow, parseISO } from 'date-fns';

export function formatDateTimeAgo(dateTime: Date): string {
  return formatDistanceToNow(dateTime, { addSuffix: true });
}



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

export function getRandomOffsetLocation(
  location: { latitude: number; longitude: number },
  minDistance: number = 50,
  maxDistance: number = 100
) {
  console.log(location)
  const earthRadius = 6371000; // radius of Earth in meters
  const randomDistance =
      Math.random() * (maxDistance - minDistance) + minDistance;
  const randomAngle = Math.random() * 2 * Math.PI;

  const offsetLatitude =
      (randomDistance * Math.cos(randomAngle)) / earthRadius;
  const offsetLongitude =
      (randomDistance * Math.sin(randomAngle)) /
      (earthRadius * Math.cos((location.latitude * Math.PI) / 180));

  const newLatitude = location.latitude + (offsetLatitude * 180) / Math.PI;
  const newLongitude = location.longitude + (offsetLongitude * 180) / Math.PI;
  console.log(newLatitude, newLongitude)

  return {
      latitude: newLatitude,
      longitude: newLongitude,
  };
}


// haversine euclidean distance from coordinates
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
  
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
  
    return distance;
  }

  