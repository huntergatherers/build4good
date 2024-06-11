'use client';
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Broccoli from './assets/broccoli';
import Apple from './assets/apple';
import dynamic from "next/dynamic"

const MapItem = dynamic(() => import("./map-item"), { ssr:false })


const MapPage = () => {
  const userData = [
    {
        id: 1,
        name: 'John Doe',
        profilePicture:
            'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
        wasteReceived: 150,
        wasteDonated: 75,
        startDate: new Date('2023-05-15'),
        freeDays: ['Monday', 'Wednesday', 'Friday'],
        role: 'Gardener',
        latitude: 1.3521,
        longitude: 103.8198
    },
    {
        id: 2,
        name: 'Jane Smith',
        profilePicture:
            'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
        wasteReceived: 200,
        wasteDonated: 100,
        startDate: new Date('2023-03-20'),
        freeDays: ['Tuesday', 'Thursday'],
        role: 'Compostor',
        latitude: 1.3422,
        longitude: 103.8200
    },
    {
        id: 3,
        name: 'Tim Poon',
        profilePicture:
            'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
        wasteReceived: 100,
        wasteDonated: 50,
        startDate: new Date('2024-05-15'),
        freeDays: ['Saturday', 'Sunday'],
        role: 'Donor',
        latitude: 1.3623,
        longitude: 103.8202
    },
    {
        id: 1,
        name: 'Lay Bay',
        profilePicture:
            'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
        wasteReceived: 150,
        wasteDonated: 75,
        startDate: new Date('2023-01-15'),
        freeDays: ['Monday', 'Wednesday', 'Friday'],
        role: 'Gardener',
        latitude: 1.3524,
        longitude: 103.8004
    },
    {
        id: 2,
        name: 'Sean Tane',
        profilePicture:
            'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
        wasteReceived: 200,
        wasteDonated: 100,
        startDate: new Date('2023-05-15'),
        freeDays: ['Tuesday', 'Thursday'],
        role: 'Compostor',
        latitude: 1.3525,
        longitude: 103.8406
    },
    {
        id: 3,
        name: 'Tom Lee',
        profilePicture:
            'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
        wasteReceived: 100,
        wasteDonated: 50,
        startDate: new Date('2023-05-15'),
        freeDays: ['Saturday', 'Sunday'],
        role: 'Donor',
        latitude: 1.3526,
        longitude: 103.8318
    }
];

  const calculateFoodScrappingDuration = (startDate: Date) => {
    const today = new Date();
    const diffInMonths =
      (today.getFullYear() - startDate.getFullYear()) * 12 +
      (today.getMonth() - startDate.getMonth());
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffInDays = Math.floor(
      (today.getTime() - startDate.getTime()) / oneDay
    );
    let duration = '';

    if (years > 0) {
      duration += `${years}y `;
    }
    if (months > 0) {
      duration += `${months}m `;
    }
    if (diffInDays > 0 && years === 0 && months === 0) {
      duration += `${diffInDays}d`;
    }

    return duration.trim();
  };
  
  return (
    <div className="relative min-h-screen w-screen flex justify-center items-center">
      <MapItem/>
      <Drawer>
        <DrawerTrigger
          style={{
            position: 'absolute',
            bottom: 100,
            zIndex: 402,
            backgroundColor: 'black',
            borderRadius: '15px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Search color="#ffffff" />
        </DrawerTrigger>
        <DrawerContent
          className="rounded-3xl border-b-0 bg-gray-100 bg-opacity-85"
          style={{ zIndex: 999999999 }}
        >
          <DrawerHeader className="opacity-100">
            <DrawerTitle className="flex">
              <Search style={{ marginTop: '8px', marginRight: '5px' }} />
              <Input
                className="bg-white opacity-100 font-normal text-base"
                placeholder="Search"
              />
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex justify-between pl-6 pr-6 mb-6 z-50">
            <Button className="rounded-3xl text-black bg-white hover:bg-black hover:text-white">
              Donors
            </Button>
            <Button className="rounded-3xl text-black bg-white hover:bg-black hover:text-white">
              Composters
            </Button>
            <Button className="rounded-3xl text-black bg-white hover:bg-black hover:text-white">
              Gardeners
            </Button>
          </div>

          <ScrollArea className="bg-gray-100">
            <div className="">
              {userData.map((user, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-center mb-4 p-6 bg-white"
                >
                  <div className="text-center mr-2">
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <p className="text-base font-normal mt-2">{user.name}</p>
                  </div>
                  <div>
                    <div className="flex justify-between px-4">
                      <p className="text-base text-green-600 font-medium mb-1">
                        {user.wasteReceived} kg{' '}
                        <span className="text-sm text-black font-normal">
                          received{' '}
                        </span>
                      </p>
                      <p className="text-xl text-gray-400 font-medium mx-1"> •</p>
                      <p className="text-base text-green-600 font-medium">
                        {user.wasteDonated} kg{' '}
                        <span className="text-sm text-black font-normal">
                          donated{' '}
                        </span>
                      </p>
                    </div>
                    <p className="text-left  text-gray-500 text-[0.9rem] px-4">
                      Food scrapping for{' '}
                      {calculateFoodScrappingDuration(user.startDate)}
                    </p>
                    <div className="text-gray-500 flex justify-between px-4 mt-2">
                      {[
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                      ].map((day, idx) => (
                        <p
                          key={idx}
                          className={
                            user.freeDays.includes(day)
                              ? 'bg-green-300 font-semibold rounded-3xl px-1 '
                              : 'mx-1'
                          }
                        >
                          {day[0]}
                        </p>
                      ))}
                    </div>
                    <div className=" flex justify-between items-center mt-4 px-3">
                      <div className="flex">
                        <Button className="bg-gray-100 p-0 rounded-3xl px-3 mr-3 ">
                          <Apple />
                        </Button>
                        <Button className="bg-gray-100 p-0 rounded-3xl px-3 ">
                          <Broccoli />
                        </Button>
                      </div>
                      <Button className="bg-black rounded-3xl font-normal p-0 px-4 justify-end ">
                        2.4km
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MapPage;
