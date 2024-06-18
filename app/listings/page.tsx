"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, Filter, Search } from "lucide-react";
import prisma, { listing_type_enum, listing_item_type_enum } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import Pills from "@/components/(navbar)/pills";
import ListingVerticalScrollOne from "@/components/listing-vertical-scroll-one";
import { searchListings } from "@/lib/actions"; // Import the searchListings function
import { Listing, Transaction, ListingImage, profiles } from "@prisma/client";

type ListingWithDetails = Listing & {
    Transaction: Transaction[];
    ListingImage: ListingImage[];
    profiles: profiles;
};

export default function Index({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const [requestListings, setRequestListings] = useState<ListingWithDetails[]>([]);
    const [donationListings, setDonationListings] = useState<ListingWithDetails[]>([]);
    const [filters, setFilters] = useState({
        greens: false,
        browns: false,
        compost: false,
    });

    useEffect(() => {
        fetchListings();
    }, [filters]);

    const fetchListings = async () => {
        const listingItemTypes: listing_item_type_enum[] = [];
        if (filters.greens) listingItemTypes.push(listing_item_type_enum.greens);
        if (filters.browns) listingItemTypes.push(listing_item_type_enum.browns);
        if (filters.compost) listingItemTypes.push(listing_item_type_enum.compost);

        const requestListings = await searchListings({
            listingType: listing_type_enum.receive,
            listingItemType: listingItemTypes.length > 0 ? listingItemTypes : undefined,
            orderBy: "created_at",
            orderDirection: "desc",
            topK: 10,
        }) as ListingWithDetails[];

        const donationListings = await searchListings({
            listingType: listing_type_enum.donate,
            listingItemType: listingItemTypes.length > 0 ? listingItemTypes : undefined,
            orderBy: "created_at",
            orderDirection: "desc",
            topK: 10,
        }) as ListingWithDetails[];

        setRequestListings(requestListings.map(listing => ({
            ...listing,
            Transaction: listing.Transaction || [],
            ListingImage: listing.ListingImage || [],
            profiles: listing.profiles || { id: '', username: '', coords_lat: null, coords_long: null, is_composter: false, is_donor: false, is_gardener: false, last_activity: null, social_media_url: null },
        })));

        setDonationListings(donationListings.map(listing => ({
            ...listing,
            Transaction: listing.Transaction || [],
            ListingImage: listing.ListingImage || [],
            profiles: listing.profiles || { id: '', username: '', coords_lat: null, coords_long: null, is_composter: false, is_donor: false, is_gardener: false, last_activity: null, social_media_url: null },
        })));
    };

    const handleCheckboxChange = (e: React.FormEvent<HTMLButtonElement>) => {
        const { id, checked } = e.target as HTMLInputElement;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [id]: checked,
        }));
    };

    return (
        <div className="flex flex-col items-center w-full p-6">
            <Pills />
            <main className="flex-1 flex flex-col w-full">
                <div className="flex justify-center items-center space-x-2">
                    <div className="relative w-full ml-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        />
                    </div>
                    <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-md">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost">
                                    <Filter size={18} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-fit mr-6">
                                <div>
                                    <h1 className="font-medium text-lg">Filter by...</h1>
                                    <Separator className="my-2" />
                                    <div className="items-top flex space-x-2">
                                        <Checkbox id="greens" checked={filters.greens} onChange={handleCheckboxChange} />
                                        <div className="grid gap-1.5 leading-none">
                                            <label htmlFor="greens" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Greens
                                            </label>
                                            <p className="text-xs text-muted-foreground">Vegetables</p>
                                        </div>
                                    </div>
                                    <div className="items-top flex space-x-2 mt-4">
                                        <Checkbox id="browns" checked={filters.browns} onChange={handleCheckboxChange} />
                                        <div className="grid gap-1.5 leading-none">
                                            <label htmlFor="browns" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Browns
                                            </label>
                                            <p className="text-xs text-muted-foreground">Coffee Grounds...</p>
                                        </div>
                                    </div>
                                    <div className="items-top flex space-x-2 mt-4">
                                        <Checkbox id="compost" checked={filters.compost} onChange={handleCheckboxChange} />
                                        <div className="grid gap-1.5 leading-none">
                                            <label htmlFor="compost" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Compost
                                            </label>
                                            <p className="text-xs text-muted-foreground">Vermicompost and Aerobic.</p>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                {searchParams["type"] === "requests" ? (
                    <div className="mb-4">
                        <h1 className="text-md font-semibold my-4">Check out what people are requesting for</h1>
                        {requestListings.length > 0 ? (
                            <ListingVerticalScrollOne listings={requestListings} />
                        ) : (
                            <div>No listings found</div>
                        )}
                    </div>
                ) : (
                    <div className="mb-4">
                        <h1 className="text-md font-semibold my-4">Check out what people are giving away</h1>
                        {donationListings.length > 0 ? (
                            <ListingVerticalScrollOne listings={donationListings} />
                        ) : (
                            <div>No listings found</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
