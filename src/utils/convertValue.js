export const convertValue = value => {
    var suffixes = ["", "k", "MM", "b", "t"];
    var suffixNum = Math.floor(("" + parseInt(value)).length / 4);
    var shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value));
    if (shortValue % 1 !== 0) {
        shortValue = shortValue.toFixed(1);
    }
    return shortValue + suffixes[suffixNum];
}