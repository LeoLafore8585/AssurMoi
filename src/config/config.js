require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'leo',
        password: process.env.DB_PASSWORD || 'leo123',
        database: process.env.DB_NAME || 'api_annonces',
        host: process.env.DB_HOST || 'db',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: false
    },
    test: {
        username: process.env.DB_USER || 'leo',
        password: process.env.DB_PASSWORD || 'leo123',
        database: process.env.DB_NAME || 'api_annonces',
        host: process.env.DB_HOST || 'db',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: false
    },
    production: {
        username: process.env.DB_USER || 'leo',
        password: process.env.DB_PASSWORD || 'leo123',
        database: process.env.DB_NAME || 'api_annonces',
        host: process.env.DB_HOST || 'db',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: false
    }
};