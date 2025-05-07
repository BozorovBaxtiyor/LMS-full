const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });
const envFile   = {
    PORT: process.env.PORT || 8080,
    DB_URL: process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    CLIENT_URL: process.env.CLIENT_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    };
    
module.exports = {envFile}