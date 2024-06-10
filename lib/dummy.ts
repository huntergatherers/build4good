"use server";
import prisma from "./db";
import { getCurrentUserId } from "./auth";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export async function createDummyData() {
    try {
      for (let i = 0; i < 10; i++) {
        // Create User
        const user = await prisma.users.create({
          data: {
            id: uuidv4(),
            email: faker.internet.email(),
            encrypted_password: faker.internet.password(),
            created_at: faker.date.recent(),
            updated_at: faker.date.recent(),
          },
        });
  
        // Create Profile for User
        await prisma.profiles.create({
          data: {
            id: user.id,
            username: faker.internet.userName(),
            is_composter: faker.datatype.boolean(),
            is_donor: faker.datatype.boolean(),
            is_gardener: faker.datatype.boolean(),
          },
        });
  
        console.log(`User and profile created for iteration ${i + 1}`);
      }
    } catch (error) {
      console.error('Error creating dummy data:', error);
    } finally {
      console.log('Dummy data creation complete');
    }
  }