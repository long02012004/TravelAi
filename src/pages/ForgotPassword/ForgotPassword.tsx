import React, { useState } from 'react';
import styles from './ForgotPassword.module.scss';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Gửi mã OTP tới email:", email);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.forgotCard}>
        {/* Left Side: Form */}
        <div className={styles.leftSide}>
          <h1 className={styles.title}>Quên mật khẩu?</h1>
          <p className={styles.subtitle}>
            Vui lòng nhập Email để nhận mã xác nhận OTP gồm 6 chữ số.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>EMAIL TÀI KHOẢN CỦA BẠN</label>
              <div className={styles.inputWrapper}>
                <i className="ph ph-envelope-simple"></i>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Gửi mã xác nhận
            </button>
          </form>

          <p className={styles.footerLink}>
            Bạn chợt nhớ ra mật khẩu? <a href="/login">Quay lại Đăng nhập ngay</a>
          </p>
        </div>

        {/* Right Side: Info */}
        <div className={styles.rightSide}>
          <h2 className={styles.rightTitle}>Lấy lại quyền truy cập.</h2>
          <p className={styles.rightSubtitle}>
            Đừng lo lắng! Nhập email tài khoản của bạn và làm theo hướng dẫn. Chúng tôi giúp bạn:
          </p>

          <ul className={styles.featureList}>
            <li>
              <div className={styles.iconBox}><i className="ph ph-paper-plane-tilt"></i></div>
              <span>Nhận đường dẫn khôi phục cấp tốc</span>
            </li>
            <li>
              <div className={styles.iconBox}><i className="ph ph-shield-check"></i></div>
              <span>Xác minh qua mã OTP 6 chữ số</span>
            </li>
            <li>
              <div className={styles.iconBox}><i className="ph ph-lock"></i></div>
              <span>Đặt lại mật khẩu mới an toàn tuyệt đối</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;