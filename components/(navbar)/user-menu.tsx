import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUserClient } from "@/lib/auth";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
    LogOut,
    Menu,
    NotepadText,
    PackagePlus,
    Pencil,
    Settings,
    User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserMenu() {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    useEffect(() => {
        const getUser = async () => {
            const user = await getCurrentUserClient();
            console.log(user);
            setUser(user);
        };
        getUser();
    }, []);
    return (
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
                {user ? (
                    <DropdownMenuItem>
                        <div
                            className="flex"
                            onClick={async () => {
                                // const { error } = await supabase.auth.signOut()
                            }}
                        >
                            <LogOut size={18} className="mr-2" />
                            Log out
                        </div>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem>
                        <div
                            className="flex"
                            onClick={async () => {
                                // const { error } = await supabase.auth.signOut()
                            }}
                        >
                            <LogOut size={18} className="mr-2" />
                            Log in
                        </div>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
