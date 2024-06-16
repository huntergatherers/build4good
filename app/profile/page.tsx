import { getCurrentUserId } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma, { listing_type_enum } from '@/lib/db';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function Profile() {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login');
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    include: {
      profiles: true,
    },
  });

  const requestListings = await prisma.listing.findMany({
    where: {
      profiles: {
        username: user?.profiles?.username,
      },
      listing_type: listing_type_enum.receive,
    },
    include: {
      Transaction: true,
      ListingImage: true,
    },
  });

  const donateListings = await prisma.listing.findMany({
    where: {
      profiles: {
        username: user?.profiles?.username,
      },
      listing_type: listing_type_enum.donate,
    },
    include: {
      Transaction: true,
      ListingImage: true,
    },
  });

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="rounded-2xl shadow-xl p-6 text-center h-fit w-80 mt-10 flex flex-col items-center justify-center space-y-4">
        <div className=" w-20 h-20 relative">
          <Image
            className="border-4 border-gray-100 rounded-full shadow-xl"
            src={
              'https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            //   src={user?.profiles.}
            fill
            alt="Picture of the author"
          />
        </div>

        <p className="text-xl font-semibold">{user?.profiles?.username}</p>
        <p className="text-sm font-normal text-gray-700 text-left">
          Hi my name is aden and i am a compostor. I like collecting trash and
          eating them as a hobby. heheheheh
        </p>
        <Button className="w-full">Edit Profile</Button>
      </div>
      <div className="text-center flex flex-col items-center justify-center mt-6 w-full">
        <Tabs defaultValue="Requests" className="w-full">
          <TabsList className=" w-[22rem]">
            <TabsTrigger className=" w-44" value="Requests">
              Requests
            </TabsTrigger>
            <TabsTrigger className=" w-44" value="Offers">
              Offers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Requests">All request listings</TabsContent>
          <TabsContent value="Offers">All offer listings</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
