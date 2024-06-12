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
                    other_ListingComment: {
                        include: {
                            profiles: true,
                        },
                    }, // Include the replies of the comment
                },
            },
            Transaction: true,
            profiles: true,
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

    const totalDonation = transactions.reduce(
        (acc, transaction) => acc + transaction.donated_amount,
        0
    );

    const user = await getCurrentUser();
    return (
        <div className="w-full p-6">
            <h1 className="font-bold text-xl">
                {username}{" "}
                {listingType == "donate" ? "is donating" : "is requesting for"}
                ...
            </h1>
            <p className="font-semibold">
                {listing.total_amount}kg of {listing.listing_item_type}
            </p>
            <ListingMap />
            <div className="flex justify-between items-center">
                <p className="text-xl font-semibold">{listing.header}</p>
                <Badge>2.1km</Badge>
            </div>
            <p className="text-gray-400 my-2">{listing.body}</p>
            <>
                <Progress
                    value={(totalDonation / listing.total_amount) * 100}
                    className="h-[10px] [&>*]:bg-green-700"
                />
                <div className="flex justify-between items-center mt-2">
                    <div className="text-green-700">
                        <p className="font-semibold">{totalDonation}kg</p>
                        {listingType === "donate"
                            ? "claimed"
                            : "donated"} of {listing.total_amount}kg
                    </div>
                    <div className="text-gray-400">
                        <p className="font-semibold">
                            {listing.Transaction.length}
                        </p>
                        {listingType === "donate" ? "claimed" : "donated"}
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
            <div className="text-md font-semibold mt-4 mb-1">
                {listingType == "receive"
                    ? "Your food scraps will be going to..."
                    : "What you will be receiving..."}
            </div>
            <Image
                className="rounded-2xl mb-4 w-full h-56"
                src="https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={500}
                height={500}
                alt="Picture of the author"
            />
            {user ? (
                <TransactionBtn
                    user={user}
                    listing={listing}
                    listingOwner={owner}
                />
            ) : (
                <LoginButton
                    text={listingType == "receive" ? "Donate" : "Request"}
                />
            )}

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
        </div>
    );
}
