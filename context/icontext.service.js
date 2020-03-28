const { connect } = require("mongoose");
const { option } = require("./db.config.json");
const dotenv = require("dotenv");

dotenv.config(); // Read environmental variable

// Read DataName and connection string from env variable
const { DB_NAME, DB_PATH } = process.env;

exports.connect = async () => {
    // connect to mongodb
    const status = await connect(DB_PATH, {
        ...option,
        dbName: DB_NAME
    });
    if (status) {
        console.log("DATABASES CONNECTED!");
        return true;
    }
    console.log("DATABASE CONNECTION FAILED!");
    return false;
};
