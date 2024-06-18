import { getCurrentUserId } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma, { listing_type_enum } from '@/lib/db';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ListingVerticalScroll from '@/components/listing-vertical-scroll';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BookHeart, Info, Medal, PartyPopper, Trophy } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


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
    <div>
   
    <div className="w-full flex flex-col items-center justify-center"> 
      <div className="border border-slate-200 bg-slate-100 rounded-2xl shadow-xl p-6 text-center h-fit w-80 mt-2 flex flex-col items-center justify-center space-y-4">
        <div className=" w-20 h-20 relative">
          <Image
            className="border-4 border-gray-100 rounded-full shadow-xl"
            src={
              'https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
            //   src={user?.profiles.}
            fill
            alt="Picture of the author"
            sizes='100'
          />
        </div>

        <p className="text-xl font-semibold">{user?.profiles?.username}</p>
        <p className="text-sm font-normal text-gray-700 text-left">
          My name is aden and i usually give food scraps. However i occasionally compost and would sometimes like to receive too.
        </p>
        <Button className="w-full">Edit Profile</Button>
      </div>
     

      <div className="mt-2">
      <ScrollArea className="w-80 whitespace-nowrap rounded-md ">
      <div className="flex w-max space-x-8 p-4">
       
        <Popover>
          <PopoverTrigger className="border-none bg-transparent w-fit h-fit"><Badge className="bg-green-400"><Trophy/></Badge></PopoverTrigger>
          <PopoverContent className="ml-2"> 
            <h1 className="text-md font-semibold flex text-center"><span className="mt-[0.1rem]">Congratulations!</span> <span className="ml-2"><PartyPopper/></span></h1>
            <p className="font-normal text-sm mt-2">You are in the top 5% of users who saved the most amount of food scraps from going to waste this month!  </p>
            </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="border-none bg-transparent w-fit h-fit"><Badge className="bg-blue-400"><Medal/></Badge></PopoverTrigger>
          <PopoverContent className="ml-2"> 
            <h1 className="text-md font-semibold flex text-center"><span className="mt-[0.1rem]">Congratulations!</span> <span className="ml-2"><PartyPopper/></span></h1>
            <p className="font-normal text-sm mt-2">You are in the top 1% most active users this week! Keep it up! </p>
            </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="border-none bg-transparent w-fit h-fit"> <Badge className="bg-red-300"><BookHeart/></Badge></PopoverTrigger>
          <PopoverContent className="ml-2"> 
            <h1 className="text-md font-semibold flex text-center"><span className="mt-[0.1rem]">Congratulations!</span> <span className="ml-2"><PartyPopper/></span></h1>
            <p className="font-normal text-sm mt-2">You have been contributing to a cleaner environment for 1 year!</p>
            </PopoverContent>
        </Popover>
       
        
       
        <Popover>
          <PopoverTrigger className="border-none bg-transparent w-fit h-fit"><Badge className="bg-green-400"><Trophy/></Badge></PopoverTrigger>
          <PopoverContent className="ml-2"> 
            <h1 className="text-md font-semibold flex text-center"><span className="mt-[0.1rem]">Congratulations!</span> <span className="ml-2"><PartyPopper/></span></h1>
            <p className="font-normal text-sm mt-2">You are in the top 5% of users who saved the most amount of food scraps from going to waste this month!  </p>
            </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="border-none bg-transparent w-fit h-fit"><Badge className="bg-blue-400"><Medal/></Badge></PopoverTrigger>
          <PopoverContent className="ml-2"> 
            <h1 className="text-md font-semibold flex text-center"><span className="mt-[0.1rem]">Congratulations!</span> <span className="ml-2"><PartyPopper/></span></h1>
            <p className="font-normal text-sm mt-2">You are in the top 1% most active users this week! Keep it up! </p>
            </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="border-none bg-transparent w-fit h-fit"> <Badge className="bg-red-300"><BookHeart/></Badge></PopoverTrigger>
          <PopoverContent className="ml-2"> 
            <h1 className="text-md font-semibold flex text-center"><span className="mt-[0.1rem]">Congratulations!</span> <span className="ml-2"><PartyPopper/></span></h1>
            <p className="font-normal text-sm mt-2">You have been contributing to a cleaner environment for 1 year!</p>
            </PopoverContent>
        </Popover>
       
      <ScrollBar orientation="horizontal" />
      </div>
      </ScrollArea>
      </div>
      <div className="flex justify-content text-center items-center my-2 px-6 ">
      <div className="px-3">
        <h1 className="font-semibold text-2xl">80kg</h1>
        <p className="text-sm text-gray-400">of food scraps redirected from landfills</p>
        </div>
        <div className="px-4">
        <h1 className="font-semibold text-2xl">40kg</h1>
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
          {requestListings && requestListings.length > 0 ? (
                <ScrollArea className="h-[17rem]">
                    <ListingVerticalScroll listings={requestListings} />
                </ScrollArea>
            ) : (
                <p className="text-sm text-gray-400 font-medium mt-4">No active listings</p>
            )}
          </TabsContent>
          <TabsContent value="Offers">
          {donateListings && donateListings.length > 0 ? (
               <ScrollArea className="h-[17rem]">
               <ListingVerticalScroll listings={donateListings} />
             </ScrollArea>
            ) : (
                <p className="text-sm text-gray-400 font-medium mt-4">No active listings</p>
            )}
            
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </div>
  );
}
