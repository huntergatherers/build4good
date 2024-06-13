"use server";

import { createListing } from "@/lib/actions";
import { getCurrentUserId } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CreateListingFormSchema } from "./page";
import { z } from "zod";

const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION_HOMELY!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_HOMELY!,
        secretAccessKey: process.env.AWS_SECRET_KEY_HOMELY!,
    },
});

export async function getSignedURL(
    fileName: string,
    data: Omit<z.infer<typeof CreateListingFormSchema>, "image"> & {
        image: string;
    },
    image: FormData
) {
    const userId = await getCurrentUserId();
    if (!userId) {
        throw new Error("User not found");
    }
    const imageData = image.get("image") as File;
    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME_HOMELY!,
        Key: fileName,
    });

    const url = await getSignedUrl(
        s3Client,
        putObjectCommand,
        { expiresIn: 60 } // 60 seconds
    );

    console.log(url);

    await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": imageData.type,
        },
        body: imageData,
    });

    const newData = {
        ...data,
        image: url.split("?")[0],
    };
    await createListing(newData);
}
