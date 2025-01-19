import mongoose from "mongoose";

const VerificationTokenSchema = new mongoose.Schema(
	{
		identifier: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
		expires: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const VerificationToken =
	mongoose.models.VerificationToken ||
	mongoose.model("VerificationToken", VerificationTokenSchema);

export default VerificationToken;
