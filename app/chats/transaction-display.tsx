"use client";

import React from "react";
import { TransactionDropdown } from "./transaction-dropdown";
import TransactionItem from "./transaction-item";
import { HandHelping, Handshake } from "lucide-react";
import { Prisma, profiles } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

type TransactionWithData = Prisma.TransactionGetPayload<{
    include: {
        profiles: true;
        conversation: {
            include: {
                message: true;
            };
        };
        Listing: {
            include: {
                ListingImage: true;
                profiles: true;
            };
        };
    };
}>;

interface TransactionDisplayProps {
    transactions: TransactionWithData[];
    profile: profiles;
}

export default function TransactionDisplay({
    transactions,
    profile,
}: TransactionDisplayProps) {
    return (
        <div className="w-full">
            <div className="mt-4"></div>
            <div>
                {transactions.length > 0 ? (
                    <div className="space-y-2">
                        {transactions.map((transaction) => (
                            <div key={transaction.id}>
                                <TransactionItem
                                    transaction={transaction}
                                    type="receive"
                                    profile={profile}
                                />
                           </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center mt-24 mx-auto">
                        <Handshake
                            size={40}
                            color="gray"
                            className="text-center mx-auto"
                        />
                        <p className="text-gray-400 text-center">
                            No transactions yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
