const bcrypt = require('bcrypt');

/**
 * Function to hash a password using bcrypt.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} - Returns a promise that resolves to the hashed password.
 */
const encryptPassword = async (password) => {
    const saltRounds = 10; // Number of rounds to generate the salt
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        throw new Error('Error hashing the password');
    }
};

/**
 * Function to compare a password with a hashed password.
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The hashed password to compare with.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if passwords match, false otherwise.
 */
const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (err) {
        throw new Error('Error comparing passwords');
    }
};

module.exports = { encryptPassword, comparePassword };
