import { EnvelopeSimple, PaperPlaneRight } from "@phosphor-icons/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "../../../../hooks/useApi";
import { subscribeNewsletter } from "../../../../services";
import styles from "./Newsletter.module.scss";

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");

  const { mutate: subscribe, loading: isSubscribing } = useMutation(
    async (emailAddress: string) => {
      return subscribeNewsletter(emailAddress, [
        "Tin tức",
        "Ưu đãi",
        "Mẹo du lịch",
      ]);
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Vui lòng nhập email của bạn");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    try {
      const result = await subscribe(email);
      if (result) {
        toast.success("Cảm ơn bạn đã đăng ký! Kiểm tra email của bạn.");
        setEmail("");
      }
    } catch (error) {
      toast.error("Error subscribing to newsletter");
    }
  };

  return (
    <section className={styles.newsletterBg} data-aos="zoom-in">
      <div className={styles.inner}>
        <div className={styles.iconCircle}>
          <EnvelopeSimple size={40} weight="duotone" />
        </div>
        <h2>
          Đăng ký nhận bản tin <span>TravelAi</span>
        </h2>
        <p>
          Tham gia cộng đồng 50,000+ người du lịch để nhận những mẹo hữu ích và
          ưu đãi độc quyền hàng tuần.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder="Địa chỉ email của bạn..."
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubscribing}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={isSubscribing}
          >
            {isSubscribing ? "Đang đăng ký..." : "Đăng ký ngay"}{" "}
            <PaperPlaneRight size={20} weight="bold" />
          </button>
        </form>

        <span className={styles.privacy}>
          * Chúng tôi cam kết bảo mật thông tin và không gửi spam.
        </span>
      </div>
    </section>
  );
};

export default Newsletter;
