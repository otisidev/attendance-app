const { services, helpers } = require("./services/root.service");
const { verify } = require("jsonwebtoken");
const { parse } = require("lambda-multipart-parser");
const { connect } = require("../context/icontext.service");

exports.handler = async event => {
    try {
        // get token and validate it
        const token = helpers.GetToken(event);
        // connect to database
        const state = await connect();
        // verify user
        const user = verify(token, process.env.DB_KEY);
        if (user && state) {
            // parse  incoming request
            const data = await parse(event);
            // validation
            if ("files" in data && data.files.length > 0) {
                // get files out
                const { files } = data;
                // read file content
                const attendance_content = await helpers.fileRead(files[0].filename);
                if (attendance_content) {
                    // parse attendance content
                    const attendance_json = JSON.parse(attendance_content);
                    // attendance validation
                    if (await services._aService.IsFileValid(attendance_json)) {
                        // Get active session
                        const active_session = await services._sService.GetActiveSession();
                        // upload attendance
                        const result = await _aService.NewAttendance(user.id, attendance_json, active_session.doc.id);
                        return helpers.response(result.status, result);
                    }
                    return helpers.response(404, { status: 404, message: "Attendance file contains an invalid props!" });
                }
            }
            return helpers.response(404, { status: 404, message: "File content not found!" });
        }
        return helpers.response(500, { status: 500, message: "Connection not established! Please try again later." });
    } catch (error) {
        return helpers.response(500, { status: 500, message: error.message });
    }
};
