"use client";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect, usePathname } from "next/navigation";
import { login, signup } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "./submit-button";

export default function AuthForm({
    searchParams,
    closeDialog,
}: {
    searchParams: { message: string };
    closeDialog?: () => void;
}) {
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    const toggleForm = () => {
        setIsSignup(!isSignup);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const form = event.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        if (isSignup) {
            await signup(formData);
        } else {
            await login(formData);
        }
        if (closeDialog) {
            closeDialog();
        }
        setIsLoading(false);
    };

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <form
                className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
                onSubmit={handleSubmit}
            >
                {isSignup && (
                    <>
                        <label className="text-md" htmlFor="username">
                            Username
                        </label>
                        <Input
                            className="rounded-md px-4 py-2 bg-inherit border mb-4 text-md"
                            name="username"
                            placeholder="Your username"
                            required
                        />
                    </>
                )}
                <label className="text-md" htmlFor="email">
                    Email
                </label>
                <Input
                    defaultValue="johnlee@test.com"
                    className="rounded-md px-4 py-2 bg-inherit border mb-4 text-md"
                    name="email"
                    placeholder="you@example.com"
                    required
                />
                <label className="text-md" htmlFor="password">
                    Password
                </label>
                <Input
                    defaultValue="123456"
                    className="rounded-md px-4 py-2 bg-inherit border mb-6 text-md"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                />
                <input type="hidden" name="redirect" value={pathname} />
                <Button type="submit" disabled={isLoading}>
                    {isSignup ? "Sign Up" : "Sign In"}
                </Button>
                <div>
                    {isSignup ? (
                        <span>
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={toggleForm}
                                className="text-blue-600 underline"
                            >
                                Sign in.
                            </button>
                        </span>
                    ) : (
                        <span>
                            No account yet?{" "}
                            <button
                                type="button"
                                onClick={toggleForm}
                                className="text-blue-600 underline"
                            >
                                Sign up.
                            </button>
                        </span>
                    )}
                </div>
                <div className="bg-blue-100 p-2 rounded-md">
                    For demonstration purposes, username and password is
                    pre-filled. Click the button to login.
                </div>
                {searchParams?.message && (
                    <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                        {searchParams.message}
                    </p>
                )}
            </form>
        </div>
    );
}
