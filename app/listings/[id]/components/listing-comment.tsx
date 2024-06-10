import { ListingComment } from "@prisma/client";
import { format } from "date-fns";

interface ListingCommentItemProps {
    comment: ListingComment;
}

export default function ListingCommentItem({
    comment,
}: ListingCommentItemProps) {
    const formattedDate = format(
        new Date(comment.created_at),
        "MMMM dd, yyyy p"
    );

    return (
        <div key={comment.id} className="flex flex-col">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                <div>
                    <p className="font-semibold">hi</p>
                    <p className="text-gray-400">{formattedDate}</p>
                </div>
            </div>
            <p>{comment.body_text}</p>
        </div>
    );
}
