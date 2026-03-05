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
const TOTAL_SLIDES = 10
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
   SLIDE 1 — The Dot Picture
   ═══════════════════════════════════════════════════ */
function DotPictureSlide() {
  const COLS = 50
  const ROWS = 50
  const TOTAL = COLS * ROWS

  const dots = useMemo(() => {
    return Array.from({ length: TOTAL }, (_, i) => {
      const row = Math.floor(i / COLS)

      let color = "#d4d1c8"
      if (row >= 42) color = "#6bc589"
      if (i >= TOTAL - 8 && i < TOTAL - 1) color = "#e5a83b"
      if (i === TOTAL - 1) color = "#d95050"

      const invertedRow = ROWS - 1 - row
      const delay = 0.5 + invertedRow * 0.045

      return { color, delay }
    })
  }, [])

  return (
    <Slide align="center">
      <TextBlockAnimation
        blockColor={INK}
        animateOnScroll={false}
        delay={0.1}
        duration={0.5}
      >
        <h1 className="text-[clamp(1.8rem,4.5vw,4rem)] font-black text-[#111] tracking-tight mb-2">
          Each dot is ~3.2 million people
        </h1>
      </TextBlockAnimation>

      <GFadeIn delay={0.7} className="mb-5">
        <p className="text-[clamp(0.75rem,1.2vw,1rem)] text-zinc-500 font-normal">
          2,500 dots = 8.1 billion humans. Color = most advanced AI interaction, Feb 2026.
        </p>
      </GFadeIn>

      <div
        className="grid gap-[2px] w-full"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          maxWidth: "min(680px, 88vw)",
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

      <GFadeIn delay={1.8} className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#d4d1c8]" /> Never used AI &middot; ~6.8B (84%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#6bc589]" /> Free chatbot user &middot; ~1.3B (16%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#e5a83b]" /> Pays $20/mo &middot; ~15-25M (~0.3%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#d95050]" /> Uses coding scaffold &middot; ~2-5M (~0.04%)
        </span>
      </GFadeIn>
    </Slide>
  )
}

/* ═══════════════════════════════════════════════════
   SLIDE 2 — "We Are So Early"
   ═══════════════════════════════════════════════════ */
function EarlySlide() {
  return (
    <Slide>
      <TextBlockAnimation
        blockColor={INK}
        animateOnScroll={false}
        delay={0.2}
        duration={0.8}
        stagger={0.1}
      >
        <h1 className="text-[clamp(3rem,9vw,9rem)] font-black text-[#111] tracking-tighter leading-[1.05]">
          6.8 billion people have never used AI.
        </h1>
      </TextBlockAnimation>

      <TextBlockAnimation
        blockColor={TEAL}
        animateOnScroll={false}
        delay={1.8}
        duration={0.5}
      >
        <p className="mt-10 text-[clamp(1.5rem,4vw,4rem)] text-teal-700 font-black tracking-tight">
          We are so early.
        </p>
      </TextBlockAnimation>

      <GFadeIn delay={2.6}>
        <p className="mt-8 text-[clamp(0.9rem,1.5vw,1.4rem)] text-zinc-400 font-medium max-w-2xl">
          82% of American businesses aren&apos;t using AI for anything. Only 4% have mature capabilities. &mdash; Stephen Bartlett
        </p>
      </GFadeIn>
    </Slide>
  )
}

/* ═══════════════════════════════════════════════════
   SLIDE 3 — Who We Are
   ═══════════════════════════════════════════════════ */
function WhoWeAreSlide() {
  return (
    <Slide>
      <GFadeIn delay={0.2}>
        <p className="text-[clamp(0.65rem,0.9vw,0.85rem)] uppercase tracking-[0.3em] text-teal-600/60 mb-6 font-semibold">
          Quick bit of context on us
        </p>
      </GFadeIn>

      <div className="w-full space-y-8">
        <div>
          <TextBlockAnimation
            blockColor={TEAL}
            animateOnScroll={false}
            delay={0.4}
            duration={0.5}
          >
            <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-black text-[#111] tracking-tighter leading-[1.05]">
              Chris Gowland
            </h2>
          </TextBlockAnimation>
          <GFadeIn delay={0.9}>
            <p className="mt-3 text-[clamp(0.9rem,1.5vw,1.4rem)] text-zinc-500 font-medium max-w-3xl">
              CCO, Nuffield Health. Cambridge 1st. 10 years at Lloyds Banking Group.
              Led digital transformation at scale. Oxford AI Programme.
            </p>
          </GFadeIn>
        </div>

        <div>
          <TextBlockAnimation
            blockColor="#d97706"
            animateOnScroll={false}
            delay={1.2}
            duration={0.5}
          >
            <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-black text-[#111] tracking-tighter leading-[1.05]">
              Paul Speight
            </h2>
          </TextBlockAnimation>
          <GFadeIn delay={1.7}>
            <p className="mt-3 text-[clamp(0.9rem,1.5vw,1.4rem)] text-zinc-500 font-medium max-w-3xl">
              7 years at Lloyds Banking Group. Workforce operations for 20,000 people.
              Knows where friction lives.
            </p>
          </GFadeIn>
        </div>
      </div>

      <GFadeIn delay={2.4}>
        <p className="mt-8 text-[clamp(1rem,1.8vw,1.6rem)] text-zinc-400 font-semibold max-w-3xl">
          Neither of us has a startup pedigree. What we have is a strong feeling we&apos;re looking at something real.
        </p>
      </GFadeIn>
    </Slide>
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
                    className="rounded-t-xl w-full h-[300px] md:h-[400px] object-cover object-top shadow-xl"
                    src={item.img}
                    alt={item.desc}
                  />
                </SliderWrapper>
              ))}
            </SliderContent>

            <SliderBtnGroup className="absolute bottom-0 h-fit text-[#111] bg-white/90 backdrop-blur-md overflow-hidden grid grid-cols-5 rounded-b-xl border-t border-zinc-200">
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
    <DotPictureSlide key="s1" />,
    <EarlySlide key="s2" />,
    <WhoWeAreSlide key="s3" />,
    <BoringToolsSlide key="s4" />,
    <ElectricitySlide key="s5" />,
    <HiddenShiftSlide key="s6" />,
    <WeBuiltOneSlide key="s7" />,
    <TheQuestionSlide key="s8" />,
    <DiscussionSlide key="s9" />,
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
