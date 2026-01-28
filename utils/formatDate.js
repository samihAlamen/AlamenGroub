/**
 * Function to format a date to a readable format.
 * @param {Date|string} date - The date to be formatted. Can be a Date object or a string.
 * @param {string} format - The format to output (default: 'YYYY-MM-DD').
 * @returns {string} - Returns the formatted date string.
 */
const formatDate = (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
        throw new Error('Invalid date');
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    switch (format) {
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'DD-MM-YYYY':
            return `${day}-${month}-${year}`;
        case 'YYYY-MM-DD HH:mm:ss':
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        case 'MM-DD-YYYY HH:mm':
            return `${month}-${day}-${year} ${hours}:${minutes}`;
        default:
            return `${year}-${month}-${day}`;
    }
};

module.exports = formatDate;
