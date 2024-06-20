"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
    const params = useSearchParams();
    const router = useRouter();
    const type = params.get("type");
    const filterString = params.get("filters");
    const filtersArray = filterString ? filterString.split(" ") : [];
    const distance = params.get("distance");
    const [searchTerm, setSearchTerm] = useState("");

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.set("search", searchTerm);
            router.push(`?${currentParams.toString()}`);
        }
    };

    return (
        <div className="relative w-full ml-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search..."
                className="rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
            />
        </div>
    );
}
