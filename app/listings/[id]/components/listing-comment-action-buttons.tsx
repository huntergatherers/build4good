"use client";
import { useState } from "react";
import { likeComment, unlikeComment } from "@/lib/actions";
import { Heart, MessageCircle } from "lucide-react";
import { ListingComment } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";

type RepliesWithProfiles = Prisma.ListingCommentGetPayload<{
    include: {
        profiles: true;
    };
}>[];

interface ListingCommentActionButtonsProps {
    initialIsLiked: boolean;
    commentId: string;
    initialLikeCount: number;
    replies: RepliesWithProfiles;
}

export default function ListingCommentActionButtons({
    initialIsLiked,
    commentId,
    initialLikeCount,
    replies,
}: ListingCommentActionButtonsProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isRepliesVisible, setIsRepliesVisible] = useState(false);

    const handleLikeClick = async () => {
        if (isLiked) {
            await unlikeComment(commentId);
            setLikeCount(likeCount - 1);
        } else {
            await likeComment(commentId);
            setLikeCount(likeCount + 1);
        }

        setIsLiked(!isLiked);
    };

    return (
        <div>
            <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center justify-center text-xs">
                    <Heart
                        size={14}
                        fill={isLiked ? "red" : "none"}
                        className="mr-2 cursor-pointer"
                        onClick={handleLikeClick}
                    />
                    {likeCount} likes
                </div>
                {replies.length > 0 && (
                    <div className="flex items-center justify-center text-xs">
                        <MessageCircle size={14} className="mr-2" />
                        <div
                            onClick={() => {
                                setIsRepliesVisible(!isRepliesVisible);
                            }}
                        >
                            {isRepliesVisible ? "Hide" : "Show"}{" "}
                            {replies.length} replies
                        </div>
                    </div>
                )}
            </div>
            {isRepliesVisible && (
                <div className="mt-4">
                    {replies.map((reply) => (
                        <div
                            key={reply.id}
                            className="ml-4 mt-2 bg-gray-100 p-2 rounded-md"
                        >
                            <p className="font-semibold">
                                {reply.profiles.username}
                            </p>
                            <p className="text-gray-400 text-xs">
                                {format(
                                    new Date(reply.created_at),
                                    "MMMM dd, yyyy p"
                                )}
                            </p>
                            <p>{reply.body_text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
