const { model, Schema } = require("mongoose");

const DepartmentalCourseSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true
		},
		code: {
			type: String,
			required: true,
			trim: true
		},
		level: {
			type: Number,
			required: true
		},
		creditUnit: {
			type: Number,
			required: true
		},
		department: {
			type: Schema.Types.ObjectId,
			required: true,
			trim: true,
			ref: "Department"
		},
		semester: {
			type: String,
			required: true,
			trim: true
		},
		lecturers: [
			{
				type: Schema.Types.ObjectId,
				trim: true,
				ref: "Lecturer",
				default: []
			}
		],
		removed: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
DepartmentalCourseSchema.virtual("id").get(function() {
	return this._id;
});

DepartmentalCourseSchema.set("toJSON", { virtual: true });
// public member
exports.DepartmentalCourseModel = model(
	"DepartmentalCourse",
	DepartmentalCourseSchema
);
