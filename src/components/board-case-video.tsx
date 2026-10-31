"use client"

import { useEffect, useRef } from "react"

export function BoardCaseVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncPlayback = () => {
      if (motionPreference.matches) {
        video.pause()
      } else {
        void video.play().catch(() => {})
      }
    }

    syncPlayback()
    motionPreference.addEventListener("change", syncPlayback)
    return () => motionPreference.removeEventListener("change", syncPlayback)
  }, [])

  return (
    <video
      ref={videoRef}
      className="board-case-film"
      muted
      loop
      playsInline
      preload="metadata"
      poster="/media/suez-enterprise-planning-cover.png"
      aria-label="SUEZ budget workflow screens in motion"
    >
      <source src="/media/board-suez-planning-loop.webm" type="video/webm" />
    </video>
  )
}
