'use client'
import ListingItem from "./listing-item";

const ListingHorizontalScroll = ({ listings }: any) => {
    return (
        <div className="flex overflow-x-auto space-x-4">
            {listings.map((listing: any, index: number) => (
                <ListingItem key={index} listing={listing} />
            ))}
        </div>
    );
};

export default ListingHorizontalScroll;
