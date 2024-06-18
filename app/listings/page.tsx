import { Search } from "lucide-react";
import prisma, { listing_item_type_enum, listing_type_enum } from "@/lib/db";
import { Input } from "@/components/ui/input";
import Pills from "@/components/(navbar)/pills";
import ListingVerticalScrollOne from "@/components/listing-vertical-scroll-one";
import AboutUsPopUp from "@/components/aboutus-popup";
import ListingsFilter from "./create/filter";

function getFilterConditions(filters: string | undefined) {
    if (!filters) return {};
    console.log(filters);
    const filterArray = filters.split(" ");
    const conditions: { OR: any[] } = { OR: [] };

    filterArray.forEach((filter) => {
        if (filter === "greens") {
            conditions.OR.push({ listing_item_type: "greens" });
        } else if (filter === "browns") {
            conditions.OR.push({ listing_item_type: "browns" });
        } else if (filter === "compost") {
            conditions.OR.push({ listing_item_type: "compost" });
        }
    });

    return conditions;
}

export default async function Index({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const type = searchParams["type"];
    const filters = searchParams["filters"] as string | undefined;

    const filterConditions = getFilterConditions(filters);

    const requestListings = await prisma.listing.findMany({
        where: {
            listing_type: listing_type_enum.receive,
            ...filterConditions,
        },
        orderBy: {
            created_at: "desc",
        },
        include: {
            Transaction: true,
            ListingImage: true,
            profiles: true,
        },
    });

    const donationListings = await prisma.listing.findMany({
        where: {
            listing_type: listing_type_enum.donate,
            ...filterConditions,
        },
        orderBy: {
            created_at: "desc",
        },
        include: {
            Transaction: true,
            ListingImage: true,
            profiles: true,
        },
    });

    return (
        <div className="flex flex-col items-center w-full p-6">
            <div className="hidden">
                <AboutUsPopUp />
            </div>
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
                        <ListingsFilter type={type} />
                    </div>
                </div>
                {type === "requests" ? (
                    <div className="mb-4">
                        <h1 className="text-md font-semibold my-4">
                            Check out what people are requesting for
                        </h1>
                        <ListingVerticalScrollOne listings={requestListings} />
                    </div>
                ) : (
                    <div className="mb-4">
                        <h1 className="text-md font-semibold my-4">
                            Check out what people are giving away
                        </h1>
                        <ListingVerticalScrollOne listings={donationListings} />
                    </div>
                )}
            </main>
        </div>
    );
}
