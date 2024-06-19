import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Image from "next/image";
import TransactionItem from "./transaction-item";
import { TransactionDropdown } from "./transaction-dropdown";
import TransactionDisplay from "./transaction-display";

export default async function Transactions() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }
    const profile = await prisma.profiles.findUnique({
        where: {
            id: user.id,
        },
    });
    if (!profile) {
        return <div>Profile not found</div>;
    }
    let transactions = await prisma.transaction.findMany({
        orderBy: {
          created_at: "desc"
        },
        where: {
            OR: [
                {
                    profiles: {
                        users: {
                            id: user.id,
                        },
                    },
                },
                {
                    Listing: {
                        profiles: {
                            users: {
                                id: user.id,
                            },
                        },
                    },
                },
            ],
        },
        include: {
            conversation: {
                include: {
                    message: true,
                },
            },
            profiles: true,
            Listing: {
                include: {
                    ListingImage: true,
                    profiles: true,
                },
            },
        },
    });

    transactions = transactions.map((transaction) => {
        if (transaction.conversation) {
            transaction.conversation.message.sort((a, b) => {
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            });
        }
        return transaction;
    });

    return (
        <div className="flex flex-col items-center justify-center space-y-4 w-full p-6">
            <TransactionDisplay transactions={transactions} profile={profile} />
        </div>
    );
}
