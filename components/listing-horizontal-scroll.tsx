import ListingItem from "./listing-item";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const ListingHorizontalScroll = async ({ listings }: any) => {
    // const listing = await prisma.listings.findAll({
    //     where: {

    //     }
    // })
    return (
        <ScrollArea className="">
            <div className="flex space-x-4">
                {listings.map((listing: any, index: number) => (
                    <ListingItem key={index} listing={listing} />
                ))}
            </div>
            <ScrollBar orientation="horizontal" className="opacity-0" />
        </ScrollArea>
    );
};

export default ListingHorizontalScroll;
