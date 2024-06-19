"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default async function ViewChatButton({
    conversationId,
}: {
    conversationId: string;
}) {
    const router = useRouter();
    return (
        <Button
            onClick={() => {
                router.push(`/chats/${conversationId}`);
            }}
            className="w-full bg-green-600"
        >
            View Chat
        </Button>
    );
}
