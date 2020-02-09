const { model, Schema } = require("mongoose");

const FingerPrintSchema = new Schema(
	{
		student: {
			type: Schema.Types.ObjectId,
			required: true,
			trim: true,
			ref: "Student"
		},
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			trim: true,
			ref: "Student"
		},
		reason: {
			type: String,
			required: true
		},
		prevFinger: {
			type: String,
			required: true
		},
		newFinger: {
			type: String,
			required: true
		},
		removed: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
FingerPrintSchema.virtual("id").get(function() {
	return this._id;
});

FingerPrintSchema.set("toJSON", { virtual: true });

exports.FingerPrintModel = model("FingerPrint", FingerPrintSchema);
