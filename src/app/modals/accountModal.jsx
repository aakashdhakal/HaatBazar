//create accounts moderl for authjs
import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
		},
		provider: {
			type: String,
			required: true,
		},
		providerAccountId: {
			type: String,
			required: true,
		},
		refresh_token: {
			type: String,
		},
		access_token: {
			type: String,
		},
		expires_at: {
			type: Number,
		},
		token_type: {
			type: String,
		},
		scope: {
			type: String,
		},
		id_token: {
			type: String,
		},
		session_state: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

const Account =
	mongoose.models.Account || mongoose.model("Account", AccountSchema);
export default Account;
