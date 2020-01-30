/**
 * Reads file content
 * @param {any} stream file stream
 */
const fileRead = stream =>
	new Promise((resolve, reject) => {
		if (stream) {
			let data;
			stream.on("readable", () => {
				while ((data = stream.read())) console.log("File read!");
			});
			stream.on("end", () => resolve(data));
			stream.on("error", er => reject(er.message));
		} else {
			reject("File stream not found!");
		}
	});
exports.fileRead = fileRead;
