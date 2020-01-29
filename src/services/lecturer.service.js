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
			await Model.populate(cb, {
				model: "DepartmentalCourse",
				path: "assignedCourses"
			});
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
			const cb = await Model.findOne(q)
				.populate("assignedCourses")
				.exec();
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
			.populate("assignedCourses")
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
		throw new Error("Student not found!");
	}

	async UpdateFingerprint(id, finger) {
		if (isValid(id) && print) {
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
		throw new Error("Student not found!");
	}

	async UpdateAssignedCourse(id, deptCourse) {
		if (isValid(id) && isValid(deptCourse)) {
			const q = { removed: false, _id: id };
			const u = { $addToSet: { assignedCourses: deptCourse } };
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

	async UpdateLecturer(id, name, phone) {
		if (isValid(id) && name && phone) {
			// query state
			const q = { removed: false, _id: id };
			// query execution
			const u = { $set: { name, phone } };
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
};