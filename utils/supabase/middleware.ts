import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest, headers: Headers) {
    headers.set("x-current-path", request.nextUrl.pathname);
    let response = NextResponse.next({
      request: {
        headers: headers,
      },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: "",
                        ...options,
                    });
                },
            },
        }
    );

    const {data, error} = await supabase.auth.getUser();
    
    const user = data?.user;

    if ((request.nextUrl.pathname === '/listings/create' || request.nextUrl.pathname === '/profile' ||  request.nextUrl.pathname === '/community/new') && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (request.nextUrl.pathname === '/login'  && user) {
        return NextResponse.redirect(new URL('/listings', request.url));

    }



    if (request.nextUrl.pathname === '/') {
          return NextResponse.redirect(new URL('/listings', request.url));
      }

    return response;
}
