import { Button, Paper, Stack, Typography } from "@mui/material";
import { FC } from "react";

const InformationPanel: FC<{
        icon?: JSX.Element,
        heading: string,
        description?: string,
        actions?: { name: string, action: () => void }[]
    }> = ({icon, heading, description, actions }) =>
    {
        actions = !actions ? [] : actions;

        const actionButtons = actions.map(({name, action}) => (
            <Button variant="contained" onClick={action}>
                {name}
            </Button>
        ));

        return (

            <Paper sx={{ p: 2 }}>
                <Stack spacing={1} alignItems="center">
                    {icon !== undefined && icon}
                    <Typography variant="h5">{heading}</Typography>
                    {description !== undefined && <Typography variant="body1">{description}</Typography>}
                    {actionButtons}
                </Stack>
            </Paper>
        );
    };

export default InformationPanel;
