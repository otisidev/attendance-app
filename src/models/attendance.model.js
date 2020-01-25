const { model, Schema } = require("mongoose");

const AttendanceSchema = new Schema(
	{
		departmentalCourse: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "DepartmentalCourse",
			trim: true
		},
		session: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "session",
			trim: true
		},
		lecturer: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Lecturer",
			trim: true
		},
		studentAuthor: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Student",
			trim: true
		},
		removed: {
			type: Boolean,
			default: false
		},
		students: [
			{
				student: {
					type: Schema.Types.ObjectId,
					ref: "Student",
					required: true
				},
				present: {
					type: Boolean,
					default: false
				},
				exempted: {
					type: Boolean,
					default: false
				}
			}
		],
		cancelled: {
			author: {
				type: Schema.Types.ObjectId,
				trim: true,
				ref: "User"
			},
			status: {
				type: Boolean,
				default: false
			},
			date: Date,
			reason: {
				type: String,
				trim: true
			}
		}
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
AttendanceSchema.virtual("id").get(function() {
	return this._id;
});

AttendanceSchema.set("toJSON", { virtual: true });
// public member
exports.AttendanceModel = model("Attendance", AttendanceSchema);
