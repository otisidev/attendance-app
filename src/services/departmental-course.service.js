const {
	DepartmentalCourseModel
} = require("../models/departmental-course.model");
const { Types } = require("mongoose");

// local props
const Model = DepartmentalCourseModel;
const { isValid } = Types.ObjectId;

exports.DepartmentalCourseService = class DepartmentalCourseService {
	/**
	 * Creates a new departmental course object.
	 * @param {any} model object containing a new departmental course values
	 */
	async Create(model) {
		// input validation
		if (model && isValid(model.department)) {
			// save
			const cb = await new Model(model).save();

			if (cb)
				return {
					status: 200,
					message: "Record saved successfully!",
					doc: cb
				};
			throw new Error("Invalid departmental course object!");
		}
	}

	/**
	 * Updates a single departmental course
	 * @param {string} id departmental course id
	 * @param {any} model object containing new departmenal course props and values
	 */
	async UpdateModel(id, model) {
		if (isValid(id) && model && isValid(model.department)) {
			// query statement
			const q = { removed: false, _id: id };
			// update statement
			const u = {
				$set: {
					title: model.title,
					code: model.code,
					level: model.level,
					creditUnit: model.creditUnit,
					department: model.department
				}
			};
			// query execution
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Departmental course updated successfully!",
					doc: cb
				};
			throw new Error("Departmental course not found!");
		}
	}

	/**
	 * Updates departmental course
	 * @param {string} id Departmental course id
	 */
	async RemoveModel(id) {
		if (isValid(id)) {
			const q = { removed: false, _id: id };
			const update = { $set: { removed: true } };
			const cb = await Model.findOneAndUpdate(q, update).exec();
			if (cb)
				return {
					status: 200,
					message: "Departmental course removed successfully!",
					doc: { id, status: "Deleted" }
				};
		}
		throw new Error("Failed! Departmental course not found.");
	}

	/**
	 * Assign lecturer to departmental course
	 * @param {Array<string>} ids departmental course id
	 * @param {string} lecturer Lecturer's id
	 */
	async AssignToLecturer(ids, lecturer) {
		if (ids.every(c => isValid(c)) && isValid(lecturer)) {
			// query statement
			const q = { removed: false, _id: { $in: ids } };
			// update statement
			const u = {
				$addToSet: { lecturers: lecturer }
			};
			const cb = await Model.updateMany(q, u).exec();
			if (cb)
				return {
					status: 200,
					message: "Assigned lecturer successfully!"
				};
		}
		throw new Error("Failed! Departmental course not found.");
	}

	/**
	 * Remove a single lecture from departmental course
	 * @param {string} id departmental course id
	 * @param {string} lecturer lecturer's id
	 */
	async RemoveLecturerFromCourse(id, lecturer) {
		if (isValid(id) && isValid(lecturer)) {
			// query statement
			const q = { removed: false, _id: id };
			// update statement
			const u = {
				$addToSet: { lecturers: lecturer }
			};
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Assigned lecturer successfully!",
					doc: cb
				};
		}
		throw new Error("Failed! Departmental course not found.");
	}

	/**
	 *Gets a list of departmental course
	 * @param {string} department department id
	 * @param {number} level student level
	 */
	async GetDepartmentalCourses(department, level = null) {
		if (isValid(department)) {
			// query statement
			let q = { removed: false, department };
			// check if request is for a particular level
			if (level) q.level = level;
			// query execution
			const cb = await Model.find(q)
				.sort({ level: 1, semester: 1 }) //  sort the record by level in ascending other and by semester by the same order
				.exec();

			return {
				status: 200,
				message: "Completed!",
				docs: cb
			};
		}

		throw new Error(
			"Course not found! Execute GetDepartment to get list of department"
		);
	}

	async GetDepartmentalCourse(id) {
		// validation
		if (isValid(id)) {
			// query statement
			const q = { removed: false, _id: id };
			const cb = await Model.findOne(q).exec();

			return {
				status: 200,
				message: "Found!",
				doc: cb
			};
		}
		throw new Error("Departmental course not found!");
	}

	/**
	 * Gets a list of departmental course list for student
	 * @param {string} dept department id
	 */
	async GetStudentAssignableCourses(dept) {
		// validation
		if (isValid(dept)) {
			// query statement
			const q = [
				{
					$match: {
						removed: false,
						department: Types.ObjectId(dept)
					}
				},
				{
					$group: {
						_id: {
							level: "$level",
							semester: "$semester"
						},
						courses: {
							$push: {
								id: "$_id",
								title: "$title",
								code: "$code",
								credit_unit: "$creditUnit"
							}
						},
						count: { $sum: 1 }
					}
				},
				{
					$group: {
						_id: "$_id.level",
						data: {
							$push: {
								semester: "$_id.semester",
								courses: "$courses",
								total: "$count"
							}
						}
					}
				},
				{
					$project: {
						_id: 0,
						level: "$_id",
						data: 1
					}
				},
				{
					$sort: { level: 1 }
				}
			];
			// query execution
			const result = await Model.aggregate(q).exec();
			// result
			return {
				status: 200,
				message: "Completed!",
				docs: result
			};
		}
		throw new Error("Departmental course not found!");
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
