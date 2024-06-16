// import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';

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

  return <div>{params.username}</div>;
};

export default UserPage;
