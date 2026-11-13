"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowRightIcon, CheckCircle2Icon, CircleAlertIcon } from "lucide-react"
import { createJob } from "@/lib/actions/jobs"
import type { JobForm } from "@/lib/types/job"
import {
    JOB_CATEGORIES,
    JOB_TYPES,
    PAY_FREQUENCIES,
} from "@/lib/constants/job"
import { PageHeader } from "@/components/dashboard/page-header"
import { SectionCard } from "@/components/dashboard/section"
import { FormField, RequiredMark } from "@/components/dashboard/field"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

// One flat object per job → easy to send to the backend as JSON as-is.
const initialJob: JobForm = {
    title: "",
    company: "",
    category: "",
    jobType: "Full-time",
    remoteAllowed: false,
    location: "",
    deadline: "",
    minSalary: "",
    maxSalary: "",
    frequency: "per hour",
    responsibilities: "",
    qualifications: "",
}


function NewJobPage() {
    const [job, setJob] = React.useState<JobForm>(initialJob)
    const [submitting, setSubmitting] = React.useState(false)
    const [statusMessage, setStatusMessage] = React.useState<
        { kind: "success" | "error"; text: string } | null
    >(null)

    function setField<K extends keyof JobForm>(key: K, value: JobForm[K]) {
        setJob((previous) => ({ ...previous, [key]: value }))
    }

    const router = useRouter();

    // Small helpers so inputs stay one-liners below.
    const text =
        (key: keyof JobForm) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setField(key, event.target.value)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitting(true)
        setStatusMessage(null)

        const result = await createJob(job)
        setSubmitting(false)

        if (result.ok) {
            setStatusMessage({
                kind: "success",
                text: "Job published successfully.",
            })
            toast.add({
                title: "Job created",
                description: "The job has been successfully created",
            })
            router.push('/dashboard/recruiter/jobs')
            setJob(initialJob)
        } else {
            setStatusMessage({
                kind: "error",
                text: result.error ?? "Something went wrong. Please try again.",
            })
        }
    }

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
            <PageHeader
                breadcrumbs={[
                    {
                        label: "Manage Jobs",
                        href: "/dashboard/recruiter/jobs",
                    },
                    { label: "Create New Listing" },
                ]}
                title="Post a New Job"
                description="Fill in the position specifications to attract qualified talent across your network."
            />

            <form id="new-job-form" onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* 1. Basic Information */}
                <SectionCard title="1. Basic Information">
                    <FormField label="Job Title" htmlFor="job-title" required>
                        <Input
                            id="job-title"
                            name="title"
                            placeholder="Frontend Developer"
                            className="h-9"
                            value={job.title}
                            onChange={text("title")}
                            required
                        />
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Company Name" htmlFor="company-name" required>
                            <Input
                                id="company-name"
                                name="company"
                                placeholder="HirePulse Network"
                                className="h-9"
                                value={job.company}
                                onChange={text("company")}
                                required
                            />
                        </FormField>
                        <FormField label="Job Category" htmlFor="job-category" required>
                            <Select
                                value={job.category || null}
                                onValueChange={(value) => setField("category", value as string)}
                            >
                                <SelectTrigger id="job-category" className="h-9 w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {JOB_CATEGORIES.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                    </div>

                    <fieldset className="space-y-1.5">
                        <legend className="text-sm font-medium">
                            Job Type <RequiredMark />
                        </legend>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {JOB_TYPES.map((type) => {
                                const selected = job.jobType === type
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() => setField("jobType", type)}
                                        className={`h-9 rounded-lg border text-sm font-medium transition-colors ${selected
                                            ? "border-primary bg-primary/10 text-foreground"
                                            : "text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                )
                            })}
                        </div>
                    </fieldset>
                </SectionCard>

                {/* 2. Location, Compensation & Timeline */}
                <SectionCard title="2. Location, Compensation & Timeline">
                    <div className="flex items-center justify-between gap-4 rounded-lg border bg-background/50 p-3">
                        <div>
                            <label htmlFor="remote-allowed" className="text-sm font-medium">
                                Remote Work Allowed (remote)
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Enable worldwide or distributed candidate applications
                            </p>
                        </div>
                        <Switch
                            id="remote-allowed"
                            checked={job.remoteAllowed}
                            onCheckedChange={(checked) => setField("remoteAllowed", checked)}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Job Location (city)" htmlFor="job-location" required>
                            <Input
                                id="job-location"
                                name="location"
                                placeholder="New York, USA"
                                className="h-9"
                                value={job.location}
                                onChange={text("location")}
                                required
                            />
                        </FormField>
                        <FormField
                            label="Application Deadline (deadline)"
                            htmlFor="deadline"
                            required
                        >
                            <Input
                                id="deadline"
                                name="deadline"
                                type="date"
                                className="h-9"
                                value={job.deadline}
                                onChange={text("deadline")}
                                required
                            />
                        </FormField>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <FormField label="Min Salary / Rate" htmlFor="min-salary">
                            <Input
                                id="min-salary"
                                name="minSalary"
                                type="number"
                                min="0"
                                placeholder="0"
                                className="h-9"
                                value={job.minSalary}
                                onChange={text("minSalary")}
                            />
                        </FormField>
                        <FormField label="Max Salary / Rate" htmlFor="max-salary">
                            <Input
                                id="max-salary"
                                name="maxSalary"
                                type="number"
                                min="0"
                                placeholder="0"
                                className="h-9"
                                value={job.maxSalary}
                                onChange={text("maxSalary")}
                            />
                        </FormField>
                        <FormField label="Frequency" htmlFor="frequency">
                            <Select
                                value={job.frequency}
                                onValueChange={(value) =>
                                    setField("frequency", (value ?? "per hour") as string)
                                }
                            >
                                <SelectTrigger id="frequency" className="h-9 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAY_FREQUENCIES.map((frequency) => (
                                        <SelectItem key={frequency} value={frequency}>
                                            {frequency}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormField>
                    </div>
                </SectionCard>

                {/* 3. Responsibilities & Requirements */}
                <SectionCard title="3. Responsibilities & Requirements">
                    <FormField label="Key Responsibilities" htmlFor="responsibilities" required>
                        <Textarea
                            id="responsibilities"
                            name="responsibilities"
                            rows={4}
                            placeholder="Describe the main responsibilities, one per line..."
                            value={job.responsibilities}
                            onChange={text("responsibilities")}
                            required
                        />
                    </FormField>

                    <FormField
                        label="Qualifications & Requirements"
                        htmlFor="qualifications"
                        required
                    >
                        <Textarea
                            id="qualifications"
                            name="qualifications"
                            rows={4}
                            placeholder="List the required skills and experience, one per line..."
                            value={job.qualifications}
                            onChange={text("qualifications")}
                            required
                        />
                    </FormField>
                </SectionCard>
                <section>
                    {statusMessage && (
                        <p
                            role="status"
                            className={`mb-3 flex items-center gap-2 text-sm ${statusMessage.kind === "success"
                                    ? "text-emerald-600"
                                    : "text-destructive"
                                }`}
                        >
                            {statusMessage.kind === "success" ? (
                                <CheckCircle2Icon className="size-4" />
                            ) : (
                                <CircleAlertIcon className="size-4" />
                            )}
                            {statusMessage.text}
                        </p>
                    )}
                    <Button type="submit" form="new-job-form" size="lg" disabled={submitting}>
                        {submitting ? "Publishing..." : "Publish Job"}
                        <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                </section>
            </form>
        </div>
    )
}

export default NewJobPage
