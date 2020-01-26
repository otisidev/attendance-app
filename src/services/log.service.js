const { AuditModel } = require("../models/audit.model");
const { Types } = require("mongoose");

// local props
const Model = AuditModel;
const { isValid } = Types.ObjectId;

exports.LogService = class LogService {
	//
	async NewLog(model) {
		if (model && isValid(model.user)) {
			const cb = new Model(model).save();
			if (cb)
				return {
					status: 200,
					message: "Logged successfully"
				};
		}
		return false;
	}

	/**
	 * Gets list of audit log
	 * @param {number} page page number
	 * @param {number} limit maximum record per request
	 * @param {string} user user id
	 */
	async GetLogs(page = 1, limit = 25, user = null) {
		let q = {};
		if (user && isValid(user)) q.user = user;
		const opt = { page, limit, sort: { created_at: -1 } };
		const cb = await Model.paginate(q, opt);

		return {
			status: 200,
			message: "Completed",
			...cb
		};
	}
};
