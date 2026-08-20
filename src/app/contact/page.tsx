import { redirect } from "next/navigation"

/** Contact is now the footer anchor, not a standalone page. */
export default function ContactPage() {
  redirect("/#contact")
}
