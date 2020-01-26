const { DepartmentModel } = require("../models/department.model");
const { Types } = require("mongoose");

// local props
const Model = DepartmentModel;
const { isValid } = Types.ObjectId;

exports.DepartmentService = class DepartmentService {
	/**
	 * Creates a new department object
	 * @param {string} name new department name
	 */
	async NewDepartment(name) {
		if (name) {
			const cb = await new Model({ name }).save();
			if (cb)
				return {
					status: 200,
					message: `${name} department created successfully!`,
					doc: cb
				};
		}
		throw new Error("Department name is required!");
	}

	/**
	 * Gets a single department object
	 * @param {string} id department object id
	 */
	async GetDepartment(id) {
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
		throw new Error("Department not found!");
	}

	// get list of departments
	async GetDepartments() {
		const q = { removed: false };
		const cb = await Model.find(q)
			.sort({ name: 1 })
			.exec();

		return {
			status: 200,
			message: "Completed",
			docs: cb
		};
	}
	// update department
	/**
	 * Update a single department's name
	 * @param {string} id department id
	 * @param {string} name new department name
	 */
	async UpdateDepartment(id, name) {
		if (isValid(id) && name) {
			const q = { removed: false, _id: id };
			const update = { $set: { name } };
			const cb = await Model.findOneAndUpdate(q, update, {
				new: true
			}).exec();
			if (cb)
				return {
					status: 200,
					message: "Department updated successfully!",
					doc: cb
				};
		}
		throw new Error("Department not found!");
	}
	// delete department
	async RemoveDepartment(id) {
		if (isValid(id)) {
			const q = { removed: false, _id: id };
			const update = { $set: { removed: true } };
			const cb = await Model.findOneAndUpdate(q, update).exec();
			if (cb)
				return {
					status: 200,
					message: "Department deleted successfully!",
					doc: { id, status: "Deleted!" }
				};
		}
		throw new Error("Department not found!");
	}
};
