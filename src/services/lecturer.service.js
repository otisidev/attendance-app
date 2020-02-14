const { LecturerModel } = require("../models/lecturer.model");
const { Types } = require("mongoose");

// local props
const Model = LecturerModel;
const { isValid } = Types.ObjectId;

exports.LecturerService = class LecturerService {
	//
	async NewLecturer(model, author) {
		if (model && isValid(author)) {
			const cb = await new Model({
				...model,
				author
			}).save();

			if (cb)
				return {
					status: 200,
					message: "Lecturer account created successfully!",
					doc: cb
				};
		}
		throw new Error("Invalid lecturer object!");
	}

	async GetLecturer(id) {
		if (isValid(id)) {
			const q = {
				removed: false,
				_id: id
			};
			const cb = await Model.findOne(q).exec();
			if (cb)
				return {
					status: 200,
					message: "Lecturer record found!",
					doc: cb
				};
		}
		throw new Error("Lecturer not found!");
	}

	/**
	 * Geta single lecturer by email/phone/reg no
	 * @param {string} no lecturer reg no/email/phone
	 */
	async GetLecturerByNo(no) {
		if (no) {
			const q = {
				removed: false,
				$or: [{ email: no }, { phone: no }, { regNo: no }]
			};
			const cb = await Model.findOne(q).exec();
			if (cb)
				return {
					status: 200,
					message: "Lecturer record found!",
					doc: cb
				};
		}
		throw new Error("Lecturer not found!");
	}

	async GetLecturers() {
		const q = { removed: false };
		const cb = await Model.find(q)
			.sort({ name: 1 })
			.exec();
		return {
			docs: cb,
			status: 200,
			message: "Completed"
		};
	}

	async RemoveLecturer(id) {
		if (isValid(id)) {
			// query
			const q = { removed: false, _id: id };
			// Update statement
			const u = { $set: { removed: true } };
			const cb = await Model.findOneAndUpdate(q, u).exec();
			if (cb)
				return {
					status: 200,
					message: "Recored deleted successfully!",
					doc: { id, status: "Deleted!" }
				};
		}
		throw new Error("Lecturer not found!");
	}

	async UpdateFingerprint(id, finger) {
		if (isValid(id) && finger) {
			// query
			const q = { removed: false, _id: id };
			// Update statement
			const u = { $set: { fingerPrint: finger } };
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Updated lecturer's biometric data successfully!",
					doc: cb
				};
		}
		throw new Error("Lecturer not found!");
	}

	async UpdateAssignedCourse(id, deptCourses) {
		if (isValid(id) && deptCourses.every(x => isValid(x))) {
			const q = { removed: false, _id: id };
			const u = { $addToSet: { assignedCourses: deptCourses } };
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Lecturer course updated!",
					doc: cb
				};
		}
		throw new Error("Lecturer not found!");
	}

	async UpdateLecturer(id, name, phone, reg) {
		if (isValid(id) && name && phone) {
			// query state
			const q = { removed: false, _id: id };
			// query execution
			const u = { $set: { name, phone, regNo: reg } };
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Record updated successfully!",
					doc: cb
				};
		}
		throw new Error("Lecturer not found!");
	}

	/**
	 * Updates many Lecturer biometric data
	 * @param {Array<any>} lecturer list of lecturer object
	 */
	async UpdateManyFinger(lecturer) {
		if (lecturer.every(s => isValid(s.id))) {
			//
			lecturer.forEach(async item => {
				await Model.findByIdAndUpdate(
					{
						removed: false,
						_id: item.id
					},
					{ $set: { fingerprint: item.fingerprint } }
				).exec();
			});
		}
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
