'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"
import { applyToAJob } from "@/lib/actions/applications"

// "Apply Now" action on the job details page. Applying requires an account:
// visitors are sent to sign in (and return here), and only job seeker
// accounts can submit an application.
function ApplyNowButton({
    jobId,
    jobTitle,
    companyName,
    jobType,
    location,
    remoteAllowed,
}: {
    jobId: string
    jobTitle: string
    companyName: string
    jobType: string
    location: string
    remoteAllowed: boolean
}) {
    const router = useRouter()
    const { data: session } = useSession()
    const user = session?.user
    const [pending, setPending] = useState(false)

    async function handleApply() {
        if (!user) {
            router.push(`/sign-in?redirectTo=/browse-jobs/${jobId}`)
            return
        }

        if (user.role !== "seeker") {
            toast.add({
                title: "Sign in as a job seeker",
                description: "Only job seeker accounts can apply to jobs.",
            })
            return
        }

        setPending(true)
        const result = await applyToAJob({
            jobId,
            userId: user.id,
            email: user.email,
            jobTitle,
            companyName,
            jobType,
            location,
            remoteAllowed,
        })
        setPending(false)

        if (result.ok) {
            toast.add({
                title: "Application submitted",
                description: `You applied for ${jobTitle} at ${companyName}.`,
            })
            router.push("/dashboard/seeker/applications")
        } else {
            toast.add({
                title: "Application failed",
                description:
                    result.error ??
                    "Something went wrong. Please try again.",
            })
        }
    }

    return (
        <Button
            onClick={handleApply}
            disabled={pending}
            className="h-9 bg-white px-4 text-primary hover:bg-white/90"
        >
            {pending ? "Applying…" : "Apply Now"}
        </Button>
    )
}

export { ApplyNowButton }
