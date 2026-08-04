import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { BOARD_COOKIE, boardAccessToken } from "@/lib/board-auth"

export async function proxy(request: NextRequest) {
  const password = process.env.BOARD_PASSWORD
  if (!password) return NextResponse.redirect(new URL("/board-access?error=config", request.url))

  const expected = await boardAccessToken(password)
  if (request.cookies.get(BOARD_COOKIE)?.value === expected) return NextResponse.next()

  const login = new URL("/board-access", request.url)
  login.searchParams.set("next", request.nextUrl.pathname)
  return NextResponse.redirect(login)
}

export const config = { matcher: "/projects/saas/:path*" }
