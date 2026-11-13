import { getJobs } from '@/lib/actions/jobs';
import React from 'react';

const BrowseJobsPage = async ({searchParams}: {searchParams: Promise<{ [key:string]:
    string | string[] | undefined}>}) => {

        const search = await searchParams;

        const urlSearch = new URLSearchParams(search as Record<string, string>);

        const query = urlSearch.toString();

        console.log('Search params', query);

        const jobs = await getJobs(query);

    return (
        <div>
            <h1>Browse Jobs</h1>
        </div>
    );
};

export default BrowseJobsPage;