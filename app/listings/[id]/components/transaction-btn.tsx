"use client";
import { useLoginDialog } from "@/app/login/login-dialog-context";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
    createTransaction,
    deleteTransaction,
    editTransaction,
    sendMessage,
} from "@/lib/actions";

import { Listing, Prisma, profiles } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ListingWithTransaction = Prisma.ListingGetPayload<{
    include: { Transaction: true };
}>;

export default function TransactionBtn({
    user,
    listing,
    listingOwner,
    conversationId,
}: {
    user: User | null;
    listing: ListingWithTransaction;
    listingOwner: profiles;
    conversationId?: string;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const hasPendingTransaction = listing.Transaction.some(
        (transaction) => transaction.other_id === user?.id
    );
    const matchingTransaction = listing.Transaction.find(
        (transaction) => transaction.other_id === user?.id
    );
    const listingType = listing.listing_type;
    const remainingAmount =
        listing.total_amount -
        listing.Transaction.filter(
            (transaction) => transaction.completed_at
        ).reduce((acc, transaction) => acc + transaction.donated_amount, 0);
    const [goal, setGoal] = useState(
        hasPendingTransaction
            ? matchingTransaction!.donated_amount
            : remainingAmount
    );
    const { toast } = useToast();

    function onClick(adjustment: number) {
        setGoal(Math.max(0, Math.min(remainingAmount, goal + adjustment)));
    }

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value === "") {
            setGoal(0);
        } else {
            const parsedValue = parseInt(value, 10);
            if (!isNaN(parsedValue)) {
                setGoal(Math.max(0, Math.min(remainingAmount, parsedValue)));
            }
        }
    }

    async function handleCreateTransaction() {
        setIsLoading(true);
        const message = `Hi, I would like to ${
            listingType === "receive" ? "offer" : "request"
        } ${goal} kg of ${listing.listing_item_type}`;
        const transaction = await createTransaction(listing.id, goal, message);
        if (transaction.success) {
            toast({
                duration: 3000,
                title: "Successfully created",
                action: <ToastAction altText="Close">Close</ToastAction>,
                description: `Your ${
                    listing.listing_type === "donate" ? "request" : "offer"
                } has been created. You will be notified when it is accepted.`,
            });
        } else {
            toast({
                action: <ToastAction altText="Close">Close</ToastAction>,
                duration: 2000,
                variant: "destructive",
                title: "Error occurred",
                description: transaction.error,
            });
        }
        setOpen(false);
        setIsLoading(false);
    }

    async function handleDeleteTransaction() {
        setIsLoading(true);
        const response = await deleteTransaction(matchingTransaction?.id);
        if (response.success) {
            toast({
                duration: 2000,
                title: "Successfully cancelled",
                action: <ToastAction altText="Close">Close</ToastAction>,
                description: `Your ${
                    listing.listing_type === "donate" ? "request" : "offer"
                } has been cancelled.`,
            });
            await sendMessage(
                `I have cancelled my ${
                    listing.listing_type === "donate" ? "request" : "offer"
                }`,
                conversationId!
            );
        } else {
            toast({
                duration: 2000,
                action: <ToastAction altText="Close">Close</ToastAction>,
                variant: "destructive",
                title: "Error occurred",
                description: response.error,
            });
        }
        setOpen(false);
        setIsLoading(false);
    }

    async function handleEditTransaction() {
        setIsLoading(true);
        const transaction = await editTransaction(
            matchingTransaction?.id,
            goal
        );
        if (transaction.success) {
            console.log("Successfully updated");
            await sendMessage(
                `I have updated my ${
                    listing.listing_type === "donate" ? "request" : "offer"
                } to ${goal}kg`,
                conversationId!
            );
            toast({
                className: "z-10",
                duration: 2000,
                action: <ToastAction altText="Close">Close</ToastAction>,
                title: "Successfully updated",
                description: `Your ${
                    listing.listing_type === "donate" ? "request" : "offer"
                } has been updated to ${goal}kg.`,
            });
        } else {
            toast({
                duration: 2000,
                action: <ToastAction altText="Close">Close</ToastAction>,
                variant: "destructive",
                title: "Error occurred",
                description: transaction.error,
            });
        }
        setOpen(false);
        setIsLoading(false);
    }

    const [open, setOpen] = useState(false);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    className={`w-full px-6 ${
                        hasPendingTransaction &&
                        listing.listing_type === "donate"
                            ? "bg-blue-700"
                            : "bg-green-700"
                    }`}
                >
                    {hasPendingTransaction
                        ? listingType == "receive"
                            ? "View pending offer"
                            : "View pending request"
                        : listingType == "receive"
                        ? "Contribute"
                        : "Request"}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-1/2">
                <ScrollArea className="my-auto">
                    <div className="mx-auto my-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>
                                {listingOwner.username}{" "}
                                {listing.listing_type === "donate"
                                    ? "is offering"
                                    : "is requesting for"}{" "}
                                {listing.total_amount}kg of{" "}
                                {listing.listing_item_type}
                            </DrawerTitle>
                        </DrawerHeader>
                        <Separator />
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-inner">
                            <div className="text-left">
                                <div className="bg-white p-3 rounded-lg shadow mb-2">
                                    <div className="text-sm text-gray-700">
                                        Hi, I would like to{" "}
                                        {listingType === "receive"
                                            ? "offer"
                                            : "request"}{" "}
                                        <span className="font-bold">
                                            {goal} kg
                                        </span>{" "}
                                        of {listing.listing_item_type}
                                    </div>
                                </div>
                            </div>
                            {listingType === "receive" && (
                                <div className="flex items-center justify-center space-x-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 rounded-full"
                                        onClick={() => onClick(-1)}
                                        disabled={goal <= 1}
                                    >
                                        <MinusIcon className="h-4 w-4" />
                                        <span className="sr-only">
                                            Decrease
                                        </span>
                                    </Button>
                                    <div className="flex-1 text-center">
                                        <input
                                            pattern="\d*"
                                            type="text"
                                            className="text-5xl font-bold tracking-tighter text-center w-full"
                                            value={goal}
                                            onChange={onInputChange}
                                        />
                                        <div className="text-[0.70rem] uppercase text-muted-foreground">
                                            kg
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 rounded-full"
                                        onClick={() => onClick(1)}
                                        disabled={goal >= listing.total_amount}
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                        <span className="sr-only">
                                            Increase
                                        </span>
                                    </Button>
                                </div>
                            )}
                        </div>
                        <DrawerFooter className="mt-4">
                            {hasPendingTransaction ? (
                                <div className="space-y-2 flex flex-col">
                                    {listing.listing_type === "receive" && (
                                        <Button
                                            disabled={
                                                goal < 1 ||
                                                goal ===
                                                    matchingTransaction!
                                                        .donated_amount ||
                                                isLoading
                                            }
                                            onClick={handleEditTransaction}
                                        >
                                            Edit Offer
                                        </Button>
                                    )}
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteTransaction}
                                        disabled={isLoading}
                                    >
                                        Cancel{" "}
                                        {listing.listing_type === "donate"
                                            ? "Request"
                                            : "Offer"}
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    disabled={goal < 1 || isLoading}
                                    onClick={handleCreateTransaction}
                                >
                                    Start Chat
                                </Button>
                            )}
                        </DrawerFooter>
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
