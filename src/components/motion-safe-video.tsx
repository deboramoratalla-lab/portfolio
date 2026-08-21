"use client"

import { useEffect, useRef, type VideoHTMLAttributes } from "react"
import { useReducedMotion } from "motion/react"

type MotionSafeVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, "autoPlay" | "loop" | "muted" | "playsInline">

/** Decorative video that respects the visitor's operating-system motion preference. */
export function MotionSafeVideo(props: MotionSafeVideoProps) {
  const reducedMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reducedMotion) {
      video.pause()
      return
    }
    void video.play().catch(() => undefined)
  }, [reducedMotion])

  return <video ref={videoRef} {...props} autoPlay={!reducedMotion} loop={!reducedMotion} muted playsInline aria-hidden="true" />
}
