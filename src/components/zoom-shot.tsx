"use client"
import Image from "next/image"
import { useRef } from "react"

export function ZoomShot({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  return <>
    <button type="button" className="zoom-shot-trigger" onClick={() => ref.current?.showModal()} aria-label={`Enlarge: ${alt}`}>
      <Image src={src} alt={alt} width={2560} height={1600} sizes={sizes} />
    </button>
    <dialog ref={ref} className="zoom-shot-dialog" onClick={e => { if (e.target === e.currentTarget) ref.current?.close() }}>
      <button type="button" className="zoom-shot-close" onClick={() => ref.current?.close()}>Close</button>
      <Image src={src} alt={alt} width={2560} height={1600} sizes="100vw" />
    </dialog>
  </>
}
