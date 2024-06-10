import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Inbox } from "lucide-react";
import prisma from "@/lib/db";

export default async function Notifications() {
    const user = await prisma.profiles.findUnique({
        where: {
            username: "adenteo1",
        },
        include: {
            users: true,
        },
    });
    console.log(user)
    return (
        <Sheet>
        <SheetTrigger>
            <Inbox size={24} />
        </SheetTrigger>
        <SheetContent className="z-[402] w-full">
            <SheetHeader>
                <SheetTitle>Notifications for {user?.username}</SheetTitle>
            </SheetHeader>
        </SheetContent>
    </Sheet>
    )
}