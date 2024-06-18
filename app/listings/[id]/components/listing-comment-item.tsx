"use client";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import ListingCommentActionButtons from "./listing-comment-action-buttons";
import CommentReplyForm from "./comment-reply-form";
import { User } from "@supabase/supabase-js";

type commentsWithReplies = Prisma.ListingCommentGetPayload<{
    include: {
        profiles: true;
        other_ListingComment: {
            include: { profiles: true };
        };
    };
}>;

interface ListingCommentItemProps {
    user: User | null;
    isLiked: boolean;
    comment: commentsWithReplies;
    listingId: number;
}

export default function ListingCommentItem({
    user,
    isLiked,
    comment,
    listingId,
}: ListingCommentItemProps) {
    const formattedDate = format(
        new Date(comment.created_at),
        "MMMM dd, yyyy p"
    );

    console.log(comment);

    const replies = comment.other_ListingComment;

    return (
        <div key={comment.id} className="flex flex-col rounded-md">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                <div>
                    <p className="font-semibold">{comment.profiles.username}</p>
                    <p className="text-gray-400 text-xs">{formattedDate}</p>
                </div>
            </div>
            <p className="mt-2">{comment.body_text}</p>
            <ListingCommentActionButtons
                initialIsLiked={isLiked}
                commentId={comment.id}
                initialLikeCount={comment.like_count}
                replies={replies}
            />
            {user && (
                <CommentReplyForm parentId={comment.id} listingId={listingId} />
            )}
        </div>
    );
}
