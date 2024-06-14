"use server";
import prisma, {
  listing_item_type_enum,
  listing_type_enum,
} from "./db";
import { checkListingStatus } from "./actions";
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

// Ensure coordinates are within Singapore boundaries
const generateSingaporeCoordinates = () => {
  const lat = (Math.random() * (1.493 - 1.129) + 1.129).toFixed(6);
  const lon = (Math.random() * (104.131 - 103.557) + 103.557).toFixed(6);
  return { lat: parseFloat(lat), lon: parseFloat(lon) };
};

// Function to determine listing item type based on profile's role
const getListingItemType = (profile: any, listingType: listing_type_enum): listing_item_type_enum => {
  if (profile.is_donor) {
    return listingType === 'donate' ? 'greens' : 'browns';
  }
  if (profile.is_gardener) {
    return 'compost';
  }
  if (profile.is_composter) {
    return listingType === 'donate' ? 'compost' : 'greens';
  }
  throw new Error('Invalid profile role');
};

export async function createDummyData() {
  try {
    const profiles: { id: string; username: string; coords_lat: number; coords_long: number; is_composter: boolean; is_donor: boolean; is_gardener: boolean; }[] = [];
    const listings: { id: number; profile_id: string; created_at: Date; header: string; body: string; coords_lat: number | null; coords_long: number | null; total_amount: number; deadline: Date; is_active: boolean; has_progress: boolean; listing_item_type: listing_item_type_enum; listing_type: listing_type_enum; }[] = [];

    for (let i = 0; i < 30; i++) {
      const userId = uuidv4();

      // Generate coordinates
      const coords = generateSingaporeCoordinates();

      // Create User and Profile
      const user = await prisma.users.create({
        data: {
          id: userId,
          email: faker.internet.email(),
          encrypted_password: faker.internet.password(),
          created_at: faker.date.recent(),
          updated_at: faker.date.recent(),
        },
      });

      const profileData = {
        username: faker.internet.userName(),
        coords_lat: coords.lat,
        coords_long: coords.lon,
        is_composter: faker.datatype.boolean(),
        is_donor: faker.datatype.boolean(),
        is_gardener: faker.datatype.boolean(),
        last_activity: faker.date.recent(),
        social_media_url: faker.internet.url(),
      };

      const profile = await prisma.profiles.create({
        data: {
          ...profileData,
          users: {
            connect: { id: user.id },
          },
        },
      });

      profiles.push({ id: user.id, ...profileData });
      console.log(`User and profile created for iteration ${i + 1}`);
    }

    for (let i = 0; i < 40; i++) {
      // Select a random profile
      const profile = profiles[Math.floor(Math.random() * profiles.length)];

      // Create Listings for Profile
      const listingTypes: listing_type_enum[] = ['receive', 'donate'];
      const selectedListingType = listingTypes[Math.floor(Math.random() * listingTypes.length)];

      const listingItemType = getListingItemType(profile, selectedListingType);

      const coords = generateSingaporeCoordinates();
      const listing = await prisma.listing.create({
        data: {
          profile_id: profile.id,
          header: faker.commerce.productName(),
          body: faker.commerce.productDescription(),
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

    for (let i = 0; i < 60; i++) {
      // Select a random listing
      const listing = listings[Math.floor(Math.random() * listings.length)];

      // Create Transactions for Listings
      const transactionStatuses = ['pending', 'approved', 'completed'];
      const status = transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)];
      const transactionDate = faker.date.between(new Date(), listing.deadline);
      const approvedAt = status === 'approved' || status === 'completed' ? transactionDate : null;
      const completedAt = status === 'completed' ? transactionDate : null;

      if (completedAt && completedAt > listing.deadline) continue;
      if (approvedAt && approvedAt > listing.deadline) continue;

      const transaction = await prisma.transaction.create({
        data: {
          listing_id: listing.id,
          donated_amount: faker.datatype.number({ min: 10, max: 100 }),
          created_at: transactionDate,
          approved_at: approvedAt,
          completed_at: completedAt,
          other_id: uuidv4(), // havent figure out how to make this an actual other profile
        },
      });

      console.log(`Transaction ${status} created for listing ${listing.header}`);

      // Check and update listing status after adding transactions
      await checkListingStatus(listing.id);
    }
  } catch (error) {
    console.error('Error creating dummy data:', error);
  } finally {
    console.log('Dummy data creation complete');
  }
}
