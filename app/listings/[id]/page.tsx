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
    const username = listing.profiles.username;
    const transactions = listing.Transaction;
    const comments = listing.ListingComment;

    const totalDonation = transactions.reduce(
        (acc, transaction) => acc + transaction.donated_amount,
        0
    );

    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    return (
        <div className="w-full p-6">
            <h1 className="font-bold text-xl">
                {username}{" "}
                {listingType == "donate"
                    ? "is donating"
                    : "is requesting for"}
                ...
            </h1>
            <ListingMap />
            <div className="flex justify-between items-center">
                <p className="text-xl font-semibold">{listing.header}</p>
                <Badge>2.1km</Badge>
            </div>
            <p className="text-gray-400 my-2">{listing.body}</p>
            {listingType == "donate" && (
                <>
                    <Progress
                        value={(totalDonation / listing.total_amount) * 100}
                        className="h-[10px] [&>*]:bg-green-700"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <div className="text-green-700">
                            <p className="font-semibold">{totalDonation}kg</p>
                            donated of {listing.total_amount}kg
                        </div>
                        <div className="text-gray-400">
                            <p className="font-semibold">
                                {listing.Transaction.length}
                            </p>
                            Donors
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
            <div className="text-xl font-semibold mt-4">
                {listingType == "receive"
                    ? "Your food scraps will be going to..."
                    : "What you will be receiving..."}
            </div>
            <Image
                className="rounded-2xl my-4 w-full h-56"
                src="https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={500}
                height={500}
                alt="Picture of the author"
            />
            <p>Yishun Community Park</p>
            <Button className="mt-4 w-full">{listingType == "receive" ? "Donate" : "Request for this"}</Button>
            <Separator className="my-4" />
            <div className="text-xl font-bold flex">
                Comments
                <Badge className="ml-2 bg-gray-200 text-black">
                    {comments.length}
                </Badge>
            </div>
            <CommentSection comments={comments} user={data.user} listingId={listingId}/>
        </div>
    );
}
