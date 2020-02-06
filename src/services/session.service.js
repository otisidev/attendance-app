const { SessionModel } = require("../models/session.model");
const { Types } = require("mongoose");

// local props
const Model = SessionModel;
const { isValid } = Types.ObjectId;

exports.SessionService = class SessionService {
	/**
	 * Creates a session object
	 * @param {any} model object containing session's name(title) and semester
	 */
	async NewSession(model) {
		if (model) {
			// Stop existing
			await StopAll();
			const cb = await new Model(model).save();
			if (cb)
				return {
					status: 200,
					message: `${model.title} - ${model.semester} created successfully!`,
					doc: cb
				};
		}
		throw new Error("Invalid Session Object!");
	}

	async GetSession(id) {
		if (isValid(id)) {
			const q = { removed: false, _id: id };
			const cb = await Model.findOne(q).exec();
			if (cb)
				return {
					status: 200,
					message: "Record found!",
					doc: cb
				};
		}
		throw new Error("Session not found!");
	}

	async GetSessions() {
		const q = { removed: false };
		const cb = await Model.find(q)
			.sort({ title: -1, semester: 1 })
			.exec();

		return {
			status: 200,
			message: "Completed",
			docs: cb
		};
	}

	async GetActiveSession() {
		const q = { removed: false, active: true };
		const cb = await Model.findOne(q).exec();
		if (cb)
			return {
				status: 200,
				message: "Record found!",
				doc: cb
			};
		throw new Error("No active session!");
	}

	async SetActiveSession(id) {
		if (isValid(id)) {
			// update existing active session
			await StopAll();

			// query
			const q = { removed: false, active: false, _id: id };
			// update statement
			const u = { $set: { active: true } };
			// statement excution
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Active session updated successfully!",
					doc: cb
				};
		}
		throw new Error("Session not found!");
	}
	async UpdateSession(id, model) {
		if (isValid(id) && model) {
			const { title, semester } = model;
			// query
			const q = { removed: false, _id: id };
			// update statement
			const u = { $set: { title, semester } };
			// statement excution
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Session updated successfully!",
					doc: cb
				};
		}
		throw new Error("Session not found!");
	}

	async GetMany(ids) {
		const m = ids.sort();
		// query
		const q = { _id: { $in: m } };
		// execute query
		const cb = await Model.find(q)
			.sort({ _id: 1 })
			.exec();
		return cb;
	}
};

const StopAll = async () => {
	const q = { removed: false, active: true };
	const update = {
		$set: {
			active: false
		}
	};
	const cb = await Model.updateMany(q, update).exec();
	if (cb) return true;
	return false;
};
