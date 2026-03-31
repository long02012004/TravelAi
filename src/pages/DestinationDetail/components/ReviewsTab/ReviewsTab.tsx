import { Star, StarHalf } from "@phosphor-icons/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "../../../../hooks/useApi";
import {
  createPlaceReview,
  type CreateReviewRequest,
} from "../../../../services";
import type { Destination } from "../../DestinationDetail";
import styles from "./ReviewsTab.module.scss";

interface ReviewsTabProps {
  reviews: Destination["reviewsData"];
  placeId: number;
  onReviewSubmitted?: () => void;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({
  reviews,
  placeId,
  onReviewSubmitted,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate: submitReview, loading: isSubmitting } = useMutation(
    async (reviewData?: CreateReviewRequest) => {
      if (!reviewData) {
        throw new Error("Review data is required");
      }
      const response = await createPlaceReview(placeId, reviewData);
      return {
        data: {
          DT: response.data.DT,
        },
      };
    },
  );

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Vui lòng chọn mức đánh giá sao");
      return;
    }

    if (!content.trim()) {
      toast.error("Vui lòng viết một bình luận");
      return;
    }

    try {
      const result = await submitReview({
        rating: rating,
        title: title || "Đánh giá",
        content: content,
      });

      if (result) {
        toast.success("Đánh giá của bạn đã được gửi");
        setRating(0);
        setTitle("");
        setContent("");
        setShowForm(false);
        onReviewSubmitted?.();
      }
    } catch {
      toast.error("Lỗi khi gửi đánh giá");
    }
  };

  return (
    <div className={styles.reviewsContainer} data-aos="fade-up">
      <div className={styles.reviewBtn}>
        <span>Đánh giá từ cộng đồng</span>

        <button className={styles.btn} onClick={() => setShowForm(!showForm)}>
          Đánh giá ngay
        </button>
      </div>

      {showForm && (
        <div
          className={styles.reviewForm}
          style={{
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <h4>Chia sẻ trải nghiệm của bạn</h4>

          <div style={{ marginBottom: "15px" }}>
            <label>Đánh giá sao: </label>
            <div style={{ display: "flex", gap: "5px", marginTop: "8px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "24px",
                    color: star <= rating ? "#f59e0b" : "#ddd",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Bình luận: </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ ý kiến của bạn..."
              style={{
                width: "100%",
                minHeight: "100px",
                marginTop: "8px",
                padding: "8px",
                fontFamily: "inherit",
              }}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              style={{
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
              style={{
                padding: "8px 16px",
                backgroundColor: "#e5e7eb",
                color: "#333",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className={styles.ratingSummary}>
        <div className={styles.scoreBig}>
          <h2>{reviews.average}</h2>
          <div className={styles.starsRow}>
            {/* Render sao tùy vào reviews.average */}
            <Star weight="fill" color="#f59e0b" size={18} />
            <Star weight="fill" color="#f59e0b" size={18} />
            <Star weight="fill" color="#f59e0b" size={18} />
            <Star weight="fill" color="#f59e0b" size={18} />
            <StarHalf weight="fill" color="#f59e0b" size={18} />
          </div>
          <p>{reviews.total} đánh giá</p>
        </div>

        <div className={styles.ratingBars}>
          {reviews.breakdown.map(
            (item: { stars: number; percentage: number }) => (
              <div key={item.stars} className={styles.barRow}>
                <span>{item.stars} sao</span>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className={styles.percentText}>{item.percentage}%</span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className={styles.reviewsList}>
        {reviews.list.map(
          (rev: Destination["reviewsData"]["list"][0], idx: number) => (
            <div key={idx} className={styles.reviewItem}>
              <div className={styles.reviewerHeader}>
                <img src={rev.avatar} className={styles.avatar} alt="" />
                <div className={styles.reviewerInfo}>
                  <h4>{rev.user}</h4>
                  <div className={styles.revMeta}>
                    <div className={styles.miniStars}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} weight="fill" />
                      ))}
                    </div>
                    <span>{rev.date}</span>
                    <span className={styles.tag}>{rev.tag}</span>
                  </div>
                </div>
              </div>
              <p className={styles.revContent}>{rev.content}</p>
              {rev.images && (
                <div className={styles.revGallery}>
                  {rev.images.map((img: string, i: number) => (
                    <img key={i} src={img} alt="" />
                  ))}
                </div>
              )}
            </div>
          ),
        )}
      </div>
      <button
        className={styles.btnLoadMore}
        onClick={() => {
          setShowForm(true);
        }}
      >
        Xem thêm {reviews.total - 2} đánh giá
      </button>
    </div>
  );
};

export default ReviewsTab;
