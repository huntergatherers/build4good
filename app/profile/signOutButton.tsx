"use client"
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";

export default async function SignOutButton() {
    return (
        <Button
            className="w-full bg-red-600"
            onClick={async () => {
                await signOut();
            }}
        >
            Sign out
        </Button>
    );
}
