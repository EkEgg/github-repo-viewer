import { FC } from "react";
import InformationPanel from "./InformationPanel";
import { Error as ErrorIcon } from "@mui/icons-material";

const ErrorPanel: FC<{
        heading: string,
        description?: string,
        actions?: { name: string, action: () => void }[]
    }> = ({heading, description, actions }) => (
        <InformationPanel
            icon={<ErrorIcon/>}
            heading={heading}
            description={description}
            actions={actions}
        />
    );

export default ErrorPanel;
