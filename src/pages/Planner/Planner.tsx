import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./Planner.module.scss";

import StepProgressBar from "./components/StepProgressBar/StepProgressBar";
import InterestItem from "./components/InterestItem/InterestItem";
import type { PlannerFormData, InterestOption } from "./types";

const INTERESTS: InterestOption[] = [
  { id: "Ẩm thực", icon: "ph-fill ph-fork-knife", color: "#f97316" },
  { id: "Thiên nhiên", icon: "ph-fill ph-tree-evergreen", color: "#22c55e" },
  { id: "Văn hóa", icon: "ph-fill ph-bank", color: "#0ea5e9" },
  { id: "Sôi động", icon: "ph-fill ph-music-notes", color: "#a855f7" },
  { id: "Nghỉ dưỡng", icon: "ph-fill ph-umbrella-simple", color: "#06b6d4" },
];

const Planner: React.FC = () => {
  const [formData, setFormData] = useState<PlannerFormData>({
    destination: "",
    travelDate: "",
    interests: ["Ẩm thực", "Thiên nhiên"],
    budget: "Tiết kiệm (Dưới 5 triệu)",
    peopleGroup: "Gia đình / Nhóm bạn",
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleToggleInterest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : prev.interests.length < 4
          ? [...prev.interests, id]
          : prev.interests,
    }));
  };

  return (
    <div className={styles.plannerWrapper}>
      <div className={styles.bgDecoration}></div>
      <header className={styles.header} data-aos="fade-down">
        <h1>Lên kế hoạch chuyến đi mơ ước</h1>
        <p>
          Chỉ mất 2 phút để AI thiết kế lịch trình cá nhân hoá dành riêng cho
          bạn dựa trên sở thích và nhu cầu.
        </p>
      </header>

      <StepProgressBar currentStep={1} />

      <main className={styles.formCard} data-aos="zoom-in">
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <i className="ph-fill ph-map-trifold"></i> Bạn dự định đi đâu và khi
            nào?
          </h3>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>ĐIỂM ĐẾN</label>
              <div className={styles.inputWrapper}>
                <i className="ph-duotone ph-map-pin"></i>
                <input 
                  type="text" 
                  placeholder="Bạn muốn đi đâu?" 
                  value={formData.destination} 
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>THỜI GIAN</label>
              <div className={styles.inputWrapper}>
                <i className="ph-duotone ph-calendar-blank"></i>
                <input type="text" placeholder="Chọn ngày" id="plan-dates" />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <i className="ph-fill ph-heart"></i> Sở thích cá nhân
          </h3>
          <p className={styles.infoText}>Chọn tối đa 4 phong cách du lịch bạn mong muốn trải nghiệm nhất:</p>
          <div className={styles.interestGrid}>
            {INTERESTS.map((item) => (
              <InterestItem
                key={item.id}
                label={item.id}
                icon={item.icon}
                color={item.color}
                isActive={formData.interests.includes(item.id)}
                onClick={() => handleToggleInterest(item.id)}
              />
            ))}
          </div>
        </section>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>
              <i className="ph-fill ph-money"></i> Ngân sách
            </label>
            <div className={styles.selectWrapper}>
                <select className={styles.select}>
                <option>Tiết kiệm (Dưới 5 triệu)</option>
                <option>Tiêu chuẩn (5 - 15 triệu)</option>
                <option>Cao cấp (Trên 15 triệu)</option>
                </select>
                <i className="ph-bold ph-caret-down"></i>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>
              <i className="ph-fill ph-users"></i> Số Người
            </label>
            <div className={styles.selectWrapper}>
                <select className={styles.select}>
                <option>Gia định / Nhóm bạn</option>
                <option>Cặp đôi</option>
                <option>Đi một mình</option>
                </select>
                <i className="ph-bold ph-caret-down"></i>
            </div>
          </div>
        </div>

        <div className={styles.submitWrapper}>
          <button className={styles.btnSubmit}>
            <i className="ph-bold ph-lightning"></i> Tối ưu hóa lộ trình AI
          </button>
          <span className={styles.footerNote}>Mất khoảng 5-10 giây để xử lý dữ liệu thông minh</span>
        </div>
      </main>

      <section className={styles.mapSection} data-aos="fade-up">
        <div className={styles.mapWrapper}>
          {/* Real Google Maps Embed */}
          <iframe
            title="Google Maps"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(formData.destination || "Vietnam")}&output=embed&z=12`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          
          <div className={styles.mapInfoBox}>
            <div className={styles.infoTop}>
              <h4>{formData.destination || "Việt Nam"}</h4>
              <div className={styles.infoActions}>
                <i className="ph-bold ph-note-pencil"></i>
                <i className="ph-bold ph-arrow-bend-up-right"></i>
              </div>
            </div>
            <p>{formData.destination || "Việt Nam"}</p>
            <p className={styles.rating}>Đang hiển thị trên bản đồ</p>
          </div>

          <div className={styles.mapExpandBtn}>
            <i className="ph-bold ph-arrows-out"></i>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Planner;
