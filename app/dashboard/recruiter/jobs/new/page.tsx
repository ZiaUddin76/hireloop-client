"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowRightIcon } from "lucide-react"
import { createJob } from "@/lib/actions/jobs"

const JOB_CATEGORIES = [
    "Engineering & Tech",
    "Design & Creative",
    "Marketing",
    "Sales",
    "Finance & Legal",
    "Other",
]

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"]

const PAY_FREQUENCIES = ["per hour", "per day", "per month", "per year"]

// One flat object per job → easy to send to the backend as JSON as-is.
export type JobForm = {
    title: string
    company: string
    category: string
    jobType: string
    remoteAllowed: boolean
    location: string
    deadline: string
    minSalary: string
    maxSalary: string
    frequency: string
    responsibilities: string
    qualifications: string
}

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

function RequiredMark() {
    return <span className="text-destructive">*</span>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="flex items-center gap-2 text-sm font-semibold">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            {children}
        </h2>
    )
}

function NewJobPage() {
    const [job, setJob] = React.useState<JobForm>(initialJob)

    function setField<K extends keyof JobForm>(key: K, value: JobForm[K]) {
        setJob((previous) => ({ ...previous, [key]: value }))
    }

    // Small helpers so inputs stay one-liners below.
    const text =
        (key: keyof JobForm) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setField(key, event.target.value)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        // TODO: send `job` to the backend API (POST /jobs) once available.
        console.log("Job to publish:", job)

        const result = await createJob(job);
        console.log("createJob result:", result);
        
    }

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
            <p className="text-xs text-muted-foreground">
                <Link
                    href="/dashboard/recruiter/jobs"
                    className="hover:text-foreground"
                >
                    Manage Jobs
                </Link>
                <span aria-hidden> &gt; </span>
                <span>Create New Listing</span>
            </p>

            {/* Header */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Post a New Job
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Fill in the position specifications to attract qualified talent
                        across your network.
                    </p>
                </div>

            </div>

            <form id="new-job-form" onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* 1. Basic Information */}
                <section className="space-y-4 rounded-xl border bg-card p-6">
                    <SectionTitle>1. Basic Information</SectionTitle>

                    <div className="space-y-1.5">
                        <Label htmlFor="job-title">
                            Job Title <RequiredMark />
                        </Label>
                        <Input
                            id="job-title"
                            name="title"
                            placeholder="Frontend Developer"
                            className="h-9"
                            value={job.title}
                            onChange={text("title")}
                            required
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="company-name">
                                Company Name <RequiredMark />
                            </Label>
                            <Input
                                id="company-name"
                                name="company"
                                placeholder="HirePulse Network"
                                className="h-9"
                                value={job.company}
                                onChange={text("company")}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="job-category">
                                Job Category <RequiredMark />
                            </Label>
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
                        </div>
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
                </section>

                {/* 2. Location, Compensation & Timeline */}
                <section className="space-y-4 rounded-xl border bg-card p-6">
                    <SectionTitle>2. Location, Compensation &amp; Timeline</SectionTitle>

                    <div className="flex items-center justify-between gap-4 rounded-lg border bg-background/50 p-3">
                        <div>
                            <Label htmlFor="remote-allowed" className="font-medium">
                                Remote Work Allowed (remote)
                            </Label>
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
                        <div className="space-y-1.5">
                            <Label htmlFor="job-location">
                                Job Location (city) <RequiredMark />
                            </Label>
                            <Input
                                id="job-location"
                                name="location"
                                placeholder="New York, USA"
                                className="h-9"
                                value={job.location}
                                onChange={text("location")}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="deadline">
                                Application Deadline (deadline) <RequiredMark />
                            </Label>
                            <Input
                                id="deadline"
                                name="deadline"
                                type="date"
                                className="h-9"
                                value={job.deadline}
                                onChange={text("deadline")}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="min-salary">Min Salary / Rate</Label>
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
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="max-salary">Max Salary / Rate</Label>
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
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="frequency">Frequency</Label>
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
                        </div>
                    </div>
                </section>

                {/* 3. Responsibilities & Requirements */}
                <section className="space-y-4 rounded-xl border bg-card p-6">
                    <SectionTitle>3. Responsibilities &amp; Requirements</SectionTitle>

                    <div className="space-y-1.5">
                        <Label htmlFor="responsibilities">
                            Key Responsibilities <RequiredMark />
                        </Label>
                        <Textarea
                            id="responsibilities"
                            name="responsibilities"
                            rows={4}
                            placeholder="Describe the main responsibilities, one per line..."
                            value={job.responsibilities}
                            onChange={text("responsibilities")}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="qualifications">
                            Qualifications &amp; Requirements <RequiredMark />
                        </Label>
                        <Textarea
                            id="qualifications"
                            name="qualifications"
                            rows={4}
                            placeholder="List the required skills and experience, one per line..."
                            value={job.qualifications}
                            onChange={text("qualifications")}
                            required
                        />
                    </div>
                </section>
                <section>
                    <Button type="submit" form="new-job-form" size="lg">
                        Publish Job
                        <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                </section>
            </form>
        </div>
    )
}

export default NewJobPage
