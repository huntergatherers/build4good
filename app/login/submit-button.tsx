"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function SubmitButton({ isSignup }: { isSignup: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending}>
            {isSignup ? "Sign Up" : "Sign In"}
        </Button>
    );
}
