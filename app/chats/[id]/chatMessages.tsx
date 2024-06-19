"use client";
import BackBtn from "@/app/listings/[id]/components/back-btn";
import { Button } from "@/components/ui/button";
import {
    approveTransaction,
    completeTransaction,
    sendMessage,
} from "@/lib/actions";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";
import TransactionBtn from "@/app/listings/[id]/components/transaction-btn";
import { User } from "@supabase/supabase-js";

type conversation = Prisma.conversationGetPayload<{
    include: {
        transaction: {
            include: {
                Listing: {
                    include: {
                        Transaction: true;
                        profiles: true;
                    };
                };
            };
        };
        message: true;
    };
}>;

export default function ChatMessages({
    conversation,
    user,
}: {
    conversation: conversation | null;
    user: User;
}) {
    const [newMessage, setNewMessage] = useState("");

    if (!conversation) {
        return <div>No conversation found</div>;
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            return;
        }
        await sendMessage(newMessage, conversation.id);
        setNewMessage("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleApprove = async () => {
        // Logic to handle approve
        const data = await approveTransaction(
            conversation.transaction!.id,
            conversation.id
        );
        await sendMessage(
            `I have approved your ${
                conversation.transaction?.Listing.listing_type === "donate"
                    ? "request"
                    : "offer"
            }`,
            conversation.id
        );

        console.log("Approved");
    };

    const handleReject = () => {
        // Logic to handle reject
        console.log("Rejected");
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="fixed top-0 left-0 w-full bg-white z-2 p-4 flex flex-col items-center border-b">
                <div className="flex justify-between items-center w-full">
                    <BackBtn label="Back" />
                    {conversation.transaction &&
                        conversation.transaction.cancelled_at && (
                            <div className="bg-red-600 p-2 text-white font-bold">
                                CANCELLED
                            </div>
                        )}
                    {conversation.transaction &&
                        conversation.transaction.cancelled_at == null &&
                        (conversation.transaction?.other_id === user.id ? ( // If the user is the requester
                            conversation.transaction?.approved_at ? (
                                conversation.transaction?.completed_at ? (
                                    <div className="bg-green-600 p-2 text-white font-bold">
                                        COMPLETED
                                    </div>
                                ) : (
                                    <div className="bg-blue-600 p-2 text-white font-bold">
                                        APPROVED. AWAITING COMPLETION.
                                    </div>
                                )
                            ) : (
                                <div>
                                    <TransactionBtn
                                        user={user}
                                        listing={
                                            conversation.transaction.Listing
                                        }
                                        listingOwner={
                                            conversation.transaction.Listing
                                                .profiles
                                        }
                                        conversationId={conversation.id}
                                    />
                                </div>
                            )
                        ) : (
                            <div>
                                {conversation.transaction?.approved_at ? (
                                    conversation.transaction?.completed_at ? (
                                        <div className="bg-green-600 p-2 text-white font-bold">
                                            COMPLETED
                                        </div>
                                    ) : (
                                        <div>
                                            <Button
                                                onClick={async () => {
                                                    await completeTransaction(
                                                        conversation.transaction!
                                                            .id
                                                    );
                                                }}
                                                className="bg-orange-600"
                                            >
                                                {conversation.transaction
                                                    .Listing.listing_type ===
                                                "donate"
                                                    ? "I have handed over the items"
                                                    : "I have received the items"}
                                            </Button>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex space-x-2">
                                        <Button
                                            className="bg-green-500 text-white font-bold"
                                            onClick={handleApprove}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="font-bold"
                                            onClick={handleReject}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
                {conversation.transaction && (
                    <div className="self-end font-semibold mt-2">
                        <div>
                            {conversation.transaction?.donated_amount}kg of{" "}
                            {
                                conversation.transaction?.Listing
                                    .listing_item_type
                            }
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-y-auto pt-28 pb-16 p-4">
                {conversation.message.map((message) => (
                    <div
                        key={message.id}
                        className={`p-2 my-2 rounded-lg max-w-md w-fit ${
                            message.senderId === user.id
                                ? "bg-purple-600 text-white self-end ml-auto"
                                : "bg-gray-800 text-white self-start mr-auto"
                        }`}
                    >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs text-gray-300">
                            {new Date(message.createdAt).toLocaleString([
                                "en-SG",
                            ])}
                        </span>
                    </div>
                ))}
            </div>
            <div className="fixed bottom-0 left-0 w-full bg-white z-10 p-4 flex items-center">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg mr-2"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="p-2 bg-blue-500 text-white rounded-lg"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
