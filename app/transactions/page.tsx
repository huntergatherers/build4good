import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

export default async function Transactions() {
    const user = await getCurrentUser();
    if (!user) {
        console.log("NO USER FOUND");
        redirect("/login");
    }
    const transactions = await prisma.transaction.findMany({
        where: {
            profiles: {
                users: {
                    id: user.id,
                },
            },
        },
    });
    console.log(transactions);
    return <div>hi</div>;
}
