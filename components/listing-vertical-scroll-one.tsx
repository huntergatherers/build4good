import { Listing, Prisma } from '@prisma/client';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import ListingItemVertical from './listing-item-one';
import ListingItem from './listing-item';
import ListingItemOne from './listing-item-one';

export type ListingWithTransactionAndImage = Prisma.ListingGetPayload<{
  include: {
    Transaction: true;
    ListingImage: true;
    profiles: true
  };
}>;

interface ListingVerticleScrollProps {
  listings: ListingWithTransactionAndImage[];
}

const ListingVerticalScrollOne = async ({
  listings,
}: ListingVerticleScrollProps) => {
  return (
    <ScrollArea className="">
        <div className="grid grid-cols-1 gap-y-6">
          {listings.map((listing, index: number) => (
            <ListingItemOne key={index} listing={listing} showDescription={true} />
          ))}
        </div>
      <ScrollBar orientation="vertical" className="opacity-0" />
    </ScrollArea>
  );
};

export default ListingVerticalScrollOne;
