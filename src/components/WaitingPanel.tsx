import { CircularProgress } from "@mui/material";
import InformationPanel from "./InformationPanel";

const WaitingPanel = () => (
    <InformationPanel
        icon={<CircularProgress/>}
        heading="Waiting..."
        description="Waiting for the request to be responded."
    />
);

export default WaitingPanel;
