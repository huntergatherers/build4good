"use client";
import Tabs from "./tabs";
import { usePathname } from "next/navigation";
import UserMenu from "./user-menu";

export function Navbar({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <nav
            className={`w-full flex justify-between py-4 items-center px-6 ${
                pathname == "/map" ? "z-[401] absolute top-0" : ""
            }`}
        >
            <Tabs />
            <div className="flex justify-center items-center space-x-3">
                {children}
                <UserMenu />
            </div>
        </nav>
    );
}
