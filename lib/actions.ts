"use server";
import prisma from "./db";
import { getCurrentUserId } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";

export async function hasUserLikedComment(commentId: string): Promise<boolean> {
    const userId = await getCurrentUserId();
    if (!userId) {
        return false;
    }
    const like = await prisma.commentLike.findUnique({
        where: {
            profile_id_comment_id: {
                profile_id: userId,
                comment_id: commentId,
            },
        },
    });

    return like !== null;
}

export async function likeComment(commentId: string) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return false;
    }
    await prisma.commentLike.create({
        data: {
            profile_id: userId,
            comment_id: commentId,
        },
    });
    await prisma.listingComment.update({
        where: { id: commentId },
        data: { like_count: { increment: 1 } },
    });
}

export async function unlikeComment(commentId: string) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return false;
    }
    await prisma.commentLike.delete({
        where: {
            profile_id_comment_id: {
                profile_id: userId,
                comment_id: commentId,
            },
        },
    });

    await prisma.listingComment.update({
        where: { id: commentId },
        data: { like_count: { decrement: 1 } },
    });
}

export async function createComment(
    body: string,
    listingId: number,
    parentId: string | null = null
) {
    const userId = await getCurrentUserId();
    if (!userId) {
        return false;
    }
    try {
        await prisma.listingComment.create({
            data: {
                body_text: body,
                profile_id: userId,
                listing_id: listingId,
                parent_id: parentId,
            },
        });
    } catch (error) {
        console.error("Error creating comment", error);
        return false;
    }
    return true;
}
