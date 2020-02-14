const { model, Schema } = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const StudentSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		regNo: {
			type: String,
			required: true,
			trim: true,
			unique: true
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
		image: {
			type: String,
			trim: true
		},
		passphase: {
			type: String,
			required: true,
			trim: true
		},
		fingerPrint: {
			type: String,
			trim: true
		},
		registeredCourses: [
			{
				session: {
					type: Schema.Types.ObjectId,
					required: true,
					trim: true,
					ref: "Session"
				},
				departmentalCourse: {
					type: Schema.Types.ObjectId,
					required: true,
					trim: true,
					ref: "DepartmentalCourse"
				},
				level: {
					type: Number,
					required: true
				},
				date: {
					type: Date,
					default: Date.now
				}
			}
		],
		level: {
			type: Number,
			required: true
		},
		removed: {
			type: Boolean,
			default: false
		},
		department: {
			type: Schema.Types.ObjectId,
			required: true,
			trim: true,
			ref: "Department"
		}
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
StudentSchema.virtual("id").get(function() {
	return this._id;
});
StudentSchema.virtual("reg_no").get(function() {
	return this.regNo;
});
StudentSchema.virtual("registered_courses").get(function() {
	return this.registeredCourses;
});
StudentSchema.set("toJSON", { virtual: true });
// public member
StudentSchema.plugin(paginate);
exports.StudentModel = model("Student", StudentSchema);
