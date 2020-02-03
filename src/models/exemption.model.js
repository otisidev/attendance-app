const { model, Schema } = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const ExemptionSchema = new Schema(
	{
		reason: {
			type: String,
			required: true,
			trim: true
		},
		attendance: {
			type: Schema.Types.ObjectId,
			required: true,
			trim: true,
			ref: "Attendance"
		},
		student: {
			type: Schema.Types.ObjectId,
			required: true,
			trim: true,
			ref: "Student"
		},
		removed: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
ExemptionSchema.virtual("id").get(function() {
	return this._id;
});

ExemptionSchema.set("toJSON", { virtual: true });
// public member
ExemptionSchema.plugin(paginate);
exports.ExemptionModel = model("Exemption", ExemptionSchema);
