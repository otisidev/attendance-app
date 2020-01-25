const { model, Schema } = require("mongoose");

const AuditSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			trim: true,
			ref: "User"
		},
		action: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String,
			required: true,
			trim: true
		},
		ip: {
			type: String,
			required: true,
			trim: true
		},
		userAgent: {
			type: String,
			required: true
		}
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
AuditSchema.virtual("id").get(function() {
	return this._id;
});

AuditSchema.set("toJSON", { virtual: true });
// public member
exports.AuditModel = model("Audit", AuditSchema);
