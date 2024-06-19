import Image from "next/image";

import prisma from "@/lib/db";
import ListingMap from "./components/listing-map";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { daysBetween } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import CommentSection from "./components/comment-section";
import { getCurrentUser } from "@/lib/auth";
import TransactionBtn from "./components/transaction-btn";
import { useLoginDialog } from "@/app/login/login-dialog-context";
import LoginButton from "@/app/login/login-button";
import GoogleMaps from "./components/google-maps";
import { ChevronLeft, Loader } from "lucide-react";
import BackBtn from "./components/back-btn";
import ViewChatButton from "./view-chat-btn";

export default async function ListingPage({
    params,
}: {
    params: { id: string };
}) {
    const listingId = parseInt(params.id, 10); // Convert the id to an integer

    if (isNaN(listingId)) {
        return <div>Invalid listing ID</div>; // Handle invalid ID scenario
    }
    const listing = await prisma.listing.findUnique({
        where: {
            id: listingId,
        },
        include: {
            ListingComment: {
                include: {
                    profiles: true,
                    other_ListingComment: {
                        include: {
                            profiles: true,
                        },
                    }, // Include the replies of the comment
                },
            },
            Transaction: {
                include: {
                    conversation: true,
                },
            },
            profiles: true,
            ListingImage: true,
        },
    });
    if (!listing) {
        return <div>Listing not found</div>;
    }
    const listingType = listing.listing_type;
    const owner = listing.profiles;
    const username = listing.profiles.username;
    const transactions = listing.Transaction;
    const comments = listing.ListingComment;

    const totalDonation = transactions
        .filter((transaction) => transaction.completed_at)
        .reduce((acc, transaction) => acc + transaction.donated_amount, 0);

    const user = await getCurrentUser();

    const matchingTransaction = listing.Transaction.find(
        (transaction) => transaction.other_id === user?.id
    );

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
                <Badge>2.1km</Badge>
            </div>
            <p className="text-gray-400 my-2">{listing.body}</p>
            {listing.listing_type === "donate" && (
                <div className="mt-2 text-green-600 text-xl font-semibold">
                    {listing.total_amount}kg available
                </div>
            )}
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
            {listing.listing_type === "receive" && (
                <>
                    <Separator className="my-4" />
                    <div className="mb-4 text-lg font-semibold">
                        Community Contributions
                    </div>
                    <Progress
                        value={(totalDonation / listing.total_amount) * 100}
                        className={`h-[10px] [&>*]:bg-green-700
                        `}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <div className="text-green-700">
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
                                        (transaction) =>
                                            transaction.completed_at
                                    ).length
                                }
                            </p>
                            {listingType === "donate"
                                ? "claimed"
                                : "contributors"}
                        </div>

                        <div className="text-gray-400">
                            <p className="font-semibold">
                                {daysBetween(
                                    listing.created_at,
                                    listing.deadline
                                )}
                            </p>
                            Days to go
                        </div>
                    </div>
                </>
            )}

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
                listingId={listingId}
            />
            {user?.id !== owner.id && (
                <div className="fixed bottom-0 p-4 -mx-6 w-full bg-white rounded-t-lg border-t-2 border-t-gray-200 drop-shadow-2xl">
                    {user ? (
                        matchingTransaction &&
                        matchingTransaction.conversation ? (
                            <ViewChatButton
                                conversationId={
                                    matchingTransaction.conversation?.id
                                }
                            />
                        ) : (
                            <TransactionBtn
                                user={user}
                                listing={listing}
                                listingOwner={owner}
                            />
                        )
                    ) : (
                        <LoginButton
                            text={
                                listingType == "receive"
                                    ? "Contribute"
                                    : "Request"
                            }
                        />
                    )}
                </div>
            )}
        </div>
    );
}
