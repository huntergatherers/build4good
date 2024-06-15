"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackBtn() {
    const router = useRouter();
    return (
        <Button
            variant={"secondary"}
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-muted-foreground"
        >
            <ArrowLeft />
            <span>Back</span>
        </Button>
    );
}
