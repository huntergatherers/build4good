"use client";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { useRouter } from "next/navigation";
import { ListingWithTransactionAndImage } from "./listing-vertical-scroll-one";
import { MapPinned } from "lucide-react";
import ProfilePic from "./profile.png";
import { formatDateTimeAgo } from "@/lib/utils";

interface ListingItemProps {
    listing: ListingWithTransactionAndImage;
    showDescription?: boolean;
}

const ListingItemOne = ({ listing, showDescription }: ListingItemProps) => {
    const router = useRouter();
    const progress = listing.Transaction.filter(
        (transaction) => transaction.completed_at
    ).reduce((acc, transaction) => acc + transaction.donated_amount, 0);

    return (
        <div
            className="flex items-center cursor-pointer"
            onClick={() => {
                router.push(`/listings/${listing.id}`);
            }}
        >
            <div className="relative flex-shrink-0 w-24 h-24 mr-4">
                <div
                    className={`text-[0.6rem] text-white absolute -left-[1px] top-2 p-1 rounded-r-md z-10 ${
                        listing.listing_item_type === "greens"
                            ? "bg-green-600 bg-opacity-90"
                            : listing.listing_item_type === "browns"
                            ? "bg-amber-700 bg-opacity-90"
                            : "bg-cyan-700 bg-opacity-90"
                    }`}
                >
                    {listing.listing_item_type}
                </div>
                <div className="relative w-full h-full">
                    <Image
                        className="rounded-lg object-cover"
                        src={
                            listing.ListingImage.length > 0
                                ? listing.ListingImage[0].url
                                : "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        layout="fill"
                        alt={listing.header}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-center flex-grow">
                <div className="flex justify-between items-center">
                    <div className="flex justify-center space-x-2 items-center">
                        <div className="h-4 w-4 rounded-full relative border-gray-800">
                            <Image
                                className="rounded-full object-cover border-gray-800"
                                src={ProfilePic}
                                alt="profile image"
                                fill
                            />
                        </div>
                        <h1 className="text-xs">{listing.profiles.username}</h1>
                    </div>
                    <div className="flex items-center">
                        <MapPinned size={15} className="text-gray-400" />
                        <div className="ml-1 text-xs font-semibold text-gray-400">
                            2.4km
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-400">
                        {formatDateTimeAgo(listing.created_at)}
                    </p>
                </div>
                <div className="font-medium text-base mt-1 line-clamp-2 w-full text-left">
                    {listing.header}
                </div>
                {showDescription && (
                    <div className="font-light text-sm line-clamp-2 w-full mb-1 text-left h-6">
                        {listing.body}
                    </div>
                )}
                <Progress
                    value={(progress / listing.total_amount) * 100}
                    className={`mt-1 h-[6px] ${
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
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ListingItemOne;
