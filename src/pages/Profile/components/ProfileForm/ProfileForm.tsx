import React, { useState } from "react";
import { toast } from "react-toastify";
import { useMutation } from "../../../../hooks/useApi";
import { changePassword, updateUserProfile } from "../../../../services";
import styles from "./ProfileForm.module.scss";

interface ProfileFormProps {
  title: string;
  mode: "info" | "password";
  onSuccess?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  title,
  mode,
  onSuccess,
}) => {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  // Info form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Mutations
  const { mutate: updateInfo, loading: isUpdatingInfo } = useMutation(
    async (data) => {
      const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
      if (!userId) {
        toast.error("Vui lòng đăng nhập lại");
        return null;
      }
      return updateUserProfile(userId, data);
    },
  );

  const { mutate: changePass, loading: isChangingPassword } = useMutation(
    async (data) => {
      const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
      if (!userId) {
        toast.error("Vui lòng đăng nhập lại");
        return null;
      }
      return changePassword(userId, data.oldPassword, data.newPassword);
    },
  );

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() && !phone && !address && !bio) {
      toast.error("Vui lòng nhập ít nhất một thông tin");
      return;
    }

    try {
      const result = await updateInfo({
        fullName: fullName || undefined,
        phone: phone || undefined,
        address: address || undefined,
        bio: bio || undefined,
      });

      if (result?.data) {
        toast.success("Cập nhật thông tin thành công!");
        onSuccess?.();
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền tất cả các trường mật khẩu");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      const result = await changePass({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      if (result?.data) {
        toast.success("Đổi mật khẩu thành công!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onSuccess?.();
      }
    } catch (error) {
      toast.error("Mật khẩu hiện tại không chính xác");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (mode === "info") {
      handleInfoSubmit(e);
    } else {
      handlePasswordSubmit(e);
    }
  };

  return (
    <div className={styles.sectionCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <i
            className={
              mode === "info" ? "ph-fill ph-user-circle" : "ph-fill ph-lock-key"
            }
          ></i>
        </div>
        <div className={styles.cardHeaderText}>
          <h3>{title}</h3>
          <p>
            {mode === "info"
              ? "Quản lý thông tin cá nhân của bạn"
              : "Cập nhật mật khẩu để bảo vệ tài khoản"}
          </p>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === "info" ? (
          <div className={styles.fieldsGrid}>
            <div className={styles.formGroup}>
              <label>Họ và tên</label>
              <div className={styles.inputWrapper}>
                <i className="ph-bold ph-user"></i>
                <input
                  type="text"
                  placeholder="Nhập họ tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isUpdatingInfo}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Số điện thoại</label>
              <div className={styles.inputWrapper}>
                <i className="ph-bold ph-phone"></i>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isUpdatingInfo}
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
              <label>Địa chỉ</label>
              <div className={styles.inputWrapper}>
                <i className="ph-bold ph-map-pin"></i>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isUpdatingInfo}
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
              <label>Giới thiệu bản thân</label>
              <textarea
                rows={4}
                placeholder="Viết vài dòng giới thiệu về bạn..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isUpdatingInfo}
              />
            </div>
          </div>
        ) : (
          <div className={styles.passwordFields}>
            <div className={styles.formGroup}>
              <label>Mật khẩu hiện tại</label>
              <div className={styles.inputWrapper}>
                <i className="ph-bold ph-key"></i>
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="********"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowCurrent(!showCurrent)}
                  disabled={isChangingPassword}
                >
                  <i
                    className={
                      showCurrent ? "ph-bold ph-eye-slash" : "ph-bold ph-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>
            <div className={styles.passwordRow}>
              <div className={styles.formGroup}>
                <label>Mật khẩu mới</label>
                <div className={styles.inputWrapper}>
                  <i className="ph-bold ph-password"></i>
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="********"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowNew(!showNew)}
                    disabled={isChangingPassword}
                  >
                    <i
                      className={
                        showNew ? "ph-bold ph-eye-slash" : "ph-bold ph-eye"
                      }
                    ></i>
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Xác nhận mật khẩu</label>
                <div className={styles.inputWrapper}>
                  <i className="ph-bold ph-check-circle"></i>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowConfirm(!showConfirm)}
                    disabled={isChangingPassword}
                  >
                    <i
                      className={
                        showConfirm ? "ph-bold ph-eye-slash" : "ph-bold ph-eye"
                      }
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.formFooter}>
          <button
            type="submit"
            className={
              mode === "info" ? styles.btnPrimary : styles.btnSecondary
            }
            disabled={isUpdatingInfo || isChangingPassword}
          >
            {mode === "info" ? (
              <>
                <i className="ph-bold ph-check"></i>{" "}
                {isUpdatingInfo ? "Đang lưu..." : "Lưu thay đổi"}
              </>
            ) : (
              <>
                <i className="ph-bold ph-shield-check"></i>{" "}
                {isChangingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
