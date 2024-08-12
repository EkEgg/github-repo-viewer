import { FC, useState } from "react"
import SearchPanel from "./SearchPanel";
import RepositoryPanel from "./RepositoryPanel";
import { Box, Stack } from "@mui/material";

const Dashboard: FC = () =>
{
    const [ searchPanelQuery, setSearchPanelQuery ] = useState("");
    const [ actualSearchQuery, setActualSearchQuery ] = useState("stars:>0")

    const updateSearchQuery = (query: string) =>
    {
        setSearchPanelQuery(() => query);
        setActualSearchQuery(() => query);
    };
    
    return (
        <Box sx={{ p: 4 }}>
            <Stack spacing={2}>
                <SearchPanel initialQuery={searchPanelQuery} onEnter={updateSearchQuery}/>
                <RepositoryPanel searchQuery={actualSearchQuery}/>
            </Stack>
        </Box>
    );
};

export default Dashboard;