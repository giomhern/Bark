import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest){
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({req, res}, {supabaseKey: process.env.NEXT_PUBLIC_ANON_KEY, supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL})
    await supabase.auth.getSession();
    return res;
}