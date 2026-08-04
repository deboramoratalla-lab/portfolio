"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"

export function InvertCursor() {
  const reducedMotion = useReducedMotion()
  const pointerX = useMotionValue(-40)
  const pointerY = useMotionValue(-40)
  const spring = { stiffness: 720, damping: 48, mass: .18 }
  const x = useSpring(pointerX, reducedMotion ? { stiffness: 10000, damping: 1000 } : spring)
  const y = useSpring(pointerY, reducedMotion ? { stiffness: 10000, damping: 1000 } : spring)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
      setVisible(true)
    }
    const hide = () => setVisible(false)
    window.addEventListener("pointermove", move, { passive: true })
    document.documentElement.addEventListener("mouseleave", hide)
    window.addEventListener("blur", hide)
    return () => {
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("mouseleave", hide)
      window.removeEventListener("blur", hide)
    }
  }, [pointerX, pointerY])

  return <motion.div
    aria-hidden="true"
    className="invert-cursor"
    style={{ x, y }}
    animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : .5 }}
    transition={{ duration: .16 }}
  />
}
