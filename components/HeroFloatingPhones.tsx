'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { gsap } from 'gsap'

const LEFT = '/images/HeroPhone-Left.png'
const RIGHT = '/images/HeroPhone-right.png'
const LEFT_W = 395
const LEFT_H = 713
const RIGHT_W = 486
const RIGHT_H = 723

/**
 * Stella glow + two phone PNGs. Sizes follow the hero column (fluid), with caps on very wide screens.
 * Padding + modest GSAP motion keeps floats inside the layout without clipping.
 */
export default function HeroFloatingPhones() {
  useEffect(() => {
    const floatEase = 'sine.inOut'

    const stella = document.querySelector('[data-hero-stella]')
    if (stella) {
      gsap.to(stella, {
        y: 8,
        x: -5,
        rotation: 1,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: floatEase,
      })
    }

    const left = document.querySelector('[data-hero-phone-left]')
    if (left) {
      gsap.to(left, {
        y: -8,
        x: 3,
        rotation: -2,
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: floatEase,
      })
    }

    const right = document.querySelector('[data-hero-phone-right]')
    if (right) {
      gsap.to(right, {
        y: 6,
        x: -5,
        rotation: 2,
        duration: 4.4,
        repeat: -1,
        yoyo: true,
        ease: floatEase,
        delay: 0.35,
      })
    }

    return () => {
      gsap.killTweensOf([stella, left, right].filter(Boolean))
    }
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-full overflow-visible py-1 sm:py-1.5" aria-hidden>
      {/* Stella — glow sits behind; inset keeps blur inside the block */}
      <div
        data-hero-stella
        className="pointer-events-none absolute inset-[-6%] z-0 flex items-center justify-center"
      >
        <div className="relative h-full min-h-[200px] w-full max-w-full sm:min-h-[220px] lg:min-h-[240px]">
          <div className="absolute left-[5%] top-[18%] h-[42%] w-[78%] rounded-[50%] bg-gradient-to-r from-cyan-400/30 via-sky-500/18 to-transparent blur-[56px]" />
          <div className="absolute right-[0%] bottom-[12%] h-[38%] w-[62%] rounded-[45%] bg-gradient-to-tr from-blue-500/25 via-cyan-400/15 to-transparent blur-[48px]" />
          <div className="absolute left-[25%] top-[40%] h-[28%] w-[45%] rounded-[50%] bg-cyan-300/15 blur-[40px]" />
        </div>
      </div>

      {/* Phones: % of column + px caps — strong on lg/xl; only ultrawide uses vw to avoid comically large mockups */}
      <div className="relative z-10 flex w-full max-w-full items-center justify-center gap-[1.5%] px-3 pt-2 sm:gap-[2%] sm:px-4 sm:pt-4 md:min-h-[240px] lg:min-h-[280px] xl:min-h-[300px] 2xl:min-h-[320px]">
        <div
          data-hero-phone-left
          className="relative w-[44%] min-w-0 shrink sm:w-[43%] max-w-[min(100%,min(300px,50vw))] md:max-w-[min(320px,48vw)] lg:max-w-[min(360px,44vw)] xl:max-w-[min(380px,38vw)] 2xl:max-w-[min(400px,32vw)] min-[1920px]:max-w-[min(420px,28vw)]"
        >
          <Image
            src={LEFT}
            width={LEFT_W}
            height={LEFT_H}
            alt=""
            className="h-auto w-full object-contain drop-shadow-2xl drop-shadow-black/50"
            sizes="(max-width: 1024px) 44vw, (max-width: 1536px) 340px, 360px"
            priority
            unoptimized
          />
        </div>
        <div
          data-hero-phone-right
          className="relative w-[52%] min-w-0 shrink sm:w-[51%] max-w-[min(100%,min(340px,54vw))] md:max-w-[min(360px,52vw)] lg:max-w-[min(400px,50vw)] xl:max-w-[min(420px,42vw)] 2xl:max-w-[min(440px,36vw)] min-[1920px]:max-w-[min(460px,32vw)] -translate-y-2 sm:-translate-y-3"
        >
          <Image
            src={RIGHT}
            width={RIGHT_W}
            height={RIGHT_H}
            alt=""
            className="h-auto w-full object-contain drop-shadow-2xl drop-shadow-black/50"
            sizes="(max-width: 1024px) 50vw, (max-width: 1536px) 380px, 400px"
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  )
}
