import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Product",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true },
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
