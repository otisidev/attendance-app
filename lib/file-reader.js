/**
 * Reads file content
 * @param {any} stream file stream
 */
const fileRead = stream =>
	new Promise((resolve, reject) => {
		if (stream) {
			let data;
			stream.on("data", chunk => {
				// while ((data = stream.read())) console.log("File read!", data);
				data = chunk;
				console.log(chunk);
			});
			stream.on("end", () => resolve(data.toString()));
			stream.on("error", er => reject(er.message));
		} else {
			reject("File stream not found!");
		}
	});
exports.fileRead = fileRead;
