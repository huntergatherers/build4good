"use client";
import { Prisma, Transaction } from "@prisma/client";
import { Check, X } from "lucide-react";
import Image from "next/image";
import TransactionStatusTag from "./transaction-status-tag";
// import { useApproveTransaction } from "@/lib/hooks/useApproveTransaction";
// import { approveTransaction, rejectTransaction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
// import { useApproveTransaction } from "@/lib/hooks/useApproveTransaction";
import { approveTransaction } from "@/lib/actions";

export type TransactionWithDetails = Prisma.TransactionGetPayload<{
    include: {
        Listing: {
            include: {
                ListingImage: true;
                profiles: true;
            };
        };
    };
}>;

interface TransactionItemProps {
    transaction: TransactionWithDetails;
    type: "receive" | "give";
}

export default function TransactionItem({
    transaction,
    type,
}: TransactionItemProps) {
  const router = useRouter();
    const handleApproveTransaction = async () => {
      const data = await approveTransaction(transaction.id);
      console.log(data)
    }

    // const handleRejectTransaction = async () => {
    //     await rejectTransaction(transaction.id);
    // }
    // const { execute, result } = useAction(useApproveTransaction);
    // console.log(result)
    return (
        <div
            key={transaction.id}
            className ="w-full flex items-start border-2 rounded-md p-2 justify-between"
        >
            <div className="flex justify-start items-start">
                <div className="relative w-24 h-24">
                    <div
                        className={`text-[0.6rem] text-white absolute -left-[1px] top-2 p-1 rounded-r-sm z-10 ${
                            transaction.Listing.listing_item_type === "greens"
                                ? "bg-green-600"
                                : transaction.Listing.listing_item_type ===
                                  "browns"
                                ? "bg-amber-600"
                                : "bg-blue-800"
                        }`}
                    >
                        {transaction.Listing.listing_item_type}
                    </div>
                    <Image
                        className="rounded-lg object-cover"
                        src={
                            transaction.Listing.ListingImage.length > 0
                                ? transaction.Listing.ListingImage[0].url
                                : "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        fill
                        alt={transaction.Listing.header}
                    />
                </div>
                <div className="flex flex-col items-start ml-2">
                    <p className="font-bold">
                        {transaction.Listing.profiles.username}
                    </p>
                    <p>{transaction.Listing.header}</p>
                    <p className="text-xl font-semibold">
                        {transaction.donated_amount} kg
                    </p>
                </div>
            </div>

            {type === "receive" ? (
                <div className="flex items-center justify-center self-center space-x-2">
                    <Check
                        onClick={async() => {
                           await handleApproveTransaction();
                        }}
                        color="white"
                        className="bg-orange-400 w-10 h-10 rounded-full p-2"
                    />
                    <X
                        // onClick={async () => {
                        //     await handleRejectTransaction();
                        // }}
                        color="white"
                        className="bg-gray-400 w-10 h-10 rounded-full p-2"
                    />
                </div>
            ) : (
                <TransactionStatusTag transaction={transaction} />
            )}
        </div>
    );
}
