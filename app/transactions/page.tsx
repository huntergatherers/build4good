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
        console.log("NO USER FOUND");
        redirect("/login");
    }
    const transactions = await prisma.transaction.findMany({
        where: {
            approved_at: null,
            profiles: {
                users: {
                    id: user.id,
                },
            },
            
        },
        include: {
            Listing: {
                include: {
                    ListingImage: true,
                    profiles: true,
                },
            },
        },
    });

    const offersAndrequests = await prisma.transaction.findMany({
        where: {
            Listing: {
                profiles: {
                    users: {
                        id: user.id,
                    },
                },
            },
        },
        include: {
            Listing: {
                include: {
                    ListingImage: true,
                    profiles: true,
                },
            },
        },
    });
    return (
        <div className="flex flex-col items-center justify-center space-y-4 w-full p-6">
            <TransactionDisplay transactionsReceive={transactions} transactionsGive={offersAndrequests} />
        </div>
    );
}
