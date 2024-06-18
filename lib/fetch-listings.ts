import prisma, { listing_type_enum, listing_item_type_enum } from "./db";

export async function fetchListings(filters: {
    greens: boolean;
    browns: boolean;
    compost: boolean;
}) {
    const listingItemTypes: listing_item_type_enum[] = [];
    if (filters.greens) listingItemTypes.push(listing_item_type_enum.greens);
    if (filters.browns) listingItemTypes.push(listing_item_type_enum.browns);
    if (filters.compost) listingItemTypes.push(listing_item_type_enum.compost);

    if (listingItemTypes.length > 0) {
        const requestListings = await prisma.listing.findMany({
            take: 10,
            where: {
                listing_type: listing_type_enum.receive,
                listing_item_type: {
                    in: listingItemTypes,
                },
            },
            orderBy: {
                created_at: "desc",
            },
            include: {
                Transaction: true,
                ListingImage: true,
                profiles: true,
            },
        });

        const donationListings = await prisma.listing.findMany({
            take: 10,
            where: {
                listing_type: listing_type_enum.donate,
                listing_item_type: {
                    in: listingItemTypes,
                },
            },
            orderBy: {
                created_at: "desc",
            },
            include: {
                Transaction: true,
                ListingImage: true,
                profiles: true,
            },
        });

        return { requestListings, donationListings };
    } else {
        const requestListings = await prisma.listing.findMany({
            take: 10,
            where: {
                listing_type: listing_type_enum.receive,
            },
            orderBy: {
                created_at: "desc",
            },
            include: {
                Transaction: true,
                ListingImage: true,
                profiles: true,
            },
        });

        const donationListings = await prisma.listing.findMany({
            take: 10,
            where: {
                listing_type: listing_type_enum.donate,
            },
            orderBy: {
                created_at: "desc",
            },
            include: {
                Transaction: true,
                ListingImage: true,
                profiles: true,
            },
        });

        return { requestListings, donationListings };
    }
}
