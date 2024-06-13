import ListingHorizontalScroll from "@/components/listing-horizontal-scroll";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";
import { ChevronRight, Filter, Search } from "lucide-react";
import { redirect } from "next/navigation";
import prisma, { listing_type_enum } from "@/lib/db";
import Link from "next/link";
export default async function Index() {
    // const supabase = createClient();
    // const { data, error } = await supabase.auth.getUser();
    // if (error || !data?.user) {
    //     redirect("/login");
    // }
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

    const donationListings = await prisma.listing.findMany({
        take: 10,
        where: {
            listing_type: listing_type_enum.donate,
        },
        orderBy: {
            created_at: "desc",
        },
        include: {
            Transaction: true,
        },
    });
    return (
        <div className="flex flex-col items-center w-full p-6">
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
                        <Filter size={18} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xl font-bold mt-6">
                            Looking for...
                        </div>
                        <p className="text-xs text-gray-400 mb-4">
                            Check out what other people are requesting for!
                        </p>
                    </div>
                    <Link  href="/listings/all-requests-listings" className="text-xs flex items-center justify-center text-gray-600">
                        View all <ChevronRight />
                    </Link>
                </div>

                <ListingHorizontalScroll listings={requestListings} />
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xl font-bold mt-6">
                            Giving away...
                        </div>
                        <p className="text-xs text-gray-400 mb-4">
                            Check out what other people are giving away!
                        </p>
                    </div>
                    <Link href="/listings/all-donations-listings" className="text-xs flex items-center justify-center text-gray-600">
                        View all <ChevronRight />
                    </Link>
                </div>

                <ListingHorizontalScroll listings={donationListings} />
            </main>
        </div>
    );
}
