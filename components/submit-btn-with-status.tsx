"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function SubmitButtonWithStatus({ text }: { text: string }) {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {text}
        </Button>
    );
}
