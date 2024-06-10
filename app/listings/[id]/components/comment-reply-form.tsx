"use client";

import { useState } from "react";
import CommentBox from "./comment-box";

export default function CommentReplyForm({
    parentId,
    listingId,
}: {
    parentId: string;
    listingId: number;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    return (
        <div>
            <div
                className="text-xs font-semibold mt-2 text-blue-600 w-min"
                onClick={() => {
                    setShowReplyForm(!showReplyForm);
                }}
            >
                Reply
            </div>
            {showReplyForm && (
                <CommentBox parentId={parentId} listingId={listingId} />
            )}
        </div>
    );
}
