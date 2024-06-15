import Pills from "@/components/(navbar)/pills";

export default function ListingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="w-full p-6">
            <Pills />
            {children}
        </section>
    );
}
