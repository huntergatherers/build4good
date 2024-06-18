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
import ListingItem from "./components/listing-item";

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
            ListingImage: true,
        },
    });
    if (!listing) {
        return <div>Listing not found</div>;
    }

    const user = await getCurrentUser();

    return <ListingItem listing={listing} user={user} />;
}
