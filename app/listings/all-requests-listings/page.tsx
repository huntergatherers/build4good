import ListingVerticleScroll from "@/components/listing-vertical-scroll";
import { Input } from "@/components/ui/input";
import prisma, { listing_type_enum } from "@/lib/db";
import { Search } from "lucide-react";

export default async function AllDonationsListing() {
    const requestListings = await prisma.listing.findMany({
        take: 10,
        where: {
            listing_type: listing_type_enum.receive,
        },
        orderBy: {
            created_at: "desc",
        },
        include: {
            Transaction: true,
        },
    });
    return (
        <div className="w-[100vw] p-6">
            <div className="relative w-full ml-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
            </div>
            <h1 className="text-xl font-semibold my-4">
                People are looking for...
            </h1>
            <ListingVerticleScroll listings={requestListings} />
        </div>
    );
}
