"use server";
import prisma from "./db";
import {
    getCurrentUser,
    getCurrentUserId,
    getUserProfileFromUserId,
} from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { en } from "@faker-js/faker";

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
        throw new Error("User session not found");
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
        throw new Error("Error creating comment: " + error);
    }
}
//profile crud
export async function getProfileById(id: string) {
    const profile = await prisma.profiles.findUnique({
        where: { id },
    });
    return profile;
}
export async function getProfileByUsername(username: string) {
    const profile = await prisma.profiles.findUnique({
        where: { username },
    });
    return profile;
}
//update profile: input is id, update optional: username, coords, roles, url.
interface UpdateProfileData {
    username?: string;
    coords_lat?: number;
    coords_long?: number;
    is_composter?: boolean;
    is_donor?: boolean;
    is_gardener?: boolean;
    social_media_url?: string;
}

export async function updateProfile(id: string, data: UpdateProfileData) {
    try {
        const updatedProfile = await prisma.profiles.update({
            where: { id },
            data,
        });
        return updatedProfile;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
}

// create listing
interface CreateListingData {
    profile_id: string;
    header: string;
    body: string;
    total_amount: number;
    deadline: Date;
    type: "receive" | "donate"; // 'receive' sets has_progress to true, 'donate' sets it to false
    item_type: "greens" | "browns" | "compost",
    coords_lat?: number;
    coords_long?: number;
}

export async function createListing(data: CreateListingData) {
    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            throw new Error("User not found");
        }
        const profile = await getUserProfileFromUserId(userId);
        // Fetch profile to get default coordinates if not provided
  
        if (!profile) {
            throw new Error("Profile not found");
        }

        const has_progress = data.type === "receive";
        // Use profile's coordinates if not specified
        const coords_lat = data.coords_lat ?? profile.coords_lat;
        const coords_long = data.coords_long ?? profile.coords_long;
        const listing = await prisma.listing.create({
            data: {
                profile_id: profile.id,
                header: data.header,
                body: data.body,
                total_amount: data.total_amount,
                deadline: data.deadline,
                listing_type: data.type,
                listing_item_type: data.item_type,
                has_progress: has_progress,
                coords_lat: coords_lat,
                coords_long: coords_long,
            },
        });

        return listing;
    } catch (error) {
        console.error("Error creating listing:", error);
        throw error;
    }
}
//adding tags to listing via listing id
enum tag_type_enum {
    scrap,
    compost,
}

enum scrap_type_enum {
    greens,
    browns,
    grains,
    meats,
    others,
}
enum compost_type_enum {
    vermicompost,
    aerobic,
    bokashi,
    chicken,
    others,
}
interface AddTagsToListingData {
    listing_id: number;
    tag_type: tag_type_enum;
    scrap_type?: scrap_type_enum;
    compost_type?: compost_type_enum;
}

// export async function addTagsToListing(data: AddTagsToListingData) {
//     try {
//     // Validate tag type and corresponding enum
//     if (data.tag_type === tag_type_enum.scrap && !data.scrap_type) {
//         throw new Error('scrap_type is required when tag_type is "scrap"');
//     }

//     if (data.tag_type === tag_type_enum.compost && !data.compost_type) {
//         throw new Error('compost_type is required when tag_type is "compost"');
//     }

//     // Create the ListingTag
//     const ListingTag = await prisma.listingTag.create({
//         data: {
//         listing_id: data.listing_id,
//         tag_type: data.tag_type,
//         scrap_type: data.scrap_type,
//         compost_type: data.compost_type,
//         },
//     });

//     return ListingTag;
//     } catch (error) {
//     console.error('Error adding tag to listing:', error);
//     throw error;
//     }
// }
