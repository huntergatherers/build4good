import { GeistSans } from "geist/font/sans";
import { Navbar } from "@/components/navbar";
import "./globals.css";

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
            <body className="bg-background text-foreground p-6">
                <main className="min-h-screen flex flex-col items-center">
                    <Navbar />
                    {children}
                </main>
            </body>
        </html>
    );
}
