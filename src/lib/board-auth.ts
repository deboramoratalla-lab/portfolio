export const BOARD_COOKIE = "board_access"

export async function boardAccessToken(password: string) {
  const bytes = new TextEncoder().encode(`${password}:board-access`)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("")
}
