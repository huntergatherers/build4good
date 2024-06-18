import { User } from "@supabase/supabase-js";
import CommentBox from "./comment-box";
import ListingCommentItem from "./listing-comment-item";
import { ListingComment, Prisma } from "@prisma/client";
import { hasUserLikedComment } from "@/lib/actions";

type commentsWithReplies = Prisma.ListingCommentGetPayload<{
    include: {
        profiles: true;
        other_ListingComment: {
            include: { profiles: true };
        };
    };
}>;

interface CommentSectionProps {
    listingId: number;
    user: User | null;
    comments: commentsWithReplies[];
}

export default async function CommentSection({
    comments,
    listingId,
    user,
}: CommentSectionProps) {
    return (
        <div>
            <div className="flex flex-col gap-4 my-4">
                {comments.map(async (comment) => {
                    if (comment.parent_id !== null) return null;
                    const isLiked = user
                        ? await hasUserLikedComment(comment.id)
                        : false;
                    return (
                        <ListingCommentItem
                            key={comment.id}
                            user={user}
                            isLiked={isLiked}
                            comment={comment}
                            listingId={listingId}
                        />
                    );
                })}
            </div>
            {user && <CommentBox listingId={listingId} parentId={null} />}
        </div>
    );
}
