import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  RocketLaunch,
  Compass,
  MapPin,
  CalendarBlank,
  Users,
  Sparkle,
} from "phosphor-react";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css"; // Đảm bảo đã import CSS của thư viện
import VideoHome from "../../../../assets/video/Da_Nang.mp4";
import styles from "../../Home.module.scss";

const VIETNAM_PROVINCES = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bạc Liêu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Dương",
  "Bình Định",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Cần Thơ",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lạng Sơn",
  "Lào Cai",
  "Lâm Đồng",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "TP Hồ Chí Minh",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [dest, setDest] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");

  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!dateInputRef.current) return;

    // Khởi tạo Flatpickr
    const fp = flatpickr(dateInputRef.current, {
      mode: "range",
      minDate: "today",
      dateFormat: "d/m/Y",
      allowInput: false,
      locale: {
        rangeSeparator: " - ",
      },
      // Cập nhật state ngay khi người dùng chọn ngày
      onChange: (selectedDates, dateStr) => {
        setDates(dateStr);
      },
    });

    // Cleanup khi component bị hủy (Tránh rò rỉ bộ nhớ)
    return () => {
      if (fp) {
        if (Array.isArray(fp)) {
          // Nếu là mảng, duyệt qua từng cái để destroy
          fp.forEach((instance) => instance.destroy());
        } else {
          // Nếu là đối tượng đơn lẻ
          fp.destroy();
        }
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Đóng gói dữ liệu vào một Object
    const tripData = {
      destination: dest,
      dateRange: dates,
      totalGuests: guests,
      // Bạn có thể thêm các thông tin ẩn khác ở đây
      searchAt: new Date().toISOString(),
    };

    // 2. Truyền đi thông qua tham số thứ 2 của navigate
    navigate("/planner", { state: tripData });
  };

  return (
    <section className={styles.hero}>
      <video autoPlay loop muted className={styles.video}>
        <source src={VideoHome} type="video/mp4" />
      </video>
      <div className={styles.container} data-aos="zoom-in">
        <div
          className={styles.heroBadge}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <span className={styles.badgeIcon}>✨</span>
          <span>MỚI: TRẢI NGHIỆM AI LÊN KẾ HOẠCH</span>
        </div>
        <h1
          className={styles.heroTitle}
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Hành trình Du lịch <br />
          <span className={styles.gradientText}>Thông minh với AI</span>
        </h1>
        <p
          className={styles.heroDescription}
          data-aos="fade-up"
          data-aos-delay="600"
        >
          Khám phá thế giới theo cách riêng của bạn với sự trợ giúp từ trí tuệ
          nhân tạo.
        </p>
        <div
          className={styles.heroButtons}
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <Link to="/planner" className={`${styles.btn} ${styles.btnPrimary}`}>
            <RocketLaunch weight="fill" /> Bắt đầu hành trình
          </Link>
          <Link
            to="/explore"
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            <Compass weight="bold" /> Khám phá ngay
          </Link>
        </div>

        {/* --- Search Widget --- */}
        <div
          className={styles.heroSearchWrapper}
          data-aos="zoom-in-up"
          data-aos-delay="1000"
        >
          <form className={styles.premiumSearchWidget} onSubmit={handleSearch}>
            {/* Field: Điểm đến */}
            <div className={styles.searchField}>
              <div className={styles.fieldIcon}>
                <MapPin weight="duotone" />
              </div>
              <div className={styles.fieldInfo}>
                <label>Điểm đến</label>
                <input
                  type="text"
                  list="vietnam-provinces"
                  placeholder="Bạn muốn đi đâu?"
                  required
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                />
                <datalist id="vietnam-provinces">
                  {VIETNAM_PROVINCES.map((province) => (
                    <option key={province} value={province} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className={styles.searchDivider}></div>

            {/* Field: Ngày tháng */}
            <div className={styles.searchField}>
              <div className={styles.fieldIcon}>
                <CalendarBlank weight="duotone" />
              </div>
              <div className={styles.fieldInfo}>
                <label>Ngày đi - Ngày về</label>
                <input
                  type="text"
                  ref={dateInputRef}
                  id="dates-input"
                  placeholder="Thêm ngày"
                  required
                  // value={dates} // Bỏ value để Flatpickr tự quản lý UI, tránh bị React reset khi re-render
                  readOnly // Quan trọng: Để Flatpickr kiểm soát hoàn toàn
                />
              </div>
            </div>

            <div className={styles.searchDivider}></div>

            {/* Field: Số khách */}
            <div className={styles.searchField}>
              <div className={styles.fieldIcon}>
                <Users weight="duotone" />
              </div>
              <div className={styles.fieldInfo}>
                <label>Số khách</label>
                <input
                  type="number"
                  placeholder="Thêm khách"
                  min="1"
                  required
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className={styles.btnSearchSubmit}>
              <Sparkle weight="fill" /> <span>Tạo lịch trình</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
