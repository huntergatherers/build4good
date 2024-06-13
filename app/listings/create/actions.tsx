"use server";

import { getCurrentUserId } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION_HOMELY!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_HOMELY!,
        secretAccessKey: process.env.AWS_SECRET_KEY_HOMELY!,
    },
});

export async function getSignedURL(fileName: string) {
    const userId = await getCurrentUserId();
    if (!userId) {
        throw new Error("User not found");
    }

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME_HOMELY!,
        Key: fileName,
    });

    const url = await getSignedUrl(
        s3Client,
        putObjectCommand,
        { expiresIn: 60 } // 60 seconds
    );

    return { success: { url } };
}
