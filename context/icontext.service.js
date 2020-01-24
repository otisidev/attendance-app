const { connect } = require("mongoose");
const { option } = require("./db.config.json");
const dotenv = require("dotenv");

dotenv.config(); // Read environmental varaiable

// Read dataname and connection string from env varaiable
const { DB_NAME, DB_PATH } = process.env;

exports.connect = async () => {
	// connect to mongodb
	const status = await connect(DB_PATH, {
		...option,
		dbName: DB_NAME
	});
	if (status) {
		console.log("DATABASED CONNECTED!");
		return true;
	}
	console.log("DATABASE CONNECTION FAILED!");
	return false;
};
