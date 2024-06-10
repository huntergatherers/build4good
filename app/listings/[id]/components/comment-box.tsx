"use client";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
export default function CommentBox() {
    return (
        <div className="flex flex-col w-full mt-6">
            <Textarea
                className="w-full p-4 bg-background border border-foreground rounded-lg"
                placeholder="Add a comment..."
            />
            <div className="flex justify-end mt-2">
                <SendHorizontal />
            </div>
        </div>
    );
}
