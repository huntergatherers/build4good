import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

const UserPage = async ({ params }: { params: { username: string } }) => {
    const profile = await prisma.profiles.findUnique({
        where: {
            username: params.username,
        },
        include: {
            users: true,
        },
    });

    if (!profile) {
        redirect("/error");
    }

    console.log(profile);

    return <div>My name: {params.username}</div>;
};

export default UserPage;
