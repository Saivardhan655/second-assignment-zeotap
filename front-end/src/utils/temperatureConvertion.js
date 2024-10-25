// temperatureUtils.js

/**
 * Converts Celsius to Kelvin
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} - Temperature in Kelvin
 */
export const celsiusToKelvin = (celsius) => {
    return celsius + 273.15;
};

/**
 * Converts Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} - Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
};
