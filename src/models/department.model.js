const { model, Schema } = require("mongoose");

const DepartmentSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true
		},
		removed: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
DepartmentSchema.virtual("id").get(function() {
	return this._id;
});

DepartmentSchema.set("toJSON", { virtual: true });
// public member
exports.DepartmentModel = model("Department", DepartmentSchema);
