"use client";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { usePathname } from "next/navigation";

export default function Tabs() {
    const pathname = usePathname();

    const getIconColor = (path: string) =>
        pathname === path
            ? "text-white bg-black p-2 px-4"
            : "text-black bg-gray-100 p-2 px-4 opacity-100";

    return (
        <div
            className={`space-x-2 ${
                pathname == "/map" ? "z-[401]" : ""
            } `}
        >
            <Link href="/listings">
                <Badge className={getIconColor("/listings")}>Listings</Badge>
            </Link>
            <Link href="/map">
                <Badge className={getIconColor("/map")}>Map</Badge>
            </Link>
            <Link href="/community">
                <Badge className={getIconColor("/community")}>Community</Badge>
            </Link>
        </div>
    );
}
