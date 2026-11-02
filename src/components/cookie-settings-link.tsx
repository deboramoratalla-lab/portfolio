"use client"
export function CookieSettingsLink() {
  return <button type="button" className="footer-cookies" onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}>Cookie settings</button>
}
