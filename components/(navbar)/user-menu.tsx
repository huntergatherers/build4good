import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth";
import {
    LogOut,
    Menu,
    NotepadText,
    PackagePlus,
    Pencil,
    Settings,
    User as UserLucide,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function UserMenu({ user }: { user: User | null }) {
    const { toast } = useToast();
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="bg-black rounded-full flex items-center justify-center h-8 w-8">
                <Menu color="white" size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[401]">
                <DropdownMenuLabel>Scrapbook</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link className="flex" href="/transactions">
                        <NotepadText size={18} className="mr-2" />
                        My transactions
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link className="flex" href="/listings/create">
                        <PackagePlus size={18} className="mr-2" />
                        Create a listing
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link className="flex" href="/community/new">
                        <Pencil size={18} className="mr-2" />
                        Write a post
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link className="flex" href="/profile">
                        <UserLucide size={18} className="mr-2" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user ? (
                    <DropdownMenuItem>
                        <div
                            className="flex text-red-600 font-semibold"
                            onClick={async () => {
                                const error = await signOut();
                                if (error) {
                                    console.error("Sign out error", error);
                                    return;
                                }
                                router.push("/");
                                router.refresh();
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
                                router.push("/login");
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
