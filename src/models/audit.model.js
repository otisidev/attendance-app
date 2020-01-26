const { model, Schema } = require("mongoose");
const paginate = require("mongoose-paginate-v2");

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
AuditSchema.virtual("desc").get(function() {
	return this.description;
});
AuditSchema.virtual("user_agent").get(function() {
	return this.userAgent;
});

AuditSchema.set("toJSON", { virtual: true });
// public member
AuditSchema.plugin(paginate);
exports.AuditModel = model("Audit", AuditSchema);
