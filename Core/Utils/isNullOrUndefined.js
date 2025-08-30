/*
 * This file is part of DiscordBot-Template-V14 project by Arava.
 * You are authorized to use, modify, and distribute this project under the terms of the MIT License.
 * For more information, please consult: https://github.com/Arava-0/DiscordBot-Template-V14.
 * Year: 2025
 *
 * Please never remove this comment block.
 */

/**
 * Checks if a given value is either `null` or `undefined`.
 *
 * This function is useful in cases where you want to perform a single check
 * to determine if a variable is either `null` or `undefined`, as these two values
 * often signify the absence of a meaningful value.
 *
 * ### Example Usage:
 * ```javascript
 * const { isNullOrUndefined } = require('./isNullOrUndefined');
 *
 * console.log(isNullOrUndefined(null));        // true
 * console.log(isNullOrUndefined(undefined));   // true
 * console.log(isNullOrUndefined(0));           // false
 * console.log(isNullOrUndefined(''));          // false
 * console.log(isNullOrUndefined(false));       // false
 * ```
 *
 * ### Parameters:
 * @param {*} value - The value to check. Can be of any type.
 *
 * ### Returns:
 * @returns {boolean} - Returns `true` if the value is `null` or `undefined`,
 * otherwise returns `false`.
 *
 * ### Notes:
 * - This function uses `value == null`, which leverages JavaScript's loose equality
 * to check for both `null` and `undefined` in a single expression.
 *
 * ### Compatibility:
 * - Works with all JavaScript environments, including Node.js and browsers.
 *
 * @function
 */
function isNullOrUndefined(value) {
    return (value == null);
}

module.exports = {
    isNullOrUndefined
};
