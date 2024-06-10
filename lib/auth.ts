"use server";
import { createClient } from "@/utils/supabase/server";
import { createClient as client } from "@/utils/supabase/client";
export async function getCurrentUserId() {
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();
    return data.user?.id;
}

export async function getCurrentUserClient() {
    const supabase = client();
    const { data } = await supabase.auth.getUser();
    console.log(data.user);
    return data.user;
}
