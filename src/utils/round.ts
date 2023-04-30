/**
 * Decimal adjustment of a number.
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Number} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
function decimalAdjust(type: string, value: number, exp: number): number {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        // @ts-ignore
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // If the value is negative...
    if (value < 0) {
        return -decimalAdjust(type, -value, exp);
    }
    // Shift
    let value_str = value.toString().split('e');
    // @ts-ignore
    value = Math[type](+(value_str[0] + 'e' + (value_str[1] ? (+value_str[1] - exp) : -exp)));
    // Shift back
    value_str = value.toString().split('e');
    return +(value_str[0] + 'e' + (value_str[1] ? (+value_str[1] + exp) : exp));
}

// Decimal round
export function round(value: number, exp: number) {
    return decimalAdjust('round', value, exp);
}

// Decimal floor
export function floor(value: number, exp: number) {
    return decimalAdjust('floor', value, exp);
}

// Decimal ceil
export function ceil(value: number, exp: number) {
    return decimalAdjust('ceil', value, exp);
}
