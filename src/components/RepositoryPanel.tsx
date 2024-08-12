import { Octokit } from "@octokit/core";
import SummaryPanel from "./SummaryPanel";
import LanguagePanel from "./LanguagePanel";
import { makeRequestDependentPanelWrapper } from "./RequestDependentPanelWrapper";
import { FC } from "react";
import CommitHistoryPanel from "./CommitHistoryPanel";
import octokit from "../wrappers/octokit";
import { Grid, Stack } from "@mui/material";
import { add } from "date-fns";
import { midnightOf } from "../lib/date-utils";
import ErrorPanel from "./ErrorPanel";
import { octokitResponseErrorMessageGenerator } from "../lib/response-error-message-generators";

const COMMIT_HISTORY_SINCE_DAYS_BEFORE = 28;

type RepositoryPanelPropsType = { searchQuery: string };

const RepositoryPanel: FC<RepositoryPanelPropsType>
    = makeRequestDependentPanelWrapper<
        Awaited<ReturnType<Octokit["request"]>>,
        RepositoryPanelPropsType
    >({
        makeRequest: (props) => octokit.request("GET /search/repositories", {
            q: props.searchQuery,
            sort: "stars",
            per_page: 1
        }),
        
        errorMessageGenerator: octokitResponseErrorMessageGenerator,
        
        makeWrapped: (response) =>
        {
            if (response.data.items.length === 0)
            {
                return (
                    <ErrorPanel
                        heading="No one here..."
                        description="No repository matches these terms."
                    />
                );
            }

            const repository = response.data.items[0];

            const todayMidnight = midnightOf(new Date());
            const todayLastSecond = add(todayMidnight, {days: 1, seconds: -1});
            const sinceDate = add(todayMidnight, { days: -COMMIT_HISTORY_SINCE_DAYS_BEFORE });

            return (
                <Grid container>
                    <Grid item xs={4}>
                        <SummaryPanel
                            name={repository.name}
                            owner={repository.owner?.login}
                            forksCount={repository.forks_count}
                            starsCount={repository.stargazers_count}
                            watchersCount={repository.watchers_count}
                        />
                    </Grid>
                    <Grid item xs={8} paddingLeft={2}>
                        {
                            !repository.owner ?
                            (
                                <ErrorPanel
                                    heading="Unidentified owner"
                                    description="The repository's could not be retrieved."
                                />
                            ) :
                            (
                                <Stack spacing={2}>
                                    <LanguagePanel
                                        repositoryName={repository.name}
                                        repositoryOwner={repository.owner.login}
                                    />
                                    <CommitHistoryPanel
                                        repositoryName={repository.name}
                                        repositoryOwner={repository.owner.login}
                                        since={sinceDate}
                                        until={todayLastSecond}
                                    />
                                </Stack>
                            )
                        }
                    </Grid>
                </Grid>
            );
        }
    });

export default RepositoryPanel;
