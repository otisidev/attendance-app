const { MaximumCreditModel } = require("../models/maximum-credit.model");
const { Types } = require("mongoose");

// local props
const Model = MaximumCreditModel;
const { isValid } = Types.ObjectId;

exports.MaximumCreditService = class MaximumCreditService {
	/**
	 * Creates a new maximum credit unit
	 * @param {any} model New Maximum credit unit object
	 */
	async NewMaximumCredit(model) {
		if (model) {
			const cb = await new Model(model).save();
			await Model.populate(cb, {
				model: "Department",
				path: "department"
			});
			if (cb)
				return {
					status: 200,
					message: "Added new record successfully!",
					doc: cb
				};
		}
		throw new Error("Maximum credit unit not vaild!");
	}

	/**
	 * Removes a singlw maximum credit unit
	 * @param {string} id Object id
	 */
	async RemoveRecord(id) {
		// validation
		if (isValid(id)) {
			const q = { removed: false, _id: id };
			const cb = await Model.findOne(q).exec();
			if (cb)
				return {
					status: 200,
					message: "Remoce record successfully!",
					doc: { status: "Deleted", id }
				};
		}
		throw new Error("Maximum credit unit not found!");
	}

	async GetMaximumCreditUnits() {
		const q = { removed: false };
		const cb = await Model.find(q)
			.populate("department")
			.sort({ department: 1, level: 1 })
			.exec();

		return {
			status: 200,
			message: "Completed",
			docs: cb
		};
	}
};
