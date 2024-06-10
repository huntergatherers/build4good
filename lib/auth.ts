"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
export async function getCurrentUserId() {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();
    return data.user?.id;
}

export async function getCurrentUserClient() {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    console.log(data.user);
    return data.user;
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
