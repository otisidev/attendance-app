const { model, Schema } = require("mongoose");

const LecturerSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true
		},
		phone: {
			type: String,
			required: true,
			trim: true,
			unique: true
		},
		regNo: {
			type: String,
			required: false,
			trim: true
		},
		fingerprint: {
			type: String,
			required: false
		},
		assignedCourses: [
			{
				type: Schema.Types.ObjectId,
				default: [],
				ref: "DepartmentalCourse"
			}
		],
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			trim: true,
			ref: "User"
		},
		removed: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
LecturerSchema.virtual("id").get(function() {
	return this._id;
});
LecturerSchema.virtual("assigned_courses").get(function() {
	return this.assignedCourses;
});
LecturerSchema.virtual("reg_no").get(function() {
	return this.regNo;
});

LecturerSchema.set("toJSON", { virtual: true });
// public member
exports.LecturerModel = model("Lecturer", LecturerSchema);
