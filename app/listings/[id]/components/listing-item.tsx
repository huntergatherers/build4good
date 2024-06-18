"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { daysBetween } from "@/lib/utils";
import CommentSection from "./comment-section";
import TransactionBtn from "./transaction-btn";
import LoginButton from "@/app/login/login-button";
import GoogleMaps from "./google-maps";
import { getCurrentDistanceToInstance, getCurrentUserCoords } from "@/lib/actions";
import { Listing, users, ListingComment, profiles, Transaction, ListingImage } from "@prisma/client";
import BackBtn from "./back-btn";
//import { users as User } from "@/lib/types";  // Import User type
import { calculateDistance } from "@/lib/utils";

interface ListingItemProps {
    listing: Listing & {
        Transaction: Transaction[];
        profiles: profiles;
        ListingComment: (ListingComment & {
            profiles: profiles;
            other_ListingComment: (ListingComment & {
                profiles: profiles;
            })[];
        })[];
        ListingImage: ListingImage[];
    };
    user: users | null;
}

const ListingItem = ({ listing, user }: ListingItemProps) => {
    const [distance, setDistance] = useState<number | null>(null);

    const listingType = listing.listing_type;
    const owner = listing.profiles;
    const username = listing.profiles.username;
    const transactions = listing.Transaction;
    const comments = listing.ListingComment;

    useEffect(() => {
        const fetchDistance = async () => {
            const userCoords = await getCurrentUserCoords();
            if (userCoords) {
                const dist = calculateDistance(
                    userCoords.lat,
                    userCoords.lon,
                    listing.coords_lat,
                    listing.coords_long
                );
                setDistance(dist);
            }
        };

        fetchDistance();
    }, [listing.coords_lat, listing.coords_long]);

    const totalDonation = transactions
        .filter((transaction) => transaction.completed_at)
        .reduce((acc, transaction) => acc + transaction.donated_amount, 0);

    return (
        <div className="w-full min-h-screen px-6 pt-6 pb-20 relative bg-white overflow-auto">
            <BackBtn label="Back" />
            <h1 className="font-semibold text-xl mt-4 text-gray-500">
                {username}{" "}
                {listingType == "donate"
                    ? "is contributing"
                    : "is requesting for"}
                ...
            </h1>
            <div className="flex justify-between items-center mt-4">
                <p className="text-xl font-semibold w-[80%] overflow-hidden text-ellipsis">
                    {listing.header}
                </p>
                <Badge>{distance !== null ? `${distance.toFixed(1)} km` : "Calculating..."}</Badge>
            </div>
            <p className="text-gray-400 my-2">{listing.body}</p>
            <Separator className="my-4" />
            <div className="relative w-full h-56 mt-4">
                <Image
                    className="rounded-2xl mb-4 w-full h-56 object-cover"
                    src={
                        listing.ListingImage.length > 0
                            ? listing.ListingImage[0].url
                            : "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    fill
                    alt="Picture of the author"
                />
            </div>
            <Separator className="my-4" />
            <div className="mb-4 text-lg font-semibold">
                {listing.listing_type === "donate"
                    ? "Community Requests"
                    : "Community Contributions"}
            </div>
            <>
                <Progress
                    value={(totalDonation / listing.total_amount) * 100}
                    className={`h-[10px] ${
                        listing.listing_type === "donate"
                            ? "[&>*]:bg-blue-700"
                            : "[&>*]:bg-green-700"
                    }`}
                />
                <div className="flex justify-between items-center mt-2">
                    <div
                        className={`${
                            listing.listing_type === "donate"
                                ? "text-blue-700"
                                : "text-green-700"
                        }`}
                    >
                        <p className="font-semibold">{totalDonation}kg</p>
                        {listingType === "donate"
                            ? "claimed"
                            : "contributed"}{" "}
                        of {listing.total_amount}kg
                    </div>
                    <div className="text-gray-400">
                        <p className="font-semibold">
                            {
                                listing.Transaction.filter(
                                    (transaction) => transaction.completed_at
                                ).length
                            }
                        </p>
                        {listingType === "donate" ? "claimed" : "contributors"}
                    </div>

                    <div className="text-gray-400">
                        <p className="font-semibold">
                            {daysBetween(listing.created_at, listing.deadline)}
                        </p>
                        Days to go
                    </div>
                </div>
            </>

            <Separator className="my-4" />

            <div className="my-4">
                <h2 className="text-xl font-semibold mb-4">
                    {username}'s meet-up location
                </h2>
                <GoogleMaps
                    location={{
                        lat: listing.coords_lat,
                        lng: listing.coords_long,
                    }}
                    listing={listing}
                />
            </div>
            <Separator className="my-4" />
            <div className="text-xl font-bold flex">
                Comments
                <Badge className="ml-2 bg-gray-200 text-black">
                    {comments.length}
                </Badge>
            </div>
            <CommentSection
                comments={comments}
                user={user}
                listingId={listing.id}
            />
            <div className="fixed bottom-0 p-4 -mx-6 w-full bg-white rounded-t-lg border-t-2 border-t-gray-200 drop-shadow-2xl">
                {user ? (
                    user.id === owner.id ? null : (
                        <TransactionBtn
                            user={user}
                            listing={listing}
                            listingOwner={owner}
                        />
                    )
                ) : (
                    <LoginButton
                        text={
                            listingType == "receive" ? "Contribute" : "Request"
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default ListingItem;
