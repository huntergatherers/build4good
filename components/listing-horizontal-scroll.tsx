"use client";
import ListingItem from "./listing-item";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const ListingHorizontalScroll = ({ listings }: any) => {
    return (
        <ScrollArea className="">
            <div className="flex space-x-4">
                {listings.map((listing: any, index: number) => (
                    <ListingItem key={index} listing={listing} />
                ))}
            </div>
            <ScrollBar orientation="horizontal" className="opacity-0"/>
        </ScrollArea>
    );
};

export default ListingHorizontalScroll;
