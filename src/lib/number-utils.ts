const toPercentage = (scale: number, decimalPlaces: number): string =>
    `${(scale * 100).toFixed(decimalPlaces)}%`;

export { toPercentage };
