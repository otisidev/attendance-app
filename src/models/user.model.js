const { model, Schema } = require("mongoose");

const UserSchema = new Schema(
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
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			trim: true,
			ref: "User"
		},
		passphase: {
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
UserSchema.virtual("id").get(function() {
	return this._id;
});

UserSchema.set("toJSON", { virtual: true });
// public member
exports.UserModel = model("User", UserSchema);
