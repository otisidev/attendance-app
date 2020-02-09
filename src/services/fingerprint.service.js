const { FingerPrintModel } = require("../models/fingerprint.model");
const { Types } = require("mongoose");

// local props
const Model = FingerPrintModel;
const { isValid } = Types.ObjectId;

exports.FingerPrintService = class FingerPrintService {
	//
	async LogNew(model) {
		if (model && isValid(model.student)) {
			const cb = new Model(model).save();
			if (cb)
				return {
					status: 200,
					message: "Logged successfully"
				};
		}
		return false;
	}
};
