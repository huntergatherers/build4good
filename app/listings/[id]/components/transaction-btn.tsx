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
import { useToast } from "@/components/ui/use-toast";
import {
    createTransaction,
    deleteTransaction,
    editTransaction,
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
}: {
    user: User | null;
    listing: ListingWithTransaction;
    listingOwner: profiles;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
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
        hasPendingTransaction ? matchingTransaction!.donated_amount : 0
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
        console.log("Creating transaction...");
        setIsLoading(true);
        await createTransaction(listing.id, goal);
        toast({
            className: "bg-green-500 text-white border-none",
            title: "Successfully created",
            description: `Your ${
                listing.listing_type === "donate" ? "request" : "offer"
            } has been created. You will be notified when it is accepted.`,
        });
        setOpen(false);
        setIsLoading(false);
        router.refresh();
    }

    async function handleDeleteTransaction() {
        setIsLoading(true);
        console.log("Deleting transaction...");
        await deleteTransaction(matchingTransaction?.id);
        toast({
            className: "bg-green-500 text-white border-none",
            title: "Successfully deleted",
            description: `Your ${
                listing.listing_type === "donate" ? "request" : "offer"
            } has been deleted.`,
        });
        setOpen(false);
        setIsLoading(false);
        router.refresh();
    }

    async function handleEditTransaction() {
        setIsLoading(true);
        console.log("Editing transaction...");
        await editTransaction(matchingTransaction?.id, goal);
        toast({
            className: "bg-green-500 text-white border-none",
            title: "Successfully updated",
            description: `Your ${
                listing.listing_type === "donate" ? "request" : "offer"
            } has been updated to ${goal}kg.`,
        });
        setOpen(false);
        setIsLoading(false);
        router.refresh();
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
                                    ? "is contributing"
                                    : "is requesting for"}{" "}
                                {listing.total_amount}kg of{" "}
                                {listing.listing_item_type}
                            </DrawerTitle>
                        </DrawerHeader>
                        <Separator />
                        <div className="mt-2 text-center">
                            You are{" "}
                            {listingType === "receive"
                                ? "offering..."
                                : "requesting..."}{" "}
                        </div>
                        <div className="p-4 pb-0">
                            <div className="flex items-center justify-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 rounded-full"
                                    onClick={() => onClick(-1)}
                                    disabled={goal <= 0}
                                >
                                    <MinusIcon className="h-4 w-4" />
                                    <span className="sr-only">Decrease</span>
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
                                    <span className="sr-only">Increase</span>
                                </Button>
                            </div>
                        </div>
                        <DrawerFooter>
                            {hasPendingTransaction ? (
                                <div className="space-y-2 flex flex-col">
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
                                        {listing.listing_type === "donate"
                                            ? "Edit Request"
                                            : "Edit Offer"}
                                    </Button>
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
                                    {listing.listing_type === "donate"
                                        ? "Create Request"
                                        : "Create Offer"}
                                </Button>
                            )}
                        </DrawerFooter>
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
