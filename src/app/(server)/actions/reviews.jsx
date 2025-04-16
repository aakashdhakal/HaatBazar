"use server";
import dbConnect from "@/lib/db";
import Review from "@/modals/reviewModal";
import Product from "@/modals/productModal";
import { auth } from "@/app/auth";

export async function addReview({ productId, rating, comment }) {
	await dbConnect();

	try {
		// Get the current session
		const session = await auth();

		if (!session || !session.user) {
			return {
				success: false,
				message: "You must be logged in to leave a review",
			};
		}

		// Find the product
		const product = await Product.findById(productId);

		if (!product) {
			return {
				success: false,
				message: "Product not found",
			};
		}

		// Check if the user has already reviewed this product
		const existingReview = await Review.findOne({
			productId: productId,
			user: session.user.id,
		});

		if (existingReview) {
			return {
				success: false,
				message: "You have already reviewed this product",
			};
		}

		// Create the review with just the user ID reference
		const review = new Review({
			productId: productId,
			user: session.user.id, // Just store the user ID
			rating: Number(rating),
			comment,
			createdAt: new Date(),
		});

		// Save the review
		await review.save();

		// Update the product's rating and numReviews
		const allProductReviews = await Review.find({ productId: productId });

		product.numReviews = allProductReviews.length;
		product.rating =
			allProductReviews.reduce((acc, item) => item.rating + acc, 0) /
			allProductReviews.length;

		await product.save();

		return {
			success: true,
			message: "Review added successfully",
			updatedProduct: {
				...product.toObject(),
				_id: product._id.toString(),
			},
		};
	} catch (error) {
		console.error("Error adding review:", error);
		return {
			success: false,
			message: "Failed to add review",
			error: error.message,
		};
	}
}

export async function getProductReviews(productId) {
	await dbConnect();

	try {
		// Populate the user field to get the latest user data
		const reviews = await Review.find({ productId })
			.populate("user", "name image") // Populate with just name and image
			.sort({ createdAt: -1 }) // Sort by newest first
			.lean();

		if (!reviews) {
			return {
				success: true,
				reviews: [],
			};
		}

		// Format the reviews with user data
		const formattedReviews = reviews.map((review) => ({
			_id: review._id.toString(),
			productId: review.productId.toString(),
			userId: review.user._id.toString(),
			name: review.user.name, // From populated user
			image: review.user.image, // From populated user
			rating: review.rating,
			comment: review.comment,
			createdAt: review.createdAt,
		}));

		return {
			success: true,
			reviews: formattedReviews,
		};
	} catch (error) {
		console.error("Error fetching reviews:", error);
		return {
			success: false,
			message: "Failed to fetch reviews",
			error: error.message,
		};
	}
}
// Add this new function to your existing file

export async function deleteReview(reviewId) {
	await dbConnect();

	try {
		// Get the current session
		const session = await auth();

		if (!session || !session.user) {
			return {
				success: false,
				message: "You must be logged in to delete a review",
			};
		}

		// Find the review
		const review = await Review.findById(reviewId);

		if (!review) {
			return {
				success: false,
				message: "Review not found",
			};
		}

		// Check if the user is the owner of the review
		if (review.user.toString() !== session.user.id) {
			return {
				success: false,
				message: "You can only delete your own reviews",
			};
		}

		// Store productId before deletion for rating recalculation
		const productId = review.productId;

		// Delete the review
		await Review.findByIdAndDelete(reviewId);

		// Update the product's rating and numReviews
		const product = await Product.findById(productId);

		if (product) {
			const allProductReviews = await Review.find({ productId });

			product.numReviews = allProductReviews.length;

			product.rating =
				allProductReviews.length > 0
					? allProductReviews.reduce((acc, item) => item.rating + acc, 0) /
					  allProductReviews.length
					: 0;

			await product.save();
		}

		return {
			success: true,
			message: "Review deleted successfully",
			updatedProduct: product
				? {
						...product.toObject(),
						_id: product._id.toString(),
				  }
				: null,
		};
	} catch (error) {
		console.error("Error deleting review:", error);
		return {
			success: false,
			message: "Failed to delete review",
			error: error.message,
		};
	}
}
