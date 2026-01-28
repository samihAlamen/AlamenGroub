/**
 * Validates if an email is in a valid format.
 * @param {string} email - The email to be validated.
 * @returns {boolean} - Returns true if valid, otherwise false.
 */
const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};

/**
 * Validates if a password is strong enough.
 * @param {string} password - The password to be validated.
 * @returns {boolean} - Returns true if strong enough, otherwise false.
 */
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

/**
 * Validates if a given string is a valid date.
 * @param {string} date - The date to be validated (YYYY-MM-DD).
 * @returns {boolean} - Returns true if valid, otherwise false.
 */
const validateDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
};

/**
 * Validates if a string is not empty and has at least a length of 3 characters.
 * @param {string} str - The string to be validated.
 * @returns {boolean} - Returns true if valid, otherwise false.
 */
const validateString = (str) => {
    return typeof str === 'string' && str.trim().length >= 3;
};

module.exports = { validateEmail, validatePassword, validateDate, validateString };
