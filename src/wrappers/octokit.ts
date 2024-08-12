import { Octokit } from "@octokit/core";

const octokit = new Octokit();

/*

// To make requests using a GitHub access token:

const octokit = new Octokit({
    auth: YOUR_TOKEN
});

// You can generate a new access token here:
// https://github.com/settings/tokens/new

*/

export default octokit;