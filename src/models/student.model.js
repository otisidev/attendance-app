const { model, Schema } = require("mongoose");

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
		passphase: {
			type: String,
			required: true,
			trim: true
		},
		fingerPrint: {
			type: Buffer,
			trim: true
		},
		registeredCourses: [
			{
				session: {
					type: Schema.Types.ObjectId,
					required: true,
					trim: true
				},
				departmentalCourse: {
					type: Schema.Types.ObjectId,
					required: true,
					trim: true
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
		}
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
StudentSchema.virtual("id").get(function() {
	return this._id;
});

StudentSchema.set("toJSON", { virtual: true });
// public member
exports.StudentModel = model("Student", StudentSchema);
