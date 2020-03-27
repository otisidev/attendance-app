const { createReadStream } = require("fs");

/**
 * Reads file content
 * @param {string} file file name
 */
const fileRead = filename =>
    new Promise((resolve, reject) => {
        if (filename) {
            const stream = createReadStream(filename, "utf8");
            let data;
            stream.on("data", chunk => {
                data += chunk;
            });
            stream.on("end", () => resolve(data));
            stream.on("error", er => reject(er.message));
        } else {
            reject("File stream not found!");
        }
    });
exports.fileRead = fileRead;
