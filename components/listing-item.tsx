"use client";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { useRouter } from "next/navigation";
import { ListingWithTransaction } from "./listing-horizontal-scroll";
import { Apple, Recycle, Sprout, Trash } from "lucide-react";
import { listing_type_enum } from "@/lib/db";

interface ListingItemProps {
    listing: ListingWithTransaction;
    showDescription?: boolean;
}

const ListingItem = ({ listing, showDescription }: ListingItemProps) => {
    const router = useRouter();
    const progress = listing.Transaction.filter(
        (transaction) => transaction.completed_at
    ).reduce((acc, transaction) => acc + transaction.donated_amount, 0);
    return (
        <div
            className="flex items-start flex-col w-36 cursor-pointer"
            onClick={() => {
                router.push(`/listings/${listing.id}`);
            }}
        >
            <div className="relative w-36 h-36">
                <div
                    className={`text-[0.6rem] text-white absolute -left-[1px] top-2 p-1 rounded-r-sm ${
                        listing.listing_item_type === "greens"
                            ? "bg-green-600"
                            : listing.listing_item_type === "browns"
                            ? "bg-amber-600"
                            : "bg-blue-800"
                    }`}
                >
                    {listing.listing_item_type}
                </div>
                <Image
                    className="rounded-lg object-cover"
                    src="https://images.unsplash.com/photo-1495615080073-6b89c9839ce0"
                    width={1000} // Use appropriate width for your design (e.g., 224 for w-56)
                    height={1000} // Use the same height to keep it square
                    alt={listing.header}
                />
            </div>
            <Progress
                value={(progress / listing.total_amount) * 100}
                className={`h-[6px] ${
                    listing.listing_type === "donate"
                        ? "[&>*]:bg-blue-700"
                        : "[&>*]:bg-green-700"
                }`}
            />
            <div className="flex justify-between w-full">
                <label
                    className={`text-xs mt-1 ${
                        listing.listing_type === "donate"
                            ? "text-blue-700"
                            : "text-green-700"
                    }`}
                >
                    <span className="font-bold">
                        {progress}/{listing.total_amount}kg
                    </span>{" "}
                    {listing.listing_type === "donate"
                        ? "claimed"
                        : "contributed"}
                    {/* <p className="text-right"><Apple/></p> */}
                </label>
            </div>
            <div className="font-medium text-base mt-1 line-clamp-2 w-36">
                {listing.header}
            </div>
            {showDescription && (
                <div className="font-light text-sm mt-1 line-clamp-2 w-36 mb-1">
                    {listing.body}
                </div>
            )}
        </div>
    );
};

export default ListingItem;
