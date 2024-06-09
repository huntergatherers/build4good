"use client";
import {
    Bell,
    Home,
    LogOut,
    Menu,
    PackagePlus,
    Pencil,
    Search,
    Settings,
    SquarePlus,
    User,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { usePathname } from "next/navigation";
import { Menubar, MenubarContent } from "./ui/menubar";
import {
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@radix-ui/react-menubar";
import { Separator } from "./ui/separator";

export function Navbar() {
    const pathname = usePathname();

    const getIconColor = (path: string) =>
        pathname === path
            ? "text-white bg-black p-2 px-4"
            : "text-black bg-gray-100 p-2 px-4 opacity-100";

    return (
        <nav className={`w-full flex justify-between py-4 items-center z-[401] px-6 ${pathname == "/map" ? 'absolute top-0' : ''}`}>
            <div className="space-x-2">
                <Link href="/">
                    <Badge className={getIconColor("/")}>
                        Listings
                    </Badge>
                </Link>
                <Link href="/map">
                    <Badge className={getIconColor("/map")}>Map</Badge>
                </Link>
                <Link href="/community">
                    <Badge className={getIconColor("/community")}>
                        Community
                    </Badge>
                </Link>
            </div>
            <Menubar className="border-none bg-black rounded-full flex items-center justify-center h-8 w-8 text-xs">
                <MenubarMenu>
                    <MenubarTrigger>
                        <Menu color="white" size={18} />
                    </MenubarTrigger>
                    <MenubarContent className="space-y-1 flex flex-col my-4 z-[401]">
                        <div className="p-2 font-bold">ScraPals</div>
                        <Separator />
                        <Link className="p-2 flex" href="/new">
                            <PackagePlus className="mr-2" />
                            Create a listing
                        </Link>
                        <Link className="p-2 flex" href="/new">
                            <Pencil className="mr-2" />
                            Write a post
                        </Link>
                        <Separator />
                        <Link className="p-2 flex" href="/new">
                            <User className="mr-2" />
                            Profile
                        </Link>
                        <Link className="p-2 flex" href="/new">
                            <Settings className="mr-2" />
                            Settings
                        </Link>
                        <Separator />
                        <Link className="p-2 flex" href="/new">
                            <LogOut className="mr-2" />
                            Log out
                        </Link>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </nav>
    );
}
