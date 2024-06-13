import { Listing, Prisma } from "@prisma/client";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import ListingItemVertical from "./listing-item-vertical";
import ListingItem from "./listing-item";

export type ListingWithTransactionAndImage = Prisma.ListingGetPayload<{
    include: {
        Transaction: true;
        ListingImage: true;
    };
}>;

interface ListingVerticleScrollProps {
    listings: ListingWithTransactionAndImage[];
}

const ListingVerticalScroll = async ({
    listings,
}: ListingVerticleScrollProps) => {
    return (
        <ScrollArea className="">
            <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-x-8">
                    {listings.map((listing, index: number) => (
                        <ListingItem
                            key={index}
                            listing={listing}
                            showDescription={true}
                        />
                    ))}
                </div>
            </div>
            <ScrollBar orientation="vertical" className="opacity-0" />
        </ScrollArea>
    );
};

export default ListingVerticalScroll;
