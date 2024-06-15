"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import prisma from "./db";
export async function getCurrentUserId() {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();
    return data.user?.id;
}

export async function getCurrentUser() {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    return data.user;
}

export async function getUserProfileFromUserId(userId: string) {
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
    include: {
      profiles: true,
    }
  });
  return user?.profiles;
}

export async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Sign out error", error);
        return error;
    }
    revalidatePath("/", "layout");
}
