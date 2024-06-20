import { Listing, Prisma } from "@prisma/client";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import ListingItemVertical from "./listing-item-one";
import ListingItem from "./listing-item";
import ListingItemOne from "./listing-item-one";
import { getCurrentDistanceToInstance } from "@/lib/actions";

export type ListingWithTransactionAndImage = Prisma.ListingGetPayload<{
    include: {
        Transaction: true;
        ListingImage: true;
        profiles: true;
    };
}>;

interface ListingVerticleScrollProps {
    isDistanceFilterOn: boolean;
    listings: ListingWithTransactionAndImage[];
}

const ListingVerticalScrollOne = async ({
  isDistanceFilterOn, listings
}: ListingVerticleScrollProps) => {
    return (
        <ScrollArea className="">
            <div className="grid grid-cols-1 gap-y-8">
                {listings.map(async (listing, index: number) => {
                    const distance = await getCurrentDistanceToInstance({
                        coords_lat: listing.coords_lat,
                        coords_long: listing.coords_long,
                    });
                    if (isDistanceFilterOn && distance! > 2) return null;
                    return (
                        <ListingItemOne
                            key={index}
                            distance={distance}
                            listing={listing}
                            showDescription={true}
                        />
                    );
                })}
            </div>
            <ScrollBar orientation="vertical" className="opacity-0" />
        </ScrollArea>
    );
};

export default ListingVerticalScrollOne;
