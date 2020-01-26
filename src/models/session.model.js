const { model, Schema } = require("mongoose");

const SessionSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true
		},
		semester: {
			type: String,
			required: true,
			trim: true
		},
		active: {
			type: Boolean,
			default: false
		},
		removed: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
SessionSchema.virtual("id").get(function() {
	return this._id;
});

SessionSchema.set("toJSON", { virtual: true });
// public member
SessionSchema.index({ title: 1, semester: 1 }, { unique: true });
exports.SessionModel = model("Session", SessionSchema);
