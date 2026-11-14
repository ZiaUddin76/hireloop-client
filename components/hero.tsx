import Image from "next/image"
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import {
  Building2,
  FileSearch,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
  Users,
} from "lucide-react"

import globeImg from "@/app/images/globe.png"

const STATS = [
  { icon: FileSearch, value: "50K", label: "Active Jobs" },
  { icon: Building2, value: "12K", label: "Companies" },
  { icon: Users, value: "2M", label: "Job Seekers" },
  { icon: StarIcon, value: "97%", label: "Satisfaction Rate" },
] as const

const TRENDING_POSITIONS = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
] as const

function StatCard({ icon: Icon, value, label }: (typeof STATS)[number]) {
  return (
    <div
      data-slot="stat-card"
      className="flex min-h-48 flex-col justify-between gap-10 rounded-2xl border border-white/10 bg-gradient-to-b from-[#010102] to-[#313131] p-6 sm:min-h-56 sm:p-8"
    >
      <Icon className="size-6 text-white" />
      <div>
        <p className="font-heading text-4xl font-bold text-white sm:text-5xl">
          {value}
        </p>
        <p className="mt-1 text-base text-white/90 sm:text-lg">{label}</p>
      </div>
    </div>
  )
}

export function Hero({ className }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="hero"
      className={cn("relative overflow-hidden bg-[#08080a]", className)}
    >
      {/* Backdrop: pink top wash, brand glow and rising globe (Figma hero composition) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-fuchsia-500/40 via-fuchsia-500/10 to-transparent" />
        <Image
          src={globeImg}
          alt=""
          priority
          className="absolute bottom-0 left-1/2 h-auto w-[150%] max-w-none -translate-x-1/2 opacity-90 sm:w-[120%] lg:w-full"
        />
        <div className="absolute inset-x-0 bottom-0 -mb-24 h-full bg-[radial-gradient(ellipse_70%_50%_at_50%_65%,rgba(92,83,254,0.45),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,transparent_20%,rgba(8,8,10,0.75)_78%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08080a] to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-10 sm:pt-24 lg:pt-28">
        {/* Badge */}
        <div className="flex items-center justify-center gap-4">
          <span className="hidden h-px w-16 bg-gradient-to-r from-transparent to-white/70 sm:block" />
          <span className="inline-flex h-11 items-center gap-2.5 rounded-full border border-white/10 bg-[#141418]/90 px-5 text-center font-mono text-xs text-white sm:text-base">
            <SparklesIcon className="size-4 sm:size-6" />
            50,000+ new jobs this month
          </span>
          <span className="hidden h-px w-16 bg-gradient-to-l from-transparent to-white/70 sm:block" />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-center font-heading text-4xl font-bold text-white sm:text-5xl lg:text-[56px] lg:leading-[1.15]">
          Find Your Dream Job Today
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-center text-lg text-white/70 sm:text-xl sm:leading-[1.6]">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search */}
        <form
          action="/browse-jobs"
          method="get"
          className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-4 rounded-2xl border border-white/20 bg-[#101010] p-4 sm:flex-row sm:items-center sm:rounded-full sm:py-0 lg:gap-2"
        >
          <div className="flex flex-1 items-center gap-3 px-2">
            <SearchIcon className="size-5 shrink-0 text-white" />
            <input
              type="search"
              name="q"
              placeholder="Job title, skill or company"
              aria-label="Job title, skill or company"
              className="h-10 w-full bg-transparent text-base text-white outline-none placeholder:text-white/80 sm:h-12"
            />
          </div>
          <div className="hidden h-6 w-px bg-white/20 sm:block" />
          <div className="flex flex-1 items-center gap-3 px-2">
            <MapPinIcon className="size-5 shrink-0 text-white" />
            <input
              type="search"
              name="location"
              placeholder="Location or Remote"
              aria-label="Location or Remote"
              className="h-10 w-full bg-transparent text-base text-white outline-none placeholder:text-white/80 sm:h-12"
            />
          </div>
          <Button
            type="submit"
            size="icon-lg"
            className="self-center rounded-xl sm:self-auto"
            aria-label="Search jobs"
          >
            <SearchIcon />
          </Button>
        </form>

        {/* Trending */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          <span className="text-base text-white/70">Trending Position</span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {TRENDING_POSITIONS.map((position) => (
              <Link
                key={position}
                href={`/jobs?q=${encodeURIComponent(position)}`}
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "rounded-full border border-white/10 bg-[#1a1a1b] text-white hover:bg-[#1a1a1b]/60",
                })}
              >
                {position}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 sm:mt-28">
          <h2 className="mx-auto max-w-xl text-center text-3xl font-medium text-white/70 sm:max-w-2xl sm:text-4xl sm:leading-snug">
            Assisting over 15,000 job seekers find their dream positions.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
