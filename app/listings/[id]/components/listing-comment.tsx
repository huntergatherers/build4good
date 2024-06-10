import { ListingComment } from "@prisma/client";
import { format } from "date-fns";
import prisma from "@/lib/db";
import { Heart, MessageCircle } from "lucide-react";

interface ListingCommentItemProps {
    comment: ListingComment;
}

export default async function ListingCommentItem({
    comment,
}: ListingCommentItemProps) {
    const formattedDate = format(
        new Date(comment.created_at),
        "MMMM dd, yyyy p"
    );

    const profile = await prisma.profiles.findUnique({
        where: {
            id: comment.profile_id,
        },
    });

    if (!profile) {
        return null;
    }

    return (
        <div key={comment.id} className="flex flex-col">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                <div>
                    <p className="font-semibold">{profile.username}</p>
                    <p className="text-gray-400">{formattedDate}</p>
                </div>
            </div>
            <p className="mt-2">{comment.body_text}</p>
            <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center justify-center">
                    <Heart className="mr-2" />
                    {comment.like_count} likes
                </div>
                <div className="flex items-center justify-center">
                    <MessageCircle className="mr-2" />
                    {3} replies
                </div>
            </div>
        </div>
    );
}
