const isWhiteSpaceOnly = (string: string): boolean =>
{
    return string.replace(/\s/g, "").length === 0;
}

export { isWhiteSpaceOnly };
