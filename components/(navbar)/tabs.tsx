'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartHandshake,
  Home,
  MessageCircle,
  Plus,
  User,
} from 'lucide-react';

export default function Tabs() {
  const pathname = usePathname();

  const getIconColor = (path: string) =>
    pathname === path ? 'text-[#47A36E]' : 'text-black';

  const getHomeColor = (path: string) =>
    pathname === path ? (
      <Home color="#47A36E" className="item-center" />
    ) : (
      <Home color="black" />
    );

  const getCommunityColor = (path: string) =>
    pathname === path ? (
      <HeartHandshake color="#47A36E" />
    ) : (
      <HeartHandshake color="black" />
    );

  const getChatColor = (path: string) =>
    pathname === path ? (
      <MessageCircle color="#47A36E" />
    ) : (
      <MessageCircle color="black" />
    );

  const getCreateColor = (path: string) =>
    pathname === path ? (
      <Plus
        color="white"
        size={30}
        fill="white"
        className="shadow-xl rounded-3xl"
      />
    ) : (
      <Plus
        color="white"
        size={30}
        fill="white"
        className="shadow-xl rounded-3xl"
      />
    );

  const getProfileColor = (path: string) =>
    pathname === path ? <User color="#47A36E" /> : <User color="black" />;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
      <div className="max-w-screen-xl mx-auto py-4">
        <div className="flex">
          <Link href="/listings" className="flex-1 flex justify-center">
            <div className="flex flex-col items-center justify-center">
              {getHomeColor('/listings')}
              <span className={` ${getIconColor('/listings')} text-sm font-medium`}>
                Home
              </span>
            </div>
          </Link>
          <Link href="/community" className="flex-1 flex justify-center">
            <div className="flex flex-col items-center justify-center">
              {getCommunityColor('/community')}
              <span className={` ${getIconColor('/community')} text-sm font-medium`}>
                Community
              </span>
            </div>
          </Link>
          <Link href="/listings/create" className="flex-1 flex justify-center">
            <div className="bg-[#47A36E] rounded-full shadow-2xl fixed bottom-8 p-4 shadow-black">
              {getCreateColor('/listings/create')}
            </div>
          </Link>
          <Link href="/chat" className="flex-1 flex justify-center">
            <div className="flex flex-col items-center justify-center">
              {getChatColor('/chat')}
              <span className={` ${getIconColor('/chat')} text-sm font-medium`}>
                Chat
              </span>
            </div>
          </Link>
          <Link href="/profile" className="flex-1 flex justify-center">
            <div className="flex flex-col items-center justify-center">
              {getProfileColor('/profile')}
              <span className={` ${getIconColor('/profile')} text-sm font-medium`}>
                Profile
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
