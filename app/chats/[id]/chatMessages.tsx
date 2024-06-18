"use client";
import BackBtn from "@/app/listings/[id]/components/back-btn";
import { Button } from "@/components/ui/button";
import { approveTransaction, sendMessage } from "@/lib/actions";
import { Prisma } from "@prisma/client";
import { useState } from "react";

type conversation = Prisma.conversationGetPayload<{
    include: {
        message: true;
        transaction: true;
    };
}>;

export default function ChatMessages({
    conversation,
    userId,
}: {
    conversation: conversation | null;
    userId: string;
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

        console.log("Approved");
    };

    const handleReject = () => {
        // Logic to handle reject
        console.log("Rejected");
    };

    return (
        <div className="flex flex-col h-full w-full">
            <div className="fixed top-0 left-0 w-full bg-white z-10 p-4 flex justify-between items-center">
                <BackBtn label="Back" />
                {conversation.transaction?.other_id === userId ? (
                    <div
                        className={`p-2 px-3 rounded-xl text-white ${
                            conversation.transaction?.completed_at
                                ? "bg-green-500"
                                : conversation.transaction?.approved_at
                                ? "bg-orange-500"
                                : "bg-blue-500"
                        }`}
                    >
                        {conversation.transaction?.completed_at
                            ? "Completed"
                            : conversation.transaction?.approved_at
                            ? "Awaiting completion"
                            : "Pending accept"}
                    </div>
                ) : (
                    <div>
                        {conversation.transaction?.approved_at ? (
                            <div>
                                <Button className="bg-green-500">
                                    Exchange completed
                                </Button>
                            </div>
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
                )}
            </div>
            <div className="flex-1 overflow-y-auto pt-16 pb-16 p-4">
                {conversation.message.map((message) => (
                    <div
                        key={message.id}
                        className={`p-2 my-2 rounded-lg max-w-md w-fit ${
                            message.senderId === userId
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
