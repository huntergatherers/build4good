"use client";

import { Button } from "@/components/ui/button";
import { useLoginDialog } from "./login-dialog-context";

export default function LoginButton({ text }: { text: string }) {
    const { isOpen, closeDialog, openDialog } = useLoginDialog();
    return (
        <Button
            className="w-full"
            onClick={() => {
                openDialog();
            }}
        >
            {text}
        </Button>
    );
}
