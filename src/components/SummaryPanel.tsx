import { ArrowOutward as ArrowOutwardIcon } from "@mui/icons-material";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Card, CardContent, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { FC } from "react";

type MaterialUIIconType = typeof StarIcon;

const SummaryPanel: FC<{
        name: string,
        owner: string | undefined,
        forksCount: number,
        starsCount: number,
        watchersCount: number
    }>
    = ({ name, owner, forksCount, starsCount, watchersCount }) =>
    {
        let nameSection: JSX.Element;

        if (owner !== undefined)
        {
            const openGitHubWindow = () =>
            {
                window.open(`https://github.com/${owner}/${name}/`)
            };

            nameSection = (
                <Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h4">{name}</Typography>
                        <Tooltip title="Open in GitHub" placement="right">
                            <IconButton color="primary" onClick={openGitHubWindow}>
                                <ArrowOutwardIcon fontSize="medium"/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Typography
                        variant="subtitle2"
                        color={(theme) => theme.palette.text.secondary}
                    >
                        by {owner}
                    </Typography>
                </Stack>
            );
        }
        else
        {
            nameSection = <Typography variant="h4">{name}</Typography>;
        }

        const makeCard = (Icon: MaterialUIIconType, count: number, unit: { singular: string, plural: string }) =>
        {
            const writtenUnits = count <= 1 ? unit.singular : unit.plural;
            return (
                <Card variant={"elevation"}>
                    <CardContent>
                        <Stack alignItems={"center"} spacing={1}>
                            <Icon fontSize="large"/>
                            <Typography variant="h6" align="center">{count} {writtenUnits}</Typography>
                        </Stack>
                    </CardContent>
                </Card>
            );
        };

        return (
            <Paper sx={{ p: 2 }}>
                <Stack spacing={2}>
                    {nameSection}
                    {makeCard(StarIcon, starsCount, { singular: "star", plural: "stars" })}
                    {makeCard(ForkRightIcon, forksCount, { singular: "fork", plural: "forks" })}
                    {makeCard(VisibilityIcon, watchersCount, { singular: "watcher", plural: "watchers" })}
                </Stack>
            </Paper>
        );
    };

export default SummaryPanel;
