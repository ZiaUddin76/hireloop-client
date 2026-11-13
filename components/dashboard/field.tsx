import * as React from "react"
import { cn } from "cn"

import { Label } from "@/components/ui/label"

function RequiredMark() {
    return <span className="text-destructive">*</span>
}

// Label + control wrapper for form fields ("space-y-1.5" + <Label htmlFor>).
function FormField({
    label,
    htmlFor,
    required,
    children,
    className,
}: {
    label: React.ReactNode
    htmlFor?: string
    required?: boolean
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <Label htmlFor={htmlFor}>
                {label}
                {required && <> <RequiredMark /></>}
            </Label>
            {children}
        </div>
    )
}

export { FormField, RequiredMark }
