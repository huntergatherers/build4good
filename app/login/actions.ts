"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password: string): boolean {
    return password.length >= 6;
}

function getData(
    formData: FormData,
    isSignup: boolean
): { email: string; password: string; username?: string } {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = isSignup
        ? (formData.get("username") as string)
        : undefined;

    if (!email || !validateEmail(email)) {
        throw new Error("Invalid email address");
    }

    if (!password || !validatePassword(password)) {
        throw new Error("Invalid password");
    }

    if (isSignup && (!username || username.trim() === "")) {
        throw new Error("Invalid username");
    }

    return isSignup ? { email, password, username } : { email, password };
}

export async function login(formData: FormData): Promise<void> {
    const supabase = createClient();

    let data;
    try {
        data = getData(formData, false);
    } catch (error: any) {
        redirect("/error");
    }

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(formData: FormData): Promise<void> {
    const supabase = createClient();

    let data;
    try {
        data = getData(formData, true);
    } catch (error: any) {
        console.error("Validation error");
        redirect("/error");
    }

    const { error } = await supabase.auth.signUp({
        ...data,
        options: { data: { username: data.username } },
    });



    if (error) {
        console.log(error)
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/login?message=Your+account+has+been+created.+Please+sign+in.");
}
