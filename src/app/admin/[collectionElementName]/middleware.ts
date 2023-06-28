import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    console.log(request.nextUrl.pathname);

    if (request.nextUrl.pathname.startsWith('/')) {
        return NextResponse.rewrite(new URL('/page', request.url));
    }
}
