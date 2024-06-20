import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FacebookEmbed, LinkedInEmbed } from 'react-social-media-embed';
import MapComponentPage from '../map/MapComponent';
import FaceBookPosts from './FacebookPosts';
import prisma from '@/lib/db';

// const FacebookEmbed = dynamic(
//     import("react-social-media-embed").then((mod) => mod.FacebookEmbed),
//     { ssr: false }
// );

const CommunityPage = async () => {
  const users = await prisma.users.findMany({
    include: {
      profiles: true,
    },
  });
  console.log(users);
  return (
    <div className="relative w-screen">
      <Tabs defaultValue="Community Map" className="w-full">
        <TabsList className="fixed top-0 z-10 align-middle self-center w-full flex justify-center py-6">
          <TabsTrigger className="w-44" value="Community Map">
            Community Map
          </TabsTrigger>
          <TabsTrigger className=" w-44" value="Forum">
            Forum
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Community Map">
          <MapComponentPage users={users} />
        </TabsContent>
        <TabsContent value="Forum" className="mt-14">
          <FaceBookPosts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPage;
