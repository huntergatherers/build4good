"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackBtn({
    className,
    label,
}: {
    className?: string;
    label: string;
}) {
    const router = useRouter();
    return (
        <Button
            variant={"secondary"}
            onClick={() => router.back()}
            className={cn(
                "flex items-center space-x-2 text-muted-foreground self-start",
                className
            )}
        >
            <ArrowLeft />
            <span>{label}</span>
        </Button>
    );
}
