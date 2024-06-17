import { getCurrentUserId } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma, { listing_type_enum } from '@/lib/db';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ListingVerticalScroll from '@/components/listing-vertical-scroll';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BookHeart, Medal, PartyPopper, Trophy } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const UserPage = async ({ params }: { params: { username: string } }) => {
  const userId = await getCurrentUserId();
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    include: {
      profiles: true,
    },
  });
  if (params.username === user?.profiles?.username) {
    redirect('/profile');
  }
  // other users
  const profile = await prisma.profiles.findUnique({
    where: {
      username: params.username,
    },
    include: {
      users: true,
    },
  });

  if (!profile) {
    redirect('/error');
  }

  console.log(profile);
  // {params.username}

  const requestListings = await prisma.listing.findMany({
    where: {
      profiles: {
        username: params.username,
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
        username: params.username,
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
      <div className="border border-slate-200 bg-slate-100 rounded-2xl shadow-xl p-6 text-center h-fit w-80 mt-10 flex flex-col items-center justify-center space-y-4">
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

        <p className="text-xl font-semibold">{params.username}</p>
        <p className="text-sm font-normal text-gray-700 text-left mx-auto">
          Hi my name is {params.username} and i am a compostor. I like collecting trash and
          eating them as a hobby. heheheheh
        </p>
        <Button className="w-full">Chat</Button>
      </div>
     

      <div className="mt-2">
      <ScrollArea className="w-80 whitespace-nowrap rounded-md ">
      <div className="flex w-max space-x-8 p-4">
       
        <Popover>
          <PopoverTrigger className="border-none bg-transparent w-fit h-fit"><Badge className="bg-green-400"><Trophy/></Badge></PopoverTrigger>
          <PopoverContent className="ml-2"> 
            <h1 className="text-md font-semibold flex text-center"><span className="mt-[0.1rem]">Celebrate!</span> <span className="ml-2"><PartyPopper/></span></h1>
            <p className="font-normal text-sm mt-2">{params.username} is in the top 15% of users who saved the most amount of food scraps from going to waste this month!  </p>
            </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="border-none bg-transparent w-fit h-fit"><Badge className="bg-blue-400"><Medal/></Badge></PopoverTrigger>
          <PopoverContent className="ml-2"> 
            <h1 className="text-md font-semibold flex text-center"><span className="mt-[0.1rem]">Celebrate!</span> <span className="ml-2"><PartyPopper/></span></h1>
            <p className="font-normal text-sm mt-2">{params.username} is in the top 20% most active users this week!  </p>
            </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="border-none bg-transparent w-fit h-fit"> <Badge className="bg-red-300"><BookHeart/></Badge></PopoverTrigger>
          <PopoverContent className="ml-2"> 
            <h1 className="text-md font-semibold flex text-center"><span className="mt-[0.1rem]">Celebrate!</span> <span className="ml-2"><PartyPopper/></span></h1>
            <p className="font-normal text-sm mt-2">{params.username} has been contributing to a cleaner environment for 5 months!</p>
            </PopoverContent>
        </Popover>
       
        
       
       
       
      <ScrollBar orientation="horizontal" />
      </div>
      </ScrollArea>
      </div>
      <div className="flex justify-content text-center items-center my-2 px-6 ">
      <div className="px-3">
        <h1 className="font-semibold text-2xl">20kg</h1>
        <p className="text-sm text-gray-400">of food scraps redirected from landfills</p>
        </div>
        <div className="px-4">
        <h1 className="font-semibold text-2xl">10kg</h1>
        <p className="text-sm text-gray-400">of CO2-equivalent emissions saved</p>
        </div>
       
      </div>
      <div className="text-center flex flex-col items-center justify-center mt-4 w-full">
        <Tabs defaultValue="Offers" className="w-full">
          <TabsList className=" w-[22rem]">
            <TabsTrigger className=" w-44" value="Requests">
              Requests
            </TabsTrigger>
            <TabsTrigger className=" w-44" value="Offers">
              Offers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Requests">
          <ScrollArea className="h-[15rem]">
            <ListingVerticalScroll listings={requestListings} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="Offers">
            <ScrollArea className="h-[15rem]">
              <ListingVerticalScroll listings={donateListings} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
export default UserPage;


