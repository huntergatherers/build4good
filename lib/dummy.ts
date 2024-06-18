"use server";
import prisma, { listing_item_type_enum, listing_type_enum } from "./db";
import { checkListingStatus } from "./actions";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

// Ensure coordinates are within Singapore boundaries
const generateSingaporeCoordinates = () => {
    const lat = (Math.random() * (1.493 - 1.129) + 1.129).toFixed(6);
    const lon = (Math.random() * (104.131 - 103.557) + 103.557).toFixed(6);
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
};

// Function to determine listing item type based on profile's role
const getListingItemType = (
    profile: any,
    listingType: listing_type_enum
): listing_item_type_enum => {
    if (profile.is_donor) {
        return listingType === "donate" ? "greens" : "browns";
    }
    if (profile.is_gardener) {
        return "compost";
    }
    if (profile.is_composter) {
        return listingType === "donate" ? "compost" : "greens";
    }
    throw new Error("Invalid profile role");
};

// Function to get listing header and body
const getListingHeaderAndBody = (listingType: listing_type_enum, listingItemType: listing_item_type_enum): { header: string, body: string } => {
  if (listingType === 'donate') {
    if (listingItemType === 'greens') {
      return { header: 'Want to Donate Greens', body: 'I have greens available for donation. Feel free to submit a request.' };
    } else if (listingItemType === 'browns') {
      return { header: 'Wish to Donate Browns', body: 'I have browns available for donation. Feel free to submit a request.' };
    } else if (listingItemType === 'compost') {
      return { header: 'Have Compost to Give', body: 'I have compost available for donation. Feel free to submit a request.' };
    }
  } else if (listingType === 'receive') {
    if (listingItemType === 'greens') {
      return { header: 'Need Fruit Peels', body: 'I am looking for greens for my compost. Please contribute if you can help! Thanks.' };
    } else if (listingItemType === 'browns') {
      return { header: 'Want Wood Chips', body: 'I am looking for browns for my compost. Please contribute if you can help! Thanks.' };
    } else if (listingItemType === 'compost') {
      return { header: 'Anyone Have Compost?', body: 'I am looking for compost. Please contribute if you can help! Thanks.' };
    }
  }
  throw new Error('Invalid listing type or item type');
};


export async function createDummyData() {
  try {
    const profiles = await prisma.profiles.findMany();
    const listings: { id: number; profile_id: string; created_at: Date; header: string; body: string; coords_lat: number | null; coords_long: number | null; total_amount: number; deadline: Date; is_active: boolean; has_progress: boolean; listing_item_type: listing_item_type_enum; listing_type: listing_type_enum; }[] = [];

    for (let i = 0; i < 40; i++) {
      // Select a random profile
      const profile = profiles[Math.floor(Math.random() * profiles.length)];

      // Ensure the profile has a valid role
      if (!profile.is_donor && !profile.is_gardener && !profile.is_composter) {
        console.log(`Skipping profile ${profile.username} as it has no valid roles`);
        continue;
      }

            // Create Listings for Profile
            const listingTypes: listing_type_enum[] = ["receive", "donate"];
            const selectedListingType =
                listingTypes[Math.floor(Math.random() * listingTypes.length)];

      const listingItemType = getListingItemType(profile, selectedListingType);

      // Get listing header and body
      const { header, body } = getListingHeaderAndBody(selectedListingType, listingItemType);

      const coords = generateSingaporeCoordinates();
      const listing = await prisma.listing.create({
        data: {
          profile_id: profile.id,
          header,
          body,
          total_amount: faker.datatype.number({ min: 100, max: 1000 }),
          deadline: faker.date.soon(30),
          listing_type: selectedListingType,
          listing_item_type: listingItemType,
          is_active: true,
          has_progress: selectedListingType === 'receive',
          coords_lat: coords.lat,
          coords_long: coords.lon,
          ListingImage: {
            create: {
              url: faker.image.imageUrl(),
            },
          },
        },
      });

            listings.push({
                id: listing.id,
                profile_id: profile.id,
                created_at: listing.created_at,
                header: listing.header,
                body: listing.body,
                coords_lat: listing.coords_lat,
                coords_long: listing.coords_long,
                total_amount: listing.total_amount,
                deadline: listing.deadline,
                is_active: listing.is_active,
                has_progress: listing.has_progress,
                listing_item_type: listing.listing_item_type,
                listing_type: listing.listing_type,
            });
            console.log(`Listing created for profile ${profile.username}`);
        }

        for (let i = 0; i < 10; i++) {
            // Select a random listing
            const listing =
                listings[Math.floor(Math.random() * listings.length)];

            // Create Transactions for Listings
            const transactionStatuses = ["pending", "approved", "completed"];
            const status =
                transactionStatuses[
                    Math.floor(Math.random() * transactionStatuses.length)
                ];
            const transactionDate = faker.date.between(
                new Date(),
                listing.deadline
            );
            const approvedAt =
                status === "approved" || status === "completed"
                    ? transactionDate
                    : null;
            const completedAt = status === "completed" ? transactionDate : null;

            if (completedAt && completedAt > listing.deadline) continue;
            if (approvedAt && approvedAt > listing.deadline) continue;

      const transaction = await prisma.transaction.create({
        data: {
          listing_id: listing.id,
          donated_amount: faker.datatype.number({ min: 10, max: 100 }),
          created_at: transactionDate,
          approved_at: approvedAt,
          completed_at: completedAt,
          other_id: profiles[Math.floor(Math.random() * profiles.length)].id, // Selecting another random profile
        },
      });

            console.log(
                `Transaction ${status} created for listing ${listing.header}`
            );

      // Check and update listing status after adding transactions
      await checkListingStatus(listing.id);
    }

    for (let i = 0; i < 40; i++) {
      // Select a random profile
      const profile = profiles[Math.floor(Math.random() * profiles.length)];

      // Generate random coordinates within Singapore boundaries
      const coords = generateSingaporeCoordinates();

      // Insert into posts table
      await prisma.post.create({
        data: {
          profile_id: profile.id,
          created_at: new Date(),
          is_embedded: false,
          is_archived: false,
          header: 'Interesting post',
          body: 'This is an interesting post about sustainability and composting.',
          coords_lat: coords.lat,
          coords_long: coords.lon,
          embedded_url: null,
        },
      });

      console.log(`Post created for profile ${profile.username}`);
    }
  } catch (error) {
    console.error('Error creating dummy data:', error);
  } finally {
    console.log('Dummy data creation complete');
  }
}

createDummyData().catch((error) => {
  console.error('Error creating dummy data:', error);
  process.exit(1);
});
