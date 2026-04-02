import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserProfile } from "../../services";
import styles from "./Profile.module.scss";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import ProfileSidebar from "./components/ProfileSidebar/ProfileSidebar";
import ProfileTabs from "./components/ProfileTabs/ProfileTabs";

interface UserProfile {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  fullName?: string;
  address?: string;
  bio?: string;
  avatar?: string;
  badge?: string;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Get user ID from localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Vui lòng đăng nhập lại");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id || user.userId;

      if (!userId) {
        toast.error("ID người dùng không hợp lệ");
        return;
      }

      const result = await getUserProfile(userId);
      if (result?.data?.DT) {
        setUserProfile(result.data.DT);
      } else {
        // Use user data from localStorage if API fails
        setUserProfile({
          id: userId,
          email: user.email,
          fullName: user.fullName || user.username,
          username: user.username,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Lỗi khi tải hồ sơ người dùng");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div data-aos="fade-down">
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <p>Đang tải hồ sơ...</p>
            </div>
          ) : (
            <ProfileHeader
              name={userProfile?.fullName || "Người dùng"}
              email={userProfile?.email || ""}
              badge={userProfile?.badge || "Thành viên"}
            />
          )}
        </div>

        <div data-aos="fade-in" data-aos-delay="200">
          <ProfileTabs />
        </div>

        <div className={styles.profileGrid}>
          <div
            className={styles.mainContent}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <ProfileForm title="Cập nhật thông tin" mode="info" />
            <ProfileForm title="Đổi mật khẩu" mode="password" />
          </div>

          <aside
            className={styles.sidebarSection}
            data-aos="fade-left"
            data-aos-delay="600"
          >
            <ProfileSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
