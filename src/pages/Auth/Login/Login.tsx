import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  EnvelopeSimple,
  Eye,
  EyeSlash,
  FacebookLogo,
  GoogleLogo,
  LockKey,
} from "phosphor-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "../../../hooks/useApi";
import type { LoginRequest } from "../../../services/userService";
import { postLogin, postLoginGoogle } from "../../../services/userService";
import styles from "./Login.module.scss";

interface Props {
  onToggle: () => void;
  navigate: (path: string) => void;
}

const Login: React.FC<Props> = ({ onToggle, navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Dùng mutation hook cho cleaner code
  const { mutate: login, loading: isLoading } = useMutation(
    (credentials: LoginRequest) => postLogin(credentials),
  );

  // 1. Xử lý đăng nhập Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await postLoginGoogle({
          token: tokenResponse.access_token,
        });
        if (response.data && response.data.EC === 0) {
          // Lưu token và user info
          const authData = response.data.DT;
          localStorage.setItem("accessToken", authData.accessToken);
          if (authData.refreshToken) {
            localStorage.setItem("refreshToken", authData.refreshToken);
          }
          localStorage.setItem("user", JSON.stringify(authData.user));
          toast.success("Đăng nhập Google thành công! 🚀");
          navigate("/");
        } else {
          toast.error(response.data.EM || "Lỗi đăng nhập Google!");
        }
      } catch (error) {
        toast.error("Lỗi đăng nhập Google!");
        console.error("Error logging in with Google:", error);
      }
    },
  });

  // 2. Xử lý đăng nhập Email/Password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Validation ---
    const cleanEmail = email.trim();
    const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!cleanEmail || !password) {
      return toast.error("Vui lòng nhập đầy đủ thông tin!");
    }
    if (!isValidEmail.test(cleanEmail)) {
      return toast.error("Email không đúng định dạng!");
    }

    try {
      const result = await login({ email: cleanEmail, password });
      if (result) {
        const authData = result.user;

        // Lưu thông tin vào LocalStorage
        localStorage.setItem("accessToken", result.accessToken);
        if (result.refreshToken) {
          localStorage.setItem("refreshToken", result.refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(authData));
        localStorage.setItem("username", authData.username);

        toast.success(`Chào mừng ${authData.username} trở lại! 👋`);
        navigate("/");
      } else {
        toast.error("Email hoặc mật khẩu không chính xác!");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error("Lỗi kết nối Server (8081)!");
      } else {
        toast.error("Đã xảy ra lỗi không xác định!");
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <h2>Chào mừng trở lại</h2>
        <p>Vui lòng nhập thông tin để truy cập</p>
      </div>

      <div className={styles.socialButtons}>
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.google}`}
          onClick={() => loginWithGoogle()}
          disabled={isLoading}
        >
          <GoogleLogo size={20} /> Google
        </button>
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.facebook}`}
        >
          <FacebookLogo weight="fill" size={20} /> Facebook
        </button>
      </div>

      <div className={styles.divider}>
        <span>Hoặc đăng nhập bằng email</span>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.group}>
          <div className={styles.labelRow}>
            <label>Email của bạn</label>
          </div>{" "}
          <div className={styles.inputWrap}>
            <EnvelopeSimple className={styles.icon} weight="duotone" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.labelRow}>
            <label>Mật khẩu</label>
            <Link to="/forgot-password" className={styles.forgotPass}>
              Quên mật khẩu?
            </Link>
          </div>
          <div className={styles.inputWrap}>
            <LockKey className={styles.icon} weight="duotone" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <span
              className={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlash weight="duotone" />
              ) : (
                <Eye weight="duotone" />
              )}
            </span>
          </div>
        </div>

        <button type="submit" className={styles.btnSubmit} disabled={isLoading}>
          {isLoading ? "Đang kiểm tra..." : "Đăng nhập"}
        </button>
      </form>

      <div className={styles.footer}>
        Bạn chưa có tài khoản?{" "}
        <button type="button" onClick={onToggle}>
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
};

export default Login;
