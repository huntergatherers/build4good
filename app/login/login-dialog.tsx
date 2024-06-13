"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useLoginDialog } from "./login-dialog-context";
import AuthForm from "./page";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

export default function LoginDialog() {
    const { isOpen, closeDialog } = useLoginDialog();

    return (
        <Drawer open={isOpen} onClose={closeDialog}>
            <DrawerContent className="z-[500] h-1/2">
                <AuthForm
                    searchParams={{
                        message: "",
                    }}
                    closeDialog={closeDialog}
                />
            </DrawerContent>
        </Drawer>
    );
}
