import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function JobNotFound() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
            <div className="rounded-xl border bg-card p-12 text-center">
                <h1 className="font-heading text-xl font-semibold">
                    Job not found
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    This job may have been removed or the link is incorrect.
                </p>
                <Button
                    nativeButton={false}
                    render={<Link href="/browse-jobs" />}
                    className="mt-6"
                >
                    Back to Browse Jobs
                </Button>
            </div>
        </div>
    );
}
