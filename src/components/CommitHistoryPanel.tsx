import { Octokit } from "@octokit/core";
import { FC, useEffect, useState } from "react";
import InformationPanel from "./InformationPanel";
import CommitHistoryChart from "./CommitHistoryChart";
import octokit from "../wrappers/octokit";
import { CircularProgress, FormHelperText, Paper, Stack, Typography } from "@mui/material";
import { midnightOf } from "../lib/date-utils";
import { format } from "date-fns";
import { octokitResponseErrorMessageGenerator } from "../lib/response-error-message-generators";

const COMMITS_PER_PAGE_IN_RESPONSE = 100;

type CommitHistoryPanelPropsType = {
    repositoryOwner: string,
    repositoryName: string,
    since: Date,
    until: Date
};

const CommitHistoryPanel: FC<CommitHistoryPanelPropsType> = (props: CommitHistoryPanelPropsType) =>
{
    type ResponseType = Awaited<ReturnType<Octokit["request"]>>;

    const [ response, setResponse ] = useState<ResponseType | null>(null);
    const updateResponse = (response: ResponseType) => setResponse(() => response);

    const [ data, setData ] = useState<Map<number, number> | null>(null);
    const updateData = (data: Map<number, number> | null) => setData(() => data);

    const tryPaginate = () =>
    {
        const data = new Map<number, number>();

        const handleResponseOnSuccess = (response: ResponseType, nextPage: number) =>
        {
            for (const commit of response.data)
            {
                const committer = commit.commit.committer;
                if (!committer)
                {
                    continue;
                }
                const date = midnightOf(new Date(committer.date));
                const time = date.getTime();
                const count = data.get(time);
                if (!count)
                {
                    data.set(time, 1);
                }
                else
                {
                    data.set(time, count + 1);
                }
            }
            if (response.headers.link && response.headers.link.includes("rel=\"next\""))
            {
                makeRequest(nextPage);
            }
            else
            {
                updateData(data);
            }
        };

        const handleResponseOnError = (response: ResponseType) => updateResponse(response);

        const makeRequest = (page: number) =>
        {
            const responsePromise = octokit.request("GET /repos/{owner}/{repo}/commits", {
                owner: props.repositoryOwner,
                repo: props.repositoryName,
                per_page: COMMITS_PER_PAGE_IN_RESPONSE,
                page: page,
                since: props.since.toISOString(),
                until: props.until.toISOString()
            });
            responsePromise.then((response) => handleResponseOnSuccess(response, page + 1))
                            .catch(handleResponseOnError);
            return responsePromise;
        };
        
        makeRequest(1);
    };

    let triedPaginate = false;
    useEffect(() =>
        {
            if (triedPaginate) return;
            tryPaginate();
            triedPaginate = true;
        },
        [props]);
    
    if (data == null)
    {
        if (response == null)
        {
            return <InformationPanel icon={<CircularProgress/>} heading="Waiting..."/>
        }

        const { heading, description } = octokitResponseErrorMessageGenerator.generateFor(response);
        return (
            <InformationPanel
                heading={heading}
                description={description}
                actions={[{name: "Retry", action: tryPaginate}]}
            />
        );
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Stack spacing={{ p: 1 }}>
                <Typography variant="h5">Commit history</Typography>
                <FormHelperText component="span">
                    Number of commits made on each of day
                    from {format(props.since, "yyyy/MM/dd")} to {format(props.until, "yyyy/MM/dd")}.
                </FormHelperText>
                <CommitHistoryChart data={data} range={{ begin: props.since, end: props.until }}/>
            </Stack>
        </Paper>
    )
};

export default CommitHistoryPanel;
