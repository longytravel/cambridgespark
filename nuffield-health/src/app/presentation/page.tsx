"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import TextBlockAnimation from "@/components/ui/text-block-animation"
import {
  ProgressSlider,
  SliderContent,
  SliderWrapper,
  SliderBtnGroup,
  SliderBtn,
} from "@/components/ui/progressive-carousel"

/* ═══════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════ */
const TOTAL_SLIDES = 8
const INK = "#111111"
const TEAL = "#0d9488"

const EASE = [0.22, 1, 0.36, 1] as const

const slideV = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.98 }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
  exit: (d: number) => ({
    opacity: 0,
    x: d > 0 ? -60 : 60,
    scale: 0.98,
    transition: { duration: 0.3 },
  }),
}

/* ═══════════════════════════════════════════════════
   GSAP FadeIn helper
   ═══════════════════════════════════════════════════ */
function GFadeIn({
  children,
  delay = 0,
  y = 30,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration: 0.8, delay, ease: "expo.out" }
    )
  }, { scope: ref, dependencies: [delay, y] })

  return (
    <div ref={ref} style={{ opacity: 0 }} className={className}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   Slide wrapper — full bleed, left/right aligned
   ═══════════════════════════════════════════════════ */
function Slide({
  children,
  align = "left",
}: {
  children: React.ReactNode
  align?: "left" | "right" | "center"
}) {
  const justify = align === "right" ? "items-end text-right" : align === "center" ? "items-center text-center" : "items-start text-left"
  return (
    <div className={`flex h-full w-full flex-col justify-center ${justify} px-[6vw] md:px-[8vw] bg-white`}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SLIDE 0 — Title Slide
   ═══════════════════════════════════════════════════ */
function TitleSlide() {
  return (
    <Slide>
      <TextBlockAnimation
        blockColor={INK}
        animateOnScroll={false}
        delay={0.3}
        duration={0.8}
        stagger={0.1}
      >
        <h1 className="text-[clamp(3rem,10vw,10rem)] font-black text-[#111] tracking-tighter leading-[1]">
          Something<br />is happening.
        </h1>
      </TextBlockAnimation>

      <GFadeIn delay={2}>
        <p className="mt-8 text-[clamp(1rem,2vw,1.8rem)] text-zinc-400 font-semibold max-w-2xl">
          A conversation about AI, boring tools, and a real opportunity.
        </p>
      </GFadeIn>

      <GFadeIn delay={2.6}>
        <p className="mt-12 text-[clamp(0.8rem,1.2vw,1.1rem)] text-zinc-300 font-medium">
          Chris Gowland &middot; Paul Speight
        </p>
      </GFadeIn>
    </Slide>
  )
}

/* ═══════════════════════════════════════════════════
   SLIDE 1 — The Dot Picture + "We Are So Early"
   Big text left, dots right
   ═══════════════════════════════════════════════════ */
function DotEarlySlide() {
  const COLS = 40
  const ROWS = 40
  const TOTAL = COLS * ROWS

  const dots = useMemo(() => {
    return Array.from({ length: TOTAL }, (_, i) => {
      const row = Math.floor(i / COLS)

      let color = "#d4d1c8"
      if (row >= 34) color = "#6bc589"
      if (i >= TOTAL - 6 && i < TOTAL - 1) color = "#e5a83b"
      if (i === TOTAL - 1) color = "#d95050"

      const invertedRow = ROWS - 1 - row
      const delay = 0.5 + invertedRow * 0.05

      return { color, delay }
    })
  }, [])

  return (
    <div className="flex h-full w-full bg-white">
      {/* Left — big text */}
      <div className="flex flex-col justify-center px-[6vw] md:px-[8vw] w-1/2">
        <TextBlockAnimation
          blockColor={INK}
          animateOnScroll={false}
          delay={0.2}
          duration={0.8}
          stagger={0.1}
        >
          <h1 className="text-[clamp(2rem,5.5vw,6rem)] font-black text-[#111] tracking-tighter leading-[1.05]">
            6.8 billion people have never used AI.
          </h1>
        </TextBlockAnimation>

        <TextBlockAnimation
          blockColor={TEAL}
          animateOnScroll={false}
          delay={1.8}
          duration={0.5}
        >
          <p className="mt-6 text-[clamp(1.2rem,2.5vw,2.5rem)] text-teal-700 font-black tracking-tight">
            We are so early.
          </p>
        </TextBlockAnimation>

        <GFadeIn delay={2.6}>
          <p className="mt-6 text-[clamp(0.75rem,1.1vw,1.1rem)] text-zinc-400 font-medium max-w-md">
            82% of American businesses aren&apos;t using AI for anything. Only 4% have mature capabilities. &mdash; Stephen Bartlett
          </p>
        </GFadeIn>

      </div>

      {/* Right — title, dot grid, legend */}
      <div className="flex flex-col items-center justify-center w-1/2 pr-[4vw]">
        <GFadeIn delay={0.1} className="mb-3 text-center">
          <h2 className="text-[clamp(1.2rem,2.2vw,2rem)] font-black text-[#111] tracking-tight">
            Each dot is ~3.2 million people
          </h2>
          <p className="text-[0.65rem] text-zinc-400 mt-1">
            2,500 dots = 8.1 billion humans. Color = most advanced AI interaction, Feb 2026.
          </p>
        </GFadeIn>

        <div
          className="grid gap-[2px] w-full"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            maxWidth: "min(500px, 42vw)",
          }}
        >
          {dots.map((dot, i) => (
            <div
              key={i}
              className="aspect-square rounded-[1px] pres-dot"
              style={{
                backgroundColor: dot.color,
                animationDelay: `${dot.delay}s`,
              }}
            />
          ))}
        </div>

        <GFadeIn delay={3} className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[0.6rem] text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#d4d1c8]" /> Never used AI &middot; ~6.8B (84%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#6bc589]" /> Free chatbot &middot; ~1.3B (16%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#e5a83b]" /> Pays $20/mo &middot; ~15-25M (0.3%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#d95050]" /> Coding scaffold &middot; ~2-5M (0.04%)
          </span>
        </GFadeIn>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SLIDE 4 — The Boring Tools Thesis
   ═══════════════════════════════════════════════════ */
function BoringToolsSlide() {
  return (
    <Slide align="right">
      <TextBlockAnimation
        blockColor={INK}
        animateOnScroll={false}
        delay={0.2}
        duration={0.8}
        stagger={0.1}
      >
        <h1 className="text-[clamp(3rem,9vw,9rem)] font-black text-[#111] tracking-tighter leading-[1.05]">
          The flashy AI phase is over.
        </h1>
      </TextBlockAnimation>

      <GFadeIn delay={1.4}>
        <p className="mt-6 text-[clamp(1rem,2vw,1.8rem)] text-zinc-500 font-medium max-w-2xl ml-auto leading-relaxed">
          People don&apos;t know what to ask. The answers are too broad. It doesn&apos;t fit into existing workflows.
        </p>
      </GFadeIn>

      <TextBlockAnimation
        blockColor={TEAL}
        animateOnScroll={false}
        delay={2.2}
        duration={0.6}
      >
        <p className="mt-6 text-[clamp(2rem,5vw,5rem)] text-teal-700 font-black tracking-tight">
          The real revolution is boring.
        </p>
      </TextBlockAnimation>
    </Slide>
  )
}

/* ═══════════════════════════════════════════════════
   SLIDE 5 — The Electricity Analogy
   ═══════════════════════════════════════════════════ */
function ElectricitySlide() {
  return (
    <Slide>
      <TextBlockAnimation
        blockColor="#d97706"
        animateOnScroll={false}
        delay={0.3}
        duration={0.7}
        stagger={0.1}
      >
        <h1 className="text-[clamp(3rem,8vw,8rem)] font-black text-[#111] tracking-tighter leading-[1.05]">
          Power stations made headlines.
        </h1>
      </TextBlockAnimation>

      <TextBlockAnimation
        blockColor={TEAL}
        animateOnScroll={false}
        delay={1.3}
        duration={0.7}
        stagger={0.1}
      >
        <h1 className="mt-6 text-[clamp(3rem,8vw,8rem)] font-black text-teal-700 tracking-tighter leading-[1.05]">
          Washing machines changed civilisation.
        </h1>
      </TextBlockAnimation>

      <GFadeIn delay={2.3}>
        <p className="mt-10 text-[clamp(0.9rem,1.5vw,1.4rem)] text-zinc-500 max-w-2xl font-medium leading-relaxed">
          A meeting summariser. A policy explainer. A complaint analyser. None revolutionary. Used a hundred times a week &mdash; powerful.
        </p>
      </GFadeIn>
    </Slide>
  )
}

/* ═══════════════════════════════════════════════════
   SLIDE 6 — The Hidden Shift
   ═══════════════════════════════════════════════════ */
function HiddenShiftSlide() {
  return (
    <Slide align="right">
      <TextBlockAnimation
        blockColor={INK}
        animateOnScroll={false}
        delay={0.2}
        duration={0.7}
        stagger={0.1}
      >
        <h1 className="text-[clamp(3rem,9vw,9rem)] font-black text-[#111] tracking-tighter leading-[1.05]">
          You no longer need a software team.
        </h1>
      </TextBlockAnimation>

      <TextBlockAnimation
        blockColor={TEAL}
        animateOnScroll={false}
        delay={1.4}
        duration={0.5}
      >
        <p className="mt-8 text-[clamp(1.8rem,4vw,4rem)] text-teal-700 font-black tracking-tight">
          The barrier collapsed.
        </p>
      </TextBlockAnimation>

      <GFadeIn delay={2}>
        <p className="mt-8 text-[clamp(0.9rem,1.5vw,1.4rem)] text-zinc-500 max-w-2xl ml-auto leading-relaxed font-medium">
          A planning manager, an analyst, an operations lead can design AI tools &mdash; because they already understand the workflow.
        </p>
      </GFadeIn>
    </Slide>
  )
}

/* ═══════════════════════════════════════════════════
   SLIDE 7 — We Built One (Progressive Carousel)
   ═══════════════════════════════════════════════════ */
const screenshots = [
  {
    title: "Dashboard",
    desc: "KPIs and tier distribution",
    img: "/presentation/dashboard.png",
    sliderName: "dashboard",
  },
  {
    title: "AI Scoring",
    desc: "Evidence-backed scores",
    img: "/presentation/quality-scoring.png",
    sliderName: "scoring",
  },
  {
    title: "Rewrite",
    desc: "AI content improvement",
    img: "/presentation/rewrite-engine.png",
    sliderName: "rewrite",
  },
  {
    title: "Actions",
    desc: "Prioritised quick wins",
    img: "/presentation/action-centre.png",
    sliderName: "actions",
  },
  {
    title: "Before / After",
    desc: "Side-by-side comparison",
    img: "/presentation/before-after.png",
    sliderName: "before-after",
  },
]

function WeBuiltOneSlide() {
  return (
    <Slide>
      <TextBlockAnimation
        blockColor={INK}
        animateOnScroll={false}
        delay={0.2}
        duration={0.7}
      >
        <h1 className="text-[clamp(3rem,8vw,8rem)] font-black text-[#111] tracking-tighter leading-[1.05] mb-6">
          We built one.
        </h1>
      </TextBlockAnimation>

      <GFadeIn delay={1} className="w-full max-w-5xl">
        <div onClick={(e) => e.stopPropagation()}>
          <ProgressSlider
            vertical={false}
            activeSlider="dashboard"
            duration={8000}
            className="w-full"
          >
            <SliderContent>
              {screenshots.map((item) => (
                <SliderWrapper key={item.sliderName} value={item.sliderName}>
                  <img
                    className="w-full h-[300px] md:h-[400px] object-cover object-top shadow-xl"
                    src={item.img}
                    alt={item.desc}
                  />
                </SliderWrapper>
              ))}
            </SliderContent>

            <SliderBtnGroup className="absolute bottom-0 left-0 right-0 h-fit text-[#111] bg-white/95 backdrop-blur-md overflow-hidden grid grid-cols-5 border-t border-zinc-200">
              {screenshots.map((item) => (
                <SliderBtn
                  key={item.sliderName}
                  value={item.sliderName}
                  className="text-left cursor-pointer p-3 md:p-4 border-r border-zinc-200 last:border-r-0"
                  progressBarClass="bg-teal-100 h-full"
                >
                  <h3 className="font-bold text-xs md:text-sm text-[#111] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-500 font-normal line-clamp-2 leading-snug">
                    {item.desc}
                  </p>
                </SliderBtn>
              ))}
            </SliderBtnGroup>
          </ProgressSlider>
        </div>
      </GFadeIn>

      <GFadeIn delay={1.5} className="mt-4">
        <p className="text-[clamp(0.8rem,1.2vw,1.1rem)] text-zinc-400 font-medium">
          3,800 profiles &middot; AI quality scoring &middot; Gap analysis &middot; Content rewriting &middot; Copilot
        </p>
      </GFadeIn>
    </Slide>
  )
}

/* ═══════════════════════════════════════════════════
   SLIDE 8 — The Question
   ═══════════════════════════════════════════════════ */
const questions = [
  "Do you see a genuine market need?",
  "Is there a scale opportunity?",
  "What are we not seeing?",
]

function TheQuestionSlide() {
  return (
    <Slide>
      <GFadeIn delay={0.2}>
        <p className="text-[clamp(0.65rem,0.9vw,0.85rem)] uppercase tracking-[0.3em] text-teal-600/60 font-semibold mb-10">
          Our ask
        </p>
      </GFadeIn>

      <div className="space-y-8 w-full">
        {questions.map((q, i) => (
          <TextBlockAnimation
            key={i}
            blockColor={i === 0 ? TEAL : i === 1 ? "#d97706" : "#dc2626"}
            animateOnScroll={false}
            delay={0.5 + i * 0.6}
            duration={0.6}
          >
            <div className="flex items-baseline gap-6">
              <span className="text-[clamp(3rem,6vw,6rem)] font-black text-zinc-200 font-mono leading-none shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[clamp(1.8rem,4.5vw,4.5rem)] font-black text-[#111] tracking-tight leading-[1.05]">
                {q}
              </p>
            </div>
          </TextBlockAnimation>
        ))}
      </div>

      <GFadeIn delay={2.4} className="mt-10">
        <p className="text-[clamp(1rem,1.5vw,1.4rem)] text-zinc-400 font-medium max-w-2xl">
          We have good careers. We&apos;re not going to throw them away on a gut feeling. Not investment. Not a partnership. Just your honest read.
        </p>
      </GFadeIn>
    </Slide>
  )
}

/* ═══════════════════════════════════════════════════
   SLIDE 9 — Discussion / Close
   ═══════════════════════════════════════════════════ */
function DiscussionSlide() {
  return (
    <Slide align="center">
      <TextBlockAnimation
        blockColor={INK}
        animateOnScroll={false}
        delay={0.3}
        duration={0.8}
        stagger={0.1}
      >
        <h1 className="text-[clamp(3rem,10vw,10rem)] font-black text-[#111] tracking-tighter leading-[1.05]">
          Over to you.
        </h1>
      </TextBlockAnimation>

      <GFadeIn delay={1.6}>
        <div className="mt-10 w-20 h-px bg-teal-600/40 mx-auto" />
      </GFadeIn>

      <GFadeIn delay={2}>
        <p className="mt-8 text-[clamp(1rem,1.8vw,1.6rem)] text-zinc-400 font-medium">
          We&apos;ll send you the full demo afterwards.
        </p>
      </GFadeIn>
    </Slide>
  )
}

/* ═══════════════════════════════════════════════════
   Main Presentation Controller
   ═══════════════════════════════════════════════════ */
export default function PresentationPage() {
  const [slide, setSlide] = useState(0)
  const [dir, setDir] = useState(1)
  const router = useRouter()

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= TOTAL_SLIDES) return
      setDir(next > slide ? 1 : -1)
      setSlide(next)
    },
    [slide]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowRight" ||
        e.key === " " ||
        e.key === "Enter"
      ) {
        e.preventDefault()
        go(slide + 1)
      }
      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault()
        go(slide - 1)
      }
      if (e.key === "Escape") router.push("/")
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [slide, go, router])

  const slides = [
    <TitleSlide key="s0" />,
    <DotEarlySlide key="s1" />,
    <BoringToolsSlide key="s2" />,
    <ElectricitySlide key="s3" />,
    <HiddenShiftSlide key="s4" />,
    <WeBuiltOneSlide key="s5" />,
    <TheQuestionSlide key="s6" />,
    <DiscussionSlide key="s7" />,
  ]

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes dotDrop {
              0% { opacity: 0; transform: translateY(-12px) scale(0.6); }
              60% { opacity: 1; transform: translateY(1px) scale(1.05); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            .pres-dot {
              opacity: 0;
              animation: dotDrop 0.2s ease-out forwards;
            }
          `,
        }}
      />

      <div
        className="fixed inset-0 z-50 overflow-hidden select-none cursor-pointer bg-white"
        onClick={() => go(slide + 1)}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide}
            custom={dir}
            variants={slideV}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {slides[slide]}
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-zinc-100 z-[60]">
          <motion.div
            className="h-full bg-teal-600"
            animate={{ width: `${((slide + 1) / TOTAL_SLIDES) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Slide counter */}
        <div className="fixed bottom-3 right-6 text-xs font-mono z-[60] text-zinc-300">
          {slide + 1} / {TOTAL_SLIDES}
        </div>

        {/* Navigation hint (first slide only) */}
        {slide === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="fixed bottom-3 left-6 text-xs text-zinc-300 z-[60]"
          >
            Click or press &rarr; to advance &middot; ESC to exit
          </motion.div>
        )}
      </div>
    </>
  )
}
