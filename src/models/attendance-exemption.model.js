const { model, Schema } = require("mongoose");

const AttendanceExemptionSchema = new Schema(
	{
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
		reason: {
			type: String,
			required: true,
			trim: true
		},
		removed: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
AttendanceExemptionSchema.virtual("id").get(function() {
	return this._id;
});

AttendanceExemptionSchema.set("toJSON", { virtual: true });
// public member
exports.AttendanceExemptionModel = model(
	"AttendanceExemption",
	AttendanceExemptionSchema
);
