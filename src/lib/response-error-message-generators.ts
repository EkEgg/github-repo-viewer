import { ResponseInterface } from "./http-utils";
import { getReasonPhrase } from "http-status-codes";
import { Octokit } from "@octokit/core";

type ErrorMessage = {
    heading: string,
    description: string
};

type ResponseErrorMessageGenerator<ResponseType extends ResponseInterface> = {
    generateFor: (response: ResponseType) => ErrorMessage
};

const defaultResponseErrorMessageGenerator: ResponseErrorMessageGenerator<ResponseInterface> = {
    generateFor: (response: ResponseInterface) => ({
        heading: `HTTP error ${response.status}`,
        description: getReasonPhrase(response.status)
    })
};

type OctokitResponseType = Awaited<ReturnType<Octokit["request"]>>;

const octokitResponseErrorMessageGenerator: ResponseErrorMessageGenerator<OctokitResponseType> = {
    generateFor: (response: OctokitResponseType) =>
    {
        const heading = `API response code ${response.status}`
        let description = getReasonPhrase(response.status);
        switch (response.status)
        {
            case 403:
            case 422:
                description += ". This may be because your API rate limit was exceeded."
                             + " Try again in a few minutes.";
                break;
            
            case 500:
                description += ". This service is unavailable."
                break;
        }
        return { heading, description };
    }
}

export type { ResponseErrorMessageGenerator }
export { defaultResponseErrorMessageGenerator, octokitResponseErrorMessageGenerator };