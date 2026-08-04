import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { BOARD_COOKIE, boardAccessToken } from "@/lib/board-auth"

export const metadata: Metadata = { title: "Board — Protected case study", robots: { index: false, follow: false } }

async function unlock(formData: FormData) {
  "use server"
  const supplied = String(formData.get("password") ?? "")
  const expected = process.env.BOARD_PASSWORD
  if (!expected || supplied !== expected) redirect("/board-access?error=invalid")

  const cookieStore = await cookies()
  cookieStore.set(BOARD_COOKIE, await boardAccessToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/projects/saas",
    maxAge: 60 * 60 * 24 * 7,
  })
  redirect("/projects/saas")
}

export default async function BoardAccess({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return <main className="access-page">
    <section className="access-card">
      <span>Protected case study</span>
      <h1>Board International</h1>
      <p>Enter the password to continue.</p>
      <form action={unlock}>
        <label htmlFor="board-password">Password</label>
        <div><input id="board-password" name="password" type="password" autoComplete="current-password" autoFocus required /><button type="submit">View case</button></div>
        {error === "invalid" && <small role="alert">That password isn’t correct. Please try again.</small>}
        {error === "config" && <small role="alert">Access is temporarily unavailable.</small>}
      </form>
      <a href="/">← Back to selected work</a>
    </section>
  </main>
}
