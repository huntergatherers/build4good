"use client";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pills() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const getIconColor = (path: string, param: string, value: string) =>
        pathname === path && searchParams.get(param) === value
            ? "text-white bg-black p-2 px-4"
            : "text-black bg-gray-100 p-2 px-4 opacity-100";

    return (
        <div className="space-x-2 mb-6 self-start">
            <Link href="/listings?type=requests">
                <Badge
                    className={getIconColor("/listings", "type", "requests")}
                >
                    Requests
                </Badge>
            </Link>
            <Link href="/listings?type=offers">
                <Badge className={getIconColor("/listings", "type", "offers")}>
                    Offers
                </Badge>
            </Link>
            {/* <Link href="/community">
                <Badge className={getIconColor("/community", "", "")}>
                    My Listings
                </Badge>
            </Link> */}
        </div>
    );
}
