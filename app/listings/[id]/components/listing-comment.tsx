import { ListingComment } from "@prisma/client";
import { format } from "date-fns";
import prisma from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { hasUserLikedComment } from "@/lib/actions";
import ListingCommentActionButtons from "./listing-comment-action-buttons";

interface ListingCommentItemProps {
    comment: ListingComment;
}

export default async function ListingCommentItem({
    comment,
}: ListingCommentItemProps) {
    const supabase = createClient();

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

    const replies = await prisma.listingComment.findMany({
        where: {
            parent_id: comment.id,
        },
    });

    const { data } = await supabase.auth.getUser();
    const isLiked = data?.user ? await hasUserLikedComment(comment.id) : false;

    return (
        <div key={comment.id} className="flex flex-col rounded-md">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                <div>
                    <p className="font-semibold">{profile.username}</p>
                    <p className="text-gray-400 text-xs">{formattedDate}</p>
                </div>
            </div>
            <p className="mt-2">{comment.body_text}</p>
            <ListingCommentActionButtons
                initialIsLiked={isLiked}
                commentId={comment.id}
                initialLikeCount={comment.like_count}
                repliesCount={replies.length}
            />
        </div>
    );
}
