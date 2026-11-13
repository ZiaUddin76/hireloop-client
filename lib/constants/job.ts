// Shared job domain constants, used by the "Post a New Job" form and the
// Manage Jobs table. Single source of truth so both pages stay in sync.
import type { LucideIcon } from "lucide-react"
import {
    Code2Icon,
    MegaphoneIcon,
    PaletteIcon,
    ScaleIcon,
    TrendingUpIcon,
} from "lucide-react"

export const JOB_CATEGORIES = [
    "Engineering & Tech",
    "Design & Creative",
    "Marketing",
    "Sales",
    "Finance & Legal",
    "Other",
] as const

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const

export const PAY_FREQUENCIES = ["per hour", "per day", "per month", "per year"] as const

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
    "Engineering & Tech": Code2Icon,
    "Design & Creative": PaletteIcon,
    Marketing: MegaphoneIcon,
    Sales: TrendingUpIcon,
    "Finance & Legal": ScaleIcon,
}
