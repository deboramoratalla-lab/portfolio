export const BOARD_COOKIE = "board_access_v2"

export async function boardAccessToken(password: string) {
  const bytes = new TextEncoder().encode(`${password}:board-access-v2`)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("")
}
