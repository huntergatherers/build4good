"use client";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { useRouter } from "next/navigation";
import { ListingWithTransaction } from "./listing-horizontal-scroll";
import { Apple, Recycle, Sprout,Trash  } from 'lucide-react';
import { listing_type_enum } from "@/lib/db";

interface ListingItemProps {
    listing: ListingWithTransaction;
}

const ListingItemVertical = ({ listing }: ListingItemProps) => {
    const router = useRouter();
    const progress = listing.Transaction.reduce(
        (acc, transaction) => acc + transaction.donated_amount,
        0
    );
    console.log(progress);
    return (
        <div
            className="flex w-full"
            onClick={() => {
                router.push(`/listings/${listing.id}`);
            }}
        >
            <div className="w-[7.5rem] h-[7.5rem] mr-6">
                <Image
                    className="rounded-lg object-cover"
                    src="https://images.unsplash.com/photo-1495615080073-6b89c9839ce0"
                    width={1000} // Use appropriate width for your design (e.g., 224 for w-56)
                    height={1000} // Use the same height to keep it square
                    alt={listing.header}
                />
            </div>
            <div className="">
            <div className="font-bold text-sm mt-1 line-clamp-2 w-48 mb-1">
                {listing.header}
            </div>
            <div className="font-light text-sm mt-1 line-clamp-3 w-48 mb-1 h-16">
                {listing.body}
            </div>
            <div>
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
                {listing.listing_type === "donate" ? "claimed" : "donated"}
                
            </label>
            {listing.listing_item_type === "greens" ?
            <div className="mt-1">
            <Apple size={16} color="#87b093" fill="#a4d6b3"/>
            </div> :
            listing.listing_item_type === "browns" ?
            <Sprout size={19} color="#9c7649" fill="#9c7649"/> :
            <div className="mt-1">
                 <Recycle size={17} color="#74a5c3" fill="#5ac4e7"/>
            </div>
            }           
            </div>
            </div>
            </div>
            
        </div>
    );
};

export default ListingItemVertical;
