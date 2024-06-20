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
import Broccoli from "./assets/broccoli";
import Apple from "./assets/apple";
import dynamic from "next/dynamic";
import GoogleMapsItem from "./google-maps-item";
import Link from "next/link";
import { Prisma } from "@prisma/client";

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

    //   id: '21b30206-3823-4063-b001-c0c8a4511a55',
    //   username: 'aden teo',
    //   coords_lat: 1.485513,
    //   coords_long: 103.879777,
    //   is_composter: true,
    //   is_donor: true,
    //   is_gardener: false,
    //   last_activity: 2024-06-18T07:02:50.423Z,
    //   social_media_url: 'https://example.com/user21'

    const userData = [
        {
            id: 1,
            name: "user7",
            about: "I am a compost enthusiast",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 150,
            wasteDonated: 75,
            startDate: new Date("2023-05-15"),
            freeDays: ["Monday", "Wednesday", "Friday"],
            role: "Receiver",
            latitude: 1.3521,
            longitude: 103.8198,
        },
        {
            id: 2,
            name: "user15",
            about: "I have my own farm and I love to recycle waste",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 200,
            wasteDonated: 100,
            startDate: new Date("2023-03-20"),
            freeDays: ["Tuesday", "Thursday"],
            role: "Receiver",
            latitude: 1.3422,
            longitude: 103.82,
        },
        {
            id: 3,
            name: "user4",
            about: "I am a compost enthusiast",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 100,
            wasteDonated: 50,
            startDate: new Date("2024-05-15"),
            freeDays: ["Saturday", "Sunday"],
            role: "Giver",
            latitude: 1.3623,
            longitude: 103.8202,
        },
        {
            id: 4,
            name: "user18",
            about: "I am a compost enthusiast",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 150,
            wasteDonated: 75,
            startDate: new Date("2023-01-15"),
            freeDays: ["Monday", "Wednesday", "Friday"],
            role: "Giver",
            latitude: 1.3524,
            longitude: 103.8004,
        },
        {
            id: 5,
            name: "user9",
            about: "I am a compost enthusiast",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 200,
            wasteDonated: 100,
            startDate: new Date("2023-05-15"),
            freeDays: ["Tuesday", "Thursday"],
            role: "Receiver",
            latitude: 1.3525,
            longitude: 103.8406,
        },
        {
            id: 6,
            name: "user12",
            about: "I am a compost enthusiast",
            profilePicture:
                "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg",
            wasteReceived: 100,
            wasteDonated: 50,
            startDate: new Date("2023-05-15"),
            freeDays: ["Saturday", "Sunday"],
            role: "Receiver",
            latitude: 1.3526,
            longitude: 103.8318,
        },
    ];

    const markers = users.map((user) => ({
        id: user.id,
        latitude: user.profiles?.coords_lat,
        longitude: user.profiles?.coords_long,
    }));

    console.log(markers);

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

    const filteredUserData = userData.filter(
        (user) => filter === "All Users" || user.role === filter
    );

    return (
        <div className="relative min-h-screen w-screen flex justify-center items-center">
            {/* <MapItem /> */}
            <GoogleMapsItem markers={markers} users={users} />
            {/* <GoogleMapsItem /> */}

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
                    {/* <div className="flex justify-between pl-6 pr-6 mb-6 z-50">
            <Button
              className="rounded-3xl text-black bg-white hover:bg-black hover:text-white"
              onClick={() => setFilter('All Users')}
            >
              All Users
            </Button>
            <Button
              className="rounded-3xl text-black bg-white hover:bg-black hover:text-white"
              onClick={() => setFilter('Giver')}
            >
              Donors
            </Button>
            <Button
              className="rounded-3xl text-black bg-white hover:bg-black hover:text-white"
              onClick={() => setFilter('Receiver')}
            >
              Composters
            </Button>
          </div> */}

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
                                    <Link
                                        key={index}
                                        className="flex text-sm text-center mb-4 p-6 bg-white"
                                        href={`/user/${user.profiles?.username}`}
                                    >
                                        <div className="text-center mr-4 flex flex-col justify-center items-center">
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

                                            {/* <p className="text-gray-500 text-xs">
                      since {calculateFoodScrappingDuration(user.created_at!)} ago
                    </p> */}
                                            {/* <div className="text-gray-500 flex justify-between space-x-2 mt-4">
                      {[
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                      ].map((day, idx) => (
                        <p
                          key={idx}
                          className={`flex items-center justify-center font-semibold rounded-full w-6 h-6 ${
                            user.freeDays.includes(day)
                              ? 'bg-green-300'
                              : 'bg-gray-200'
                          }`}
                        >
                          {day[0]}
                        </p>
                      ))}
                    </div> */}
                                            <div className="flex justify-center items-center mt-1">
                                                <div className="bg-gray-500 text-xs rounded-3xl py-1 px-2 text-white">
                                                    2.4km
                                                </div>
                                                <div className="text-gray-500 ml-2 text-xs">
                                                    from you
                                                </div>
                                            </div>
                                            <p className="mt-2 text-xs font-semibold">
                                                Active Listings
                                            </p>
                                            <div className="flex justify-center items-center mt-1">
                                                {user.profiles?.Listing.map(
                                                    (listing, idx) => (
                                                        <div>
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
                                    </Link>
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
