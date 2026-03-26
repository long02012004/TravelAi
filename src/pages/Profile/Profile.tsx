import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./Profile.module.scss";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs/ProfileTabs";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import ProfileSidebar from "./components/ProfileSidebar/ProfileSidebar";

const Profile: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div data-aos="fade-down">
          <ProfileHeader
            name="Hồ Thế Anh"
            email="anh.ho@example.com"
            badge="Thành viên Vàng"
          />
        </div>

        <div data-aos="fade-in" data-aos-delay="200">
          <ProfileTabs />
        </div>

        <div className={styles.profileGrid}>
          <div className={styles.mainContent} data-aos="fade-up" data-aos-delay="400">
            <ProfileForm title="Cập nhật thông tin" mode="info" />
            <ProfileForm title="Đổi mật khẩu" mode="password" />
          </div>

          <aside className={styles.sidebarSection} data-aos="fade-left" data-aos-delay="600">
            <ProfileSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
