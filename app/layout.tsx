import { GeistSans } from "geist/font/sans";
import { Navbar } from "@/components/(navbar)/navbar";
import "./globals.css";
import Notifications from "@/components/(navbar)/notifications";
import { LoginDialogProvider } from "./login/login-dialog-context";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/utils/supabase/server";
import LoginDialog from "./login/login-dialog";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Huntergatherers",
    description:
        "The only community app you'll ever need for your composting journey",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    return (
        <html lang="en" className={GeistSans.className}>
            <body className="bg-background text-foreground">
                <LoginDialogProvider>
                    <LoginDialog />
                    <main className="min-h-screen max-h-screen flex flex-col items-center safe-bottom">
                        <Navbar user={data.user}>
                            <Notifications />
                        </Navbar>
                        {children}
                    </main>
                    <Toaster />
                </LoginDialogProvider>
            </body>
        </html>
    );
}
