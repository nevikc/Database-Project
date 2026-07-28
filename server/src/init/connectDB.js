const oracledb = require("oracledb");
require("dotenv").config();

async function connectDB() {
    try {
        const connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION
        });

        console.log("Oracle Database Connected");

        return connection;

    } catch (error) {
        console.log(error);
    }
}

module.exports = {connectDB};