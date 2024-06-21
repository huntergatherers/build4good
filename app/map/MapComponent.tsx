"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";
import GoogleMapsItem from "./google-maps-item";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";

const MapItem = dynamic(() => import("./map-item"), { ssr: false });

interface MapComponentPageProps {
    users: Prisma.usersGetPayload<{
        include: {
            profiles: {
                include: {
                    Transaction: true;
                    Listing: {
                        include: {
                            ListingImage: true;
                        };
                    };
                };
            };
        };
    }>[];
}

const MapComponentPage = ({ users }: MapComponentPageProps) => {
    const [filter, setFilter] = useState<"All Users" | "Giver" | "Receiver">(
        "All Users"
    );
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [distances, setDistances] = useState<number[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error obtaining location:", error);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (userLocation) {
            const calculateDistances = () => {
                const distances = users.map((user) => {
                    if (user.profiles?.coords_lat && user.profiles?.coords_long) {
                        return haversineDistance(
                            userLocation.lat,
                            userLocation.lng,
                            user.profiles.coords_lat,
                            user.profiles.coords_long
                        );
                    }
                    return 0;
                });
                setDistances(distances);
            };

            calculateDistances();
        }
    }, [userLocation, users]);

    const haversineDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ): number => {
      const toRad = (x: number): number => (x * Math.PI) / 180;
    
      const R = 6371; // Earth's radius in kilometers
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const lat1Rad = toRad(lat1);
      const lat2Rad = toRad(lat2);
    
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
      return R * c; // Distance in kilometers
    };

    const calculateFoodScrappingDuration = (startDate: Date) => {
        const today = new Date();
        const diffInMonths =
            (today.getFullYear() - startDate.getFullYear()) * 12 +
            (today.getMonth() - startDate.getMonth());
        const years = Math.floor(diffInMonths / 12);
        const months = diffInMonths % 12;
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const diffInDays = Math.floor(
            (today.getTime() - startDate.getTime()) / oneDay
        );
        let duration = "";

        if (years > 0) {
            duration += `${years}y `;
        }
        if (months > 0) {
            duration += `${months}m `;
        }
        if (diffInDays > 0 && years === 0 && months === 0) {
            duration += `${diffInDays}d`;
        }

        return duration.trim();
    };


    return (
        <div className="relative min-h-screen w-screen flex justify-center items-center">
            <GoogleMapsItem markers={users.map(user => ({
                id: user.id,
                latitude: user.profiles?.coords_lat,
                longitude: user.profiles?.coords_long,
            }))} users={users} />
            <Drawer>
                <DrawerTrigger
                    style={{
                        position: "absolute",
                        bottom: 150,
                        zIndex: 402,
                        backgroundColor: "black",
                        borderRadius: "15px",
                        padding: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <Search color="#ffffff" />
                </DrawerTrigger>
                <DrawerContent
                    className="rounded-3xl border-b-0 bg-gray-100 bg-opacity-85"
                    style={{ zIndex: 999999999 }}
                >
                    <DrawerHeader className="opacity-100">
                        <DrawerTitle className="flex">
                            <Search
                                style={{ marginTop: "8px", marginRight: "5px" }}
                            />
                            <Input
                                className="bg-white opacity-100 font-normal text-base"
                                placeholder="Search"
                            />
                        </DrawerTitle>
                    </DrawerHeader>

                    <ScrollArea className="bg-gray-100 h-full">
                        <div>
                            {users.map((user, index) => {
                                const totalAmount =
                                    user.profiles?.Transaction.reduce(
                                        (acc, curr) =>
                                            acc + curr.donated_amount,
                                        0
                                    );
                                return (
                                    <div
                                        key={index}
                                        className="flex text-sm text-center mb-4 p-6 bg-white"
                                        // href={`/user/${user.profiles?.username}`}
                                    >
                                        <div className="text-center mr-4 flex flex-col justify-center items-center" onClick={() => {
                                          router.push(`/user/${user.profiles?.username}`);
                                        }}>
                                            <img
                                                src={
                                                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                                                }
                                                alt={user.profiles?.username}
                                                className="w-16 h-16 rounded-full"
                                            />
                                            <p className="text-base font-semibold mt-2">
                                                {user.profiles?.username}
                                            </p>
                                            <p className="text-gray-600">
                                                Last active
                                                <br />
                                                {calculateFoodScrappingDuration(
                                                    user.profiles
                                                        ?.last_activity!
                                                )}{" "}
                                                ago
                                            </p>
                                        </div>
                                        <div className="flex flex-col justify-start items-start">
                                            <p className="text-green-600 font-medium text-xl">
                                                {totalAmount} kg{" "}
                                                <span className="text-md text-black font-normal">
                                                    recycled
                                                </span>
                                            </p>
                                            <div className="flex justify-center items-center mt-1">
                                                <div className="bg-gray-500 text-xs rounded-3xl py-1 px-2 text-white">
                                                    {distances[index] ? `${distances[index].toFixed(1)}km` : 'N/A'}
                                                </div>
                                                <div className="text-gray-500 ml-2 text-xs">
                                                    from you
                                                </div>
                                            </div>
                                            <p className="mt-2 text-xs font-semibold">
                                                Active Listings
                                            </p>
                                            <div className="flex justify-center items-center mt-1 space-x-2">
                                                {user.profiles?.Listing.map(
                                                    (listing, idx) => (
                                                        <div key={idx} onClick={() => {
                                                          router.push(`/listings/${listing.id}`)
                                                        }}>
                                                            <div className="relative w-16 h-16">
                                                                <div
                                                                    className={`text-[0.5rem] text-white absolute -left-[1px] top-2 px-1 rounded-r-md z-10 ${
                                                                        listing.listing_item_type ===
                                                                        "greens"
                                                                            ? "bg-green-600 bg-opacity-90 "
                                                                            : listing.listing_item_type ===
                                                                              "browns"
                                                                            ? "bg-amber-700 bg-opacity-90"
                                                                            : "bg-cyan-700 bg-opacity-90"
                                                                    }`}
                                                                >
                                                                    {
                                                                        listing.listing_item_type
                                                                    }
                                                                </div>
                                                                <Image
                                                                    className="rounded-lg object-cover h-16 w-16"
                                                                    src={
                                                                        listing
                                                                            .ListingImage
                                                                            .length >
                                                                        0
                                                                            ? listing
                                                                                  .ListingImage[0]
                                                                                  .url
                                                                            : "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                                                    }
                                                                    fill
                                                                    alt={
                                                                        listing.header
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default MapComponentPage;
