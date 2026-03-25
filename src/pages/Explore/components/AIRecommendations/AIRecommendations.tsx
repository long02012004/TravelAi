import React from "react";
import styles from "./AIRecommendations.module.scss";

const AIRecommendations: React.FC = () => {
  return (
    <div className={styles.aiSection} data-aos="fade-right">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.aiIcon}>✨</span>
          <h3>Gợi ý thông minh cho Qlong</h3>
        </div>
        <button className={styles.viewAllBtn}>
          Xem tất cả <span>→</span>
        </button>
      </div>
      <div className={styles.scrollWrapper}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className={styles.miniCard}>
            <img src={`https://picsum.photos/200/120?sig=${i}`} alt="Suggest" />
            <div className={styles.miniInfo}>
              <h4>Địa điểm HOT #{i}</h4>
              <span>98% phù hợp</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
