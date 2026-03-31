import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface Review {
  id: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  votes?: {
    helpful: number;
    unhelpful: number;
  };
  createdAt: string;
  updatedAt?: string;
  replies?: Review[];
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface CreateReviewRequest {
  rating: number;
  title: string;
  content: string;
  images?: string[];
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
  images?: string[];
}

// === PLACE/DESTINATION REVIEWS ===

// 1. Lấy danh sách reviews cho một địa điểm
export const getPlaceReviews = (
  placeId: number,
  skip = 0,
  limit = 10,
  sortBy = "recent",
): Promise<AxiosResponse<BackendResponse<Review[]>>> => {
  return instance.get<BackendResponse<Review[]>>(
    `/api/places/${placeId}/reviews?skip=${skip}&limit=${limit}&sortBy=${sortBy}`,
  );
};

// 2. Lấy thống kê đánh giá cho một địa điểm
export const getPlaceReviewStats = (
  placeId: number,
): Promise<AxiosResponse<BackendResponse<ReviewStats>>> => {
  return instance.get<BackendResponse<ReviewStats>>(
    `/api/places/${placeId}/review-stats`,
  );
};

// 3. Tạo review cho một địa điểm
export const createPlaceReview = (
  placeId: number,
  request: CreateReviewRequest,
): Promise<AxiosResponse<BackendResponse<Review>>> => {
  return instance.post<BackendResponse<Review>>(
    `/api/places/${placeId}/reviews`,
    request,
  );
};

// 4. Cập nhật review của địa điểm
export const updatePlaceReview = (
  placeId: number,
  reviewId: number,
  request: UpdateReviewRequest,
): Promise<AxiosResponse<BackendResponse<Review>>> => {
  return instance.patch<BackendResponse<Review>>(
    `/api/places/${placeId}/reviews/${reviewId}`,
    request,
  );
};

// 5. Xóa review của địa điểm
export const deletePlaceReview = (
  placeId: number,
  reviewId: number,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.delete<BackendResponse<{ success: boolean }>>(
    `/api/places/${placeId}/reviews/${reviewId}`,
  );
};

// === DESTINATION REVIEWS ===

// 6. Lấy danh sách reviews cho một điểm đến
export const getDestinationReviews = (
  destinationId: number,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<Review[]>>> => {
  return instance.get<BackendResponse<Review[]>>(
    `/api/destinations/${destinationId}/reviews?skip=${skip}&limit=${limit}`,
  );
};

// 7. Tạo review cho một điểm đến
export const createDestinationReview = (
  destinationId: number,
  request: CreateReviewRequest,
): Promise<AxiosResponse<BackendResponse<Review>>> => {
  return instance.post<BackendResponse<Review>>(
    `/api/destinations/${destinationId}/reviews`,
    request,
  );
};

// === TRIP REVIEWS ===

// 8. Lấy danh sách reviews cho một trip
export const getTripReviews = (
  tripId: number,
): Promise<AxiosResponse<BackendResponse<Review[]>>> => {
  return instance.get<BackendResponse<Review[]>>(
    `/api/trips/${tripId}/reviews`,
  );
};

// 9. Tạo review cho một trip
export const createTripReview = (
  tripId: number,
  request: CreateReviewRequest,
): Promise<AxiosResponse<BackendResponse<Review>>> => {
  return instance.post<BackendResponse<Review>>(
    `/api/trips/${tripId}/reviews`,
    request,
  );
};

// === REVIEW INTERACTIONS ===

// 10. Đánh dấu review là hữu ích
export const markReviewHelpful = (
  entityType: "place" | "destination" | "trip",
  entityId: number,
  reviewId: number,
): Promise<
  AxiosResponse<
    BackendResponse<{ votes: { helpful: number; unhelpful: number } }>
  >
> => {
  return instance.post<
    BackendResponse<{ votes: { helpful: number; unhelpful: number } }>
  >(`/api/${entityType}s/${entityId}/reviews/${reviewId}/helpful`);
};

// 11. Đánh dấu review là không hữu ích
export const markReviewUnhelpful = (
  entityType: "place" | "destination" | "trip",
  entityId: number,
  reviewId: number,
): Promise<
  AxiosResponse<
    BackendResponse<{ votes: { helpful: number; unhelpful: number } }>
  >
> => {
  return instance.post<
    BackendResponse<{ votes: { helpful: number; unhelpful: number } }>
  >(`/api/${entityType}s/${entityId}/reviews/${reviewId}/unhelpful`);
};

// 12. Báo cáo review không phù hợp
export const reportReview = (
  entityType: "place" | "destination" | "trip",
  entityId: number,
  reviewId: number,
  reason: string,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.post<BackendResponse<{ success: boolean }>>(
    `/api/${entityType}s/${entityId}/reviews/${reviewId}/report`,
    { reason },
  );
};

// === PHOTO REVIEWS ===

// 13. Tải lên ảnh cho review
export const uploadReviewPhotos = (
  files: File[],
): Promise<AxiosResponse<BackendResponse<string[]>>> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return instance.post<BackendResponse<string[]>>(
    "/api/reviews/upload-photos",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

// 14. Xóa ảnh từ review
export const deleteReviewPhoto = (
  photoUrl: string,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.post<BackendResponse<{ success: boolean }>>(
    "/api/reviews/delete-photo",
    { photoUrl },
  );
};

// === USER'S REVIEWS ===

// 15. Lấy danh sách reviews mà user đã viết
export const getUserReviews = (
  userId: string,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<Review[]>>> => {
  return instance.get<BackendResponse<Review[]>>(
    `/api/users/${userId}/reviews?skip=${skip}&limit=${limit}`,
  );
};
