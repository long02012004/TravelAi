import React from "react";
import styles from "./ProfileSidebar.module.scss";

interface Trip {
  id: number;
  title: string;
  image: string;
  timeAgo: string;
}

const ProfileSidebar: React.FC = () => {
  const savedTrips: Trip[] = [
    {
      id: 1,
      title: "Hạ Long - 3 ngày 2 đêm",
      image: "https://images.unsplash.com/photo-1598018554441-b4d717311ce7?auto=format&fit=crop&q=80&w=400",
      timeAgo: "2 giờ trước",
    },
    {
      id: 2,
      title: "Đà Lạt - Phố Sương Mù",
      image: "https://images.unsplash.com/photo-1589136142558-9469d4434661?auto=format&fit=crop&q=80&w=400",
      timeAgo: "3 ngày trước",
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span>
            <i className="ph-fill ph-bookmarks"></i> Chuyến đi đã lưu
          </span>
          <a href="#">Xem tất cả</a>
        </div>
        <div className={styles.tripList}>
          {savedTrips.map((trip) => (
            <div key={trip.id} className={styles.tripItem}>
              <div className={styles.imageWrapper}>
                <img src={trip.image} alt={trip.title} />
              </div>
              <div className={styles.tripInfo}>
                <div className={styles.tripTitle}>{trip.title}</div>
                <div className={styles.time}>
                  <i className="ph-bold ph-clock"></i> {trip.timeAgo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.referral}>
        <div className={styles.referralIcon}>
          <i className="ph-fill ph-gift"></i>
        </div>
        <h4>Mời bạn bè</h4>
        <p>Nhận ngay <strong>100 điểm</strong> MyPoints khi bạn bè đăng ký qua liên kết của bạn.</p>
        <button className={styles.copyBtn}>
          <i className="ph-bold ph-copy"></i>
          Sao chép liên kết
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
