import { GeistSans } from "geist/font/sans";
import { Navbar } from "@/components/(navbar)/navbar";
import "./globals.css";
import Notifications from "@/components/(navbar)/notifications";
import UserMenu from "@/components/(navbar)/user-menu";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Huntergatherers",
    description:
        "The only community app you'll ever need for your composting journey",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={GeistSans.className}>
            <body className="bg-background text-foreground">
                <main className="min-h-screen max-h-screen flex flex-col items-center safe-bottom">
                    <Navbar>
                        <Notifications />
                    </Navbar>
                    {children}
                </main>
            </body>
        </html>
    );
}
