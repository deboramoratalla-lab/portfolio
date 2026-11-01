import { redirect } from "next/navigation"

/** The Board case is public now; old access links go straight to it. */
export default function BoardAccessRedirect() {
  redirect("/projects/saas")
}
