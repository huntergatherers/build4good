"use client";

import React from "react";
import { TransactionDropdown } from "./transaction-dropdown";
import TransactionItem from "./transaction-item";

interface TransactionDisplayProps {
    transactionsReceive: any[];
    transactionsGive: any[];
}

export default function TransactionDisplay({
    transactionsReceive,
    transactionsGive,
}: TransactionDisplayProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("receive");

    return (
        <div className="w-full">
            <TransactionDropdown
                open={open}
                setOpen={setOpen}
                value={value}
                setValue={setValue}
            />
            <div className="mt-4"></div>
                <div className="space-y-4">
                    {value === "receive" &&
                        transactionsReceive.map((transaction) => {
                            return (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    type={"receive"}
                                />
                            );
                        })}
                    {value === "give" &&
                        transactionsGive.map((transaction) => {
                            return (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    type={"give"}
                                />
                            );
                        })}
                </div>
        </div>
    );
}
