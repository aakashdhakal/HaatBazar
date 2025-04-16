"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Rating } from "@/components/Rating";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { addReview } from "@/app/(server)/actions/reviews";
import Link from "next/link";

export function ReviewModal({
	productId,
	productName,
	isOpen,
	onClose,
	onSuccess,
}) {
	const [loading, setLoading] = useState(false);
	const [reviewData, setReviewData] = useState({
		rating: 5,
		comment: "",
	});

	const { data: session } = useSession();
	const { toast } = useToast();

	const handleReviewChange = (e) => {
		const { name, value } = e.target;
		setReviewData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleRatingChange = (value) => {
		setReviewData((prev) => ({
			...prev,
			rating: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!session) {
			toast({
				title: "Login required",
				description: "Please login to submit a review",
				variant: "error",
			});
			return;
		}

		setLoading(true);
		try {
			const result = await addReview({
				productId,
				rating: reviewData.rating,
				comment: reviewData.comment,
			});

			if (result.success) {
				toast({
					title: "Review submitted",
					description: "Thank you for your feedback!",
					variant: "success",
				});

				// Reset form
				setReviewData({ rating: 5, comment: "" });

				// Notify parent component of success
				if (onSuccess) {
					onSuccess(result.updatedProduct);
				}

				// Close modal
				onClose();
			} else {
				throw new Error(result.message || "Failed to submit review");
			}
		} catch (err) {
			toast({
				title: "Failed to submit review",
				description: err.message || "Please try again",
				variant: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">
						Write a Review
					</DialogTitle>
					<p className="text-sm text-gray-500">
						Share your experience with {productName}
					</p>
				</DialogHeader>

				{session ? (
					<form onSubmit={handleSubmit} className="space-y-6 py-4">
						<div>
							<label
								htmlFor="rating"
								className="block text-sm font-medium text-gray-700 mb-2">
								Your Rating
							</label>
							<Rating
								value={reviewData.rating}
								onChange={handleRatingChange}
								max={5}
							/>
						</div>

						<div>
							<label
								htmlFor="comment"
								className="block text-sm font-medium text-gray-700 mb-2">
								Your Review
							</label>
							<Textarea
								id="comment"
								name="comment"
								value={reviewData.comment}
								onChange={handleReviewChange}
								placeholder="Share your experience with this product..."
								rows={4}
								required
								className="w-full"
							/>
						</div>

						<DialogFooter>
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={loading}
								className="bg-primary hover:bg-primary/90 text-white">
								{loading ? (
									<>
										<span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
										Submitting...
									</>
								) : (
									"Submit Review"
								)}
							</Button>
						</DialogFooter>
					</form>
				) : (
					<div className="text-center py-8">
						<Icon
							icon="mdi:lock-outline"
							className="w-16 h-16 mx-auto text-gray-300 mb-4"
						/>
						<h3 className="text-lg font-medium text-gray-700 mb-2">
							Login Required
						</h3>
						<p className="text-gray-500 mb-4">Please login to write a review</p>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Link href="/login">
								<Button className="bg-primary hover:bg-primary/90 text-white">
									Login to Continue
								</Button>
							</Link>
						</DialogFooter>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default ReviewModal;
