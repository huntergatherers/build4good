"use client";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { useRouter } from "next/navigation";
import { ListingWithTransaction } from "./listing-horizontal-scroll";

interface ListingItemProps {
    listing: ListingWithTransaction;
}

const ListingItem = ({ listing }: ListingItemProps) => {
    const router = useRouter();
    const progress = listing.Transaction.reduce(
        (acc, transaction) => acc + transaction.donated_amount,
        0
    );
    console.log(progress);
    return (
        <div
            className="flex items-start flex-col w-36"
            onClick={() => {
                router.push(`/listings/${listing.id}`);
            }}
        >
            <div className="w-36 h-36">
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
                {listing.listing_type === "donate" ? "claimed" : "donated"}
            </label>
            <div className="font-medium text-base mt-1 line-clamp-2 w-36">
                {listing.header}
            </div>
        </div>
    );
};

export default ListingItem;
