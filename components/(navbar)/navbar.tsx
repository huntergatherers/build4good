"use client"
import Tabs from "./tabs";
import { usePathname } from "next/navigation";
import {
    Bell,
    Home,
    Inbox,
    LogOut,
    Menu,
    NotepadText,
    PackagePlus,
    Pencil,
    Search,
    Settings,
    SquarePlus,
    User,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar({children}: {children: React.ReactNode}) {
    const pathname = usePathname();
    return (
        <nav className={`w-full flex justify-between py-4 items-center px-6 ${
            pathname == "/map" ? "z-[401] absolute top-0" : ""
        }`}>
            <Tabs />
            <div className="flex justify-center items-center space-x-3">
            {children}
            <DropdownMenu>
                <DropdownMenuTrigger className="bg-black rounded-full flex items-center justify-center h-8 w-8">
                    <Menu color="white" size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-[401]">
                    <DropdownMenuLabel>ScraPals</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link className="flex" href="/new">
                            <NotepadText size={18} className="mr-2" />
                            My Requests
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link className="flex" href="/new">
                            <PackagePlus size={18} className="mr-2" />
                            Create a listing
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link className="flex" href="/new">
                            <Pencil size={18} className="mr-2" />
                            Write a post
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link className="flex" href="/new">
                            <User size={18} className="mr-2" />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link className="flex" href="/new">
                            <Settings size={18} className="mr-2" />
                            Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link className="flex" href="/new">
                            <LogOut size={18} className="mr-2" />
                            Log out
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        </nav>
    );
}
