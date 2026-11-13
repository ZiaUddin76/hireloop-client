'use client'

import { Trash2Icon } from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { JobListing } from "@/lib/types/job"
import { deleteJob } from "@/lib/actions/jobs"
import { useState } from "react"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"



export function DeleteJobDialogue({ job }: { job: JobListing }) {

    const [open, SetOpen] = useState(false)
    const router = useRouter();

    const handleDelete = async () => {
        const res = await deleteJob(job.id);
        if (res.ok) {
            SetOpen(false);
            toast.add({
                title: "Job deleted",
                description: "The job has been permanently deleted",
            })
            router.refresh()
        } else {
            toast.add({
                title: "Delete failed",
                description: res.error ?? "Something went wrong. Please try again.",
            })
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={SetOpen} >
            <AlertDialogTrigger
                render={<Button variant="destructive"><Trash2Icon /></Button>}
            />
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Job?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete this job. View{" "}
                        <a href="#">Settings</a> delete any related data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}
                        variant="destructive">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
