import { FC, useEffect, useState } from "react";
import RequestWaitingPanel from "./WaitingPanel";
import ErrorPanel from "./ErrorPanel";
import { ResponseInterface } from "../lib/http-utils";
import { defaultResponseErrorMessageGenerator, ResponseErrorMessageGenerator } from "../lib/response-error-message-generators";

const RequestDependentPanelWrapper = <
        ResponseType extends ResponseInterface,
        WrappedPropsType
    >(props: {
        makeRequest: () => Promise<ResponseType>,
        makeWrapped: (response: ResponseType) => JSX.Element,
        errorMessageGenerator?: ResponseErrorMessageGenerator<ResponseType>,
        wrappedProps: WrappedPropsType
    }) =>
    {
        if (props.errorMessageGenerator === undefined)
        {
            props.errorMessageGenerator = defaultResponseErrorMessageGenerator;
        }

        const [ response, setResponse ] = useState<ResponseType | null>(null);
        const updateResponse = (response: ResponseType | null) => setResponse(() => response);

        const tryRequest = () =>
        {
            updateResponse(null);
            props.makeRequest().then(updateResponse).catch(updateResponse);
        }

        let triedRequest = false;
        useEffect(() =>
            {
                if (triedRequest) return;
                tryRequest();
                triedRequest = true;
            },
            [props.wrappedProps]);
        
        if (response == null)
        {
            return <RequestWaitingPanel/>
        }
        if (response.status < 200 || response.status > 299)
        {
            const { heading, description } = props.errorMessageGenerator.generateFor(response);
            return <ErrorPanel
                heading={heading}
                description={description}
                actions={[{ name: "Retry", action: tryRequest }]}
            />
        }
        return props.makeWrapped(response);
    }

    const makeRequestDependentPanelWrapper = <
            ResponseType extends ResponseInterface,
            WrappedPropsType
        >(parameters: {
            makeRequest: (props: WrappedPropsType) => Promise<ResponseType>,
            makeWrapped: (response: ResponseType, props: WrappedPropsType) => JSX.Element,
            errorMessageGenerator: ResponseErrorMessageGenerator<ResponseType>
        }): FC<WrappedPropsType> =>
            (props: WrappedPropsType) => (
                    <RequestDependentPanelWrapper
                        makeRequest={() => parameters.makeRequest(props)}
                        makeWrapped={(response) => parameters.makeWrapped(response, props)}
                        wrappedProps={props}
                        errorMessageGenerator={parameters.errorMessageGenerator}
                    />
                );

export default RequestDependentPanelWrapper;
export { makeRequestDependentPanelWrapper };
