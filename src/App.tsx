import './App.css';
import Dashboard from './components/Dashboard';
import { FC } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: "dark",
        text: {
            primary: "#e4e4e4",
            secondary: "#b9b9b9",
            disabled: "#333333"
        }
    }
});

const App: FC = () =>
{
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Dashboard/>
        </ThemeProvider>
    )
}

export default App;
