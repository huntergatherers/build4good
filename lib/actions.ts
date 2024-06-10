"use server";
import prisma from "./db";
import { getCurrentUserId } from "./auth";
import { redirect } from "next/navigation";

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
