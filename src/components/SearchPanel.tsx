import { FC, useState } from "react";
import { isWhiteSpaceOnly } from "../lib/string-utils";
import { FormHelperText, InputAdornment, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const GITHUB_SEARCH_QUERY_GUIDE_LINK = "https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories";

const SearchPanel: FC<{ initialQuery: string, onEnter: (query: string) => void }>
    = ({ initialQuery, onEnter }) =>
    {
        const [ query, setQuery ] = useState(initialQuery);
        const updateQuery = (query: string) => setQuery(() => query);
        const actualOnEnter = (query: string) => { if (!isWhiteSpaceOnly(query)) onEnter(query) };

        return (
            <Paper sx={{ p: 2 }}>
                <Stack spacing={1}>
                    <Typography variant="h5">Search repository</Typography>
                    <TextField
                        variant="outlined"
                        type="search"
                        helperText={(
                            <FormHelperText component="span">
                                Enter search terms. The repository with most stars which matches
                                these terms will be shown. Search is done just like GitHub search.
                                Read <Link href={GITHUB_SEARCH_QUERY_GUIDE_LINK}>this</Link> for
                                more information.
                            </FormHelperText>
                        )}
                        fullWidth
                        value={query}
                        onChange={(event) => updateQuery(event.target.value)}
                        onKeyDown={(event) => { if (event.key === "Enter") actualOnEnter(query); } }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="large"/>
                                </InputAdornment>
                            )
                        }}
                    />
                </Stack>
            </Paper>
        );
    };

export default SearchPanel;
