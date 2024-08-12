import { Octokit } from "@octokit/core";
import { FC } from "react";
import { makeRequestDependentPanelWrapper } from "./RequestDependentPanelWrapper";
import LanguageChart from "./LanguageChart";
import octokit from "../wrappers/octokit";
import { Paper, Stack, Typography } from "@mui/material";
import { octokitResponseErrorMessageGenerator } from "../lib/response-error-message-generators";
import ErrorPanel from "./ErrorPanel";

type LanguagePanelPropsType = {
    repositoryOwner: string,
    repositoryName: string
};

const LanguagePanel: FC<LanguagePanelPropsType>
    = makeRequestDependentPanelWrapper<
        Awaited<ReturnType<Octokit["request"]>>,
        LanguagePanelPropsType
    >({
        makeRequest: (props) => octokit.request(
            "GET /repos/{owner}/{repo}/languages", {
            owner: props.repositoryOwner,
            repo: props.repositoryName
        }),

        errorMessageGenerator: octokitResponseErrorMessageGenerator,

        makeWrapped: (response) =>
        {
            let totalCount = 0;
            for (const language in response.data)
            {
                totalCount += response.data[language];
            }
            
            const percentageData: {[key: string]: number} = {};
            for (const language in response.data)
            {
                percentageData[language] = response.data[language] / totalCount;
            }

            if (totalCount === 0)
            {
                return (
                    <ErrorPanel
                        heading="No languages"
                        description="This repository does not contain any languages."
                    />
                );
            }

            return (
                <Paper sx={{ p: 2 }}>
                    <Stack spacing={1}>
                        <Typography variant="h5">Languages</Typography>
                        <LanguageChart data={percentageData}/>
                    </Stack>
                </Paper>
            );
        }
    });

export default LanguagePanel;
