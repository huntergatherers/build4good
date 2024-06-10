"use client";
import { useState } from "react";
import { likeComment, unlikeComment } from "@/lib/actions";
import { Heart, MessageCircle } from "lucide-react";

interface ListingCommentActionButtonsProps {
    initialIsLiked: boolean;
    commentId: string;
    initialLikeCount: number;
    repliesCount: number;
}

export default function ListingCommentActionButtons({
    initialIsLiked,
    commentId,
    initialLikeCount,
    repliesCount,
}: ListingCommentActionButtonsProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);

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
        <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center justify-center text-xs">
                <Heart
                    size={14}
                    fill={isLiked ? "red" : "none"}
                    className="mr-2 cursor-pointer"
                    onClick={handleLikeClick}
                />
                {likeCount} likes
            </div>
            <div className="flex items-center justify-center text-xs">
                <MessageCircle size={14} className="mr-2" />
                {repliesCount} replies
            </div>
        </div>
    );
}
