import { Listing, Prisma } from "@prisma/client";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import ListingItemVertical from "./listing-item-vertical";

export type ListingWithTransaction = Prisma.ListingGetPayload<{
    include: {
        Transaction: true;
    };
}>;

interface ListingVerticleScrollProps {
    listings: ListingWithTransaction[];
}

const ListingVerticalScroll = async ({
    listings,
}: ListingVerticleScrollProps) => {
    return (
        <ScrollArea className="">
            <div className="space-y-8">
                {listings.map((listing, index: number) => (
                    <ListingItemVertical key={index} listing={listing} />
                ))}
            </div>
            <ScrollBar orientation="vertical" className="opacity-0" />
        </ScrollArea>
    );
};

export default ListingVerticalScroll;
