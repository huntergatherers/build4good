import ListingHorizontalScroll from "@/components/listing-horizontal-scroll";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";
import { Filter, Search } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Index() {
    // const supabase = createClient();
    // const { data, error } = await supabase.auth.getUser();
    // if (error || !data?.user) {
    //     redirect("/login");
    // }

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
                <div className="text-xl font-bold mt-6">Fellow Scrappers are looking for...</div>
                <p className="text-xs text-gray-400 mb-4">Check out what other people are requesting!</p>
                <ListingHorizontalScroll listings={[1,2,3,4,5,6,7,8]}/>
                <div className="text-xl font-bold mt-6">Fellow Scrappers are donating...</div>
                <p className="text-xs text-gray-400 mb-4">Check out what other people are offering!</p>
                <ListingHorizontalScroll listings={[1,2,3,4,5,6,7,8]}/>
            </main>
        </div>
    );
}
