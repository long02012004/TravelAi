import { Camera, PaperPlaneTilt, X } from "@phosphor-icons/react";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "../../hooks/useApi";
import {
  createPlaceReview,
  getPlaceReviews,
  uploadReviewPhotos,
} from "../../services";
import StarRating from "./component/StarRating";
import styles from "./Review.module.scss";

// --- Interfaces ---
interface Review {
  id: number;
  userName: string;
  avatar: string;
  timeAgo: string;
  rating: number;
  comment: string;
}

const Review: React.FC = () => {
  const { placeId } = useParams<{ placeId: string }>();

  // Khởi tạo AOS khi component mount
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    if (placeId) {
      fetchReviews();
    }
  }, [placeId]);

  // --- States ---
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<(string | File)[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  // Mutations
  const { mutate: submitReview, loading: isSubmitting } = useMutation(
    async (reviewData) => {
      if (!placeId) {
        toast.error("ID địa điểm không hợp lệ");
        return null;
      }
      return createPlaceReview(placeId, reviewData);
    },
  );

  const { mutate: uploadPhotos, loading: isUploading } = useMutation(
    async (files: File[]) => {
      if (files.length === 0) return null;
      return uploadReviewPhotos(files);
    },
  );

  const fetchReviews = async () => {
    try {
      if (!placeId) return;
      const result = await getPlaceReviews(placeId, 0, 3);
      if (result?.data) {
        // Map API response to Review interface
        const reviews = Array.isArray(result.data)
          ? result.data.map((r: any, idx: number) => ({
              id: idx + 1,
              userName: r.userName || r.authorName || "User",
              avatar: r.avatar || `https://i.pravatar.cc/150?u=user${idx}`,
              timeAgo: r.timeAgo || r.createdAt || "Gần đây",
              rating: r.rating || 5,
              comment: r.comment || r.content || "",
            }))
          : [];
        setRecentReviews(reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    // Add to uploaded images (mix of File and preview URLs)
    const newImages = Array.from(files);
    setUploadedImages((prev) => [...prev, ...newImages]);

    // Optionally upload immediately
    try {
      const uploadResult = await uploadPhotos(newImages);
      if (uploadResult?.data) {
        toast.success("Tải ảnh lên thành công");
      }
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên");
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Vui lòng chọn mức độ đánh giá sao!");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng viết một phản hồi");
      return;
    }

    try {
      // Collect file uploads to send with review
      const filesToUpload = uploadedImages.filter(
        (img) => img instanceof File,
      ) as File[];
      let photoUrls: string[] = [];

      // Upload photos if any
      if (filesToUpload.length > 0) {
        const uploadResult = await uploadPhotos(filesToUpload);
        if (uploadResult?.data) {
          photoUrls = Array.isArray(uploadResult.data) ? uploadResult.data : [];
        }
      }

      // Submit review with photo URLs
      const reviewData = {
        rating: rating,
        comment: comment,
        photos: photoUrls,
      };

      const result = await submitReview(reviewData);

      if (result?.data) {
        toast.success(
          "Cảm ơn bạn đã gửi đánh giá! Ý kiến của bạn đã được ghi nhận.",
        );
        // Reset form
        setRating(0);
        setComment("");
        setUploadedImages([]);
        // Refresh reviews
        fetchReviews();
      }
    } catch (error) {
      toast.error("Lỗi khi gửi đánh giá");
      console.error(error);
    }
  };

  return (
    <main className={`container ${styles.reviewMain}`}>
      {/* 1. Header Section - Hiệu ứng Fade Down */}
      <section className={styles.reviewIntro} data-aos="fade-down">
        <h1 className={styles.reviewTitle}>Chia sẻ trải nghiệm của bạn</h1>
        <p className={styles.reviewSubtitle}>
          Ý kiến của bạn giúp chúng tôi hoàn thiện hành trình cho mọi người.
        </p>
      </section>

      <div className={styles.reviewLayout}>
        {/* 2. Left Panel - Hiệu ứng Fade Right (từ trái sang) */}
        <aside
          className={styles.reviewStatsCard}
          data-aos="fade-right"
          data-aos-delay="200"
        >
          <h3>Mức độ hài lòng</h3>
          <div className={styles.overallRating}>
            <span className={styles.ratingValue}>4.8</span>
            <div className={styles.starsDisplay}>
              <StarRating initialRating={5} isEditable={false} />
            </div>
          </div>
          <p className={styles.ratingSub}>Dựa trên 1,240 đánh giá</p>

          <div className={styles.metricBars}>
            <MetricBar label="Lịch trình tối ưu" percent={95} delay={300} />
            <MetricBar label="Giá cả hợp lý" percent={88} delay={400} />
            <MetricBar
              label="Độ chính xác thông tin"
              percent={92}
              delay={500}
            />
          </div>

          <div
            className={styles.thankYouBox}
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            <h4>Cảm ơn bạn!</h4>
            <p>
              Mỗi phản hồi là một món quà giúp chúng tôi nỗ lực hơn mỗi ngày.
            </p>
          </div>
        </aside>

        {/* 3. Right Panel - Hiệu ứng Fade Left (từ phải sang) */}
        <section
          className={styles.feedbackFormCard}
          data-aos="fade-left"
          data-aos-delay="400"
        >
          {/* ... Các form group giữ nguyên ... */}
          <div className={styles.formGroup}>
            <h4>Bạn đánh giá thế nào về trải nghiệm này?</h4>
            <StarRating onChange={(val) => setRating(val)} />
          </div>

          <div className={styles.formGroup}>
            <h4>Chi tiết phản hồi</h4>
            <textarea
              placeholder="Hãy cho chúng tôi biết điều gì bạn thích hoặc cần cải thiện..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting || isUploading}
            />
          </div>

          {/* ... Phần Upload ảnh giữ nguyên ... */}
          <div className={styles.formGroup}>
            <h4>Thêm hình ảnh</h4>
            <div className={styles.uploadGrid}>
              <label className={styles.uploadBtn}>
                <Camera size={24} weight="bold" />
                <span>Tải ảnh lên</span>
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  disabled={isUploading}
                />
              </label>

              {uploadedImages.map((img, index) => {
                const imageUrl =
                  typeof img === "string" ? img : URL.createObjectURL(img);

                return (
                  <div
                    key={index}
                    className={styles.uploadThumb}
                    data-aos="zoom-in"
                  >
                    <img src={imageUrl} alt={`Thumb ${index}`} />
                    <button
                      className={styles.btnRemoveImg}
                      onClick={() => handleRemoveImage(index)}
                      disabled={isUploading}
                      type="button"
                    >
                      <div className={styles.btnIcon}>
                        <X size={10} weight="bold" />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.btnSubmitReview}
              onClick={handleSubmit}
              disabled={isSubmitting || isUploading}
              type="button"
            >
              <PaperPlaneTilt size={16} weight="bold" />{" "}
              {isSubmitting || isUploading ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
            <button
              className={styles.btnCancelReview}
              onClick={() => window.history.back()}
              disabled={isSubmitting || isUploading}
              type="button"
            >
              Hủy bỏ
            </button>
          </div>
        </section>
      </div>

      {/* 4. Recent Reviews Section - Hiệu ứng Fade Up từng card */}
      <section className={styles.recentReviewsSection}>
        <h2 className={styles.sectionTitle} data-aos="fade-up">
          Đánh giá gần đây
        </h2>
        <div className={styles.reviewsGrid}>
          {recentReviews.map((review, index) => (
            <div
              key={review.id}
              className={styles.reviewUserCard}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={styles.userRow}>
                <div className={styles.userMeta}>
                  <img src={review.avatar} alt={review.userName} />
                  <div className={styles.info}>
                    <strong>{review.userName}</strong>
                    <span>{review.timeAgo}</span>
                  </div>
                </div>
                <div className={styles.starsFixed}>
                  <StarRating
                    initialRating={review.rating}
                    isEditable={false}
                  />
                </div>
              </div>
              <p className={styles.reviewText}>"{review.comment}"</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

// Cập nhật Sub-component MetricBar để nhận delay
const MetricBar: React.FC<{
  label: string;
  percent: number;
  delay?: number;
}> = ({ label, percent, delay }) => (
  <div className={styles.metric} data-aos="fade-right" data-aos-delay={delay}>
    <div className={styles.metricLabel}>
      <span>{label}</span> <span>{percent}%</span>
    </div>
    <div className={styles.progressBg}>
      <div
        className={styles.progressFill}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  </div>
);

export default Review;
