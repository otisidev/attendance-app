const { createReadStream } = require("fs");

/**
 * Reads file content
 * @param {any} file file name
 */
const fileRead = file =>
    new Promise((resolve, reject) => {
        if (file) {
            const stream = Buffer.from(file.content);
            let data = stream.toString();
            resolve(data);
        } else {
            reject("File stream not found!");
        }
    });
exports.fileRead = fileRead;
