const { ExemptionModel } = require("../models/exemption.model");
const { Types } = require("mongoose");

// local props
const Model = ExemptionModel;
const { isValid } = Types.ObjectId;

exports.ExemptionService = class ExemptionService {
	//
	async NewExemption(model) {
		if (model && isValid(model.attendance) && isValid(model.student)) {
			const cb = new Model(model).save();
			if (cb)
				return {
					status: 200,
					message: "Exemption created successfully!",
					doc: cb
				};
		}
		return false;
	}

	/**
	 * Gets list of audit Exemption
	 * @param {string} user user id
	 */
	async GetStudentExemptions(student) {
		// validation
		if (isValid(student)) {
			let q = { removed: false, student };
			const cb = await Model.find(q)
				.sort({ created_at: -1 })
				.exec();
			return {
				status: 200,
				message: "Completed",
				docs: cb
			};
		}
		throw new Error("Student not found!");
	}
};
