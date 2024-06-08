"use client"
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { login, signup } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthForm({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const [isSignup, setIsSignup] = useState(false);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={isSignup ? signup : login}
      >
        {isSignup && (
          <>
            <label className="text-md" htmlFor="username">
              Username
            </label>
            <Input
              className="rounded-md px-4 py-2 bg-inherit border mb-4"
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
          className="rounded-md px-4 py-2 bg-inherit border mb-4"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <Input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Button
          className="rounded-md px-4 py-2 text-white mb-2"
        >
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
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
