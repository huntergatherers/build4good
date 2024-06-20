import React from 'react';
import MapComponentPage from './MapComponent';
import prisma from '@/lib/db';

export default async function MapPage() {
  const users = await prisma.users.findMany();
  console.log(users);
  return <div className="">{/* <MapComponentPage /> */}</div>;
}
