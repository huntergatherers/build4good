"use client";
import React, { useEffect, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Filters {
    greens: boolean;
    browns: boolean;
    compost: boolean;
}

export default function ListingsFilter({
    type,
}: {
    type: string | string[] | undefined;
}) {
    const router = useRouter();
    const params = useSearchParams();
    const filterString = params.get("filters");

    const parseFilterString = (filterString: string | null): Filters => {
        const filtersArray = filterString ? filterString.split(" ") : [];
        return {
            greens: filtersArray.includes("greens"),
            browns: filtersArray.includes("browns"),
            compost: filtersArray.includes("compost"),
        };
    };

    const [filters, setFilters] = useState<Filters>(
        parseFilterString(filterString)
    );

    useEffect(() => {
        setFilters(parseFilterString(filterString));
    }, [filterString]);

    const handleCheckboxChange = (id: keyof Filters, checked: boolean) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [id]: checked,
        }));
    };

    const applyFilters = () => {
        console.log(filters);
        const selectedFilters = Object.keys(filters).filter(
            (filter) => filters[filter as keyof Filters]
        );
        const filterString = selectedFilters.join("+");
        console.log(filterString);
        router.push(`/listings?type=${type}&filters=${filterString}`);
    };

    return (
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
                        <Checkbox
                            checked={filters.greens}
                            id="greens"
                            onCheckedChange={(checked: boolean) =>
                                handleCheckboxChange("greens", checked)
                            }
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="greens"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Greens
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Vegetables, Fruit peels...
                            </p>
                        </div>
                    </div>
                    <div className="items-top flex space-x-2 mt-4">
                        <Checkbox
                            checked={filters.browns}
                            id="browns"
                            onCheckedChange={(checked: boolean) =>
                                handleCheckboxChange("browns", checked)
                            }
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="browns"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Browns
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Dried leaves, Coffee Grounds...
                            </p>
                        </div>
                    </div>
                    <div className="items-top flex space-x-2 mt-4">
                        <Checkbox
                            checked={filters.compost}
                            id="compost"
                            onCheckedChange={(checked: boolean) =>
                                handleCheckboxChange("compost", checked)
                            }
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="compost"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Compost
                            </label>
                        </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-center">
                        <Button onClick={applyFilters}>Apply Filter</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
