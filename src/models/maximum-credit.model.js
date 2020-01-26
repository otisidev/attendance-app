const { model, Schema } = require("mongoose");

const MaximumCreditSchema = new Schema(
	{
		department: {
			type: Schema.Types.ObjectId,
			required: true,
			trim: true,
			ref: "Department"
		},
		level: {
			type: Number,
			required: true
		},
		creditUnit: {
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
MaximumCreditSchema.virtual("id").get(function() {
	return this._id;
});

MaximumCreditSchema.set("toJSON", { virtual: true });
MaximumCreditSchema.index(
	{ department: 1, level: 1, creditUnit: 1 },
	{ unique: true }
);
// public member
exports.MaximumCreditModel = model("MaximumCredit", MaximumCreditSchema);
