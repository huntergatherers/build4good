'use client';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { usePathname } from 'next/navigation';
import {
  CirclePlus,
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
        size={45}
        fill="white"
        className="shadow-xl rounded-3xl"
      />
    ) : (
      <Plus
        color="white"
        size={45}
        fill="white"
        className="shadow-xl rounded-3xl"
      />
    );

  const getProfileColor = (path: string) =>
    pathname === path ? <User color="#47A36E" /> : <User color="black" />;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
      <div className="max-w-screen-xl mx-auto py-4">
        <div className="flex justify-around">
          <Link href="/listings">
            <div className="flex flex-col items-center justify-center">
              {getHomeColor('/listings')}
              <span
                className={` ${getIconColor('/listings')} text-sm font-medium`}
              >
                Home
              </span>
            </div>
          </Link>
          <Link href="/community">
            <div className="flex flex-col items-center justify-center">
              {getCommunityColor('/community')}
              <span
                className={` ${getIconColor('/community')} text-sm font-medium`}
              >
                Community
              </span>
            </div>
          </Link>
          <Link href="/listings/create">
            <div className="fixed bottom-12 left-[47%] bg-[#47A36E] rounded-3xl shadow-2xl ">
              {getCreateColor('/listings/create')}
            </div>
          </Link>
          <Link href="/chat">
            <div className="flex flex-col items-center justify-center">
              {getChatColor('/chat')}
              <span className={` ${getIconColor('/chat')} text-sm font-medium`}>
                Chat
              </span>
            </div>
          </Link>
          <Link href="/profile">
            <div className="flex flex-col items-center justify-center">
              {getProfileColor('/profile')}
              <span
                className={` ${getIconColor('/profile')} text-sm font-medium`}
              >
                Profile
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
