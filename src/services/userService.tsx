import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface UserData {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  badge?: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: UserData;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface FacebookAuthRequest {
  token: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

// === AUTHENTICATION ===

// 1. Đăng ký người dùng mới (Backend endpoint: POST /api/v1/auth/register)
export const postSignUp = (
  request: RegisterRequest,
): Promise<AxiosResponse<BackendResponse<AuthResponse>>> => {
  return instance.post<BackendResponse<AuthResponse>>(
    "/api/v1/auth/register",
    request,
  );
};

// 2. Đăng nhập (Backend endpoint: POST /api/v1/auth/login)
export const postLogin = (
  request: LoginRequest,
): Promise<AxiosResponse<BackendResponse<AuthResponse>>> => {
  return instance.post<BackendResponse<AuthResponse>>(
    "/api/v1/auth/login",
    request,
  );
};

// 3. Đăng nhập Google (Backend endpoint: POST /api/v1/auth/google)
export const postLoginGoogle = (
  request: GoogleAuthRequest,
): Promise<AxiosResponse<BackendResponse<AuthResponse>>> => {
  return instance.post<BackendResponse<AuthResponse>>(
    "/api/v1/auth/google",
    request,
  );
};

// 4. Đăng nhập Facebook (Backend endpoint: POST /api/v1/auth/facebook)
export const postLoginFacebook = (
  request: FacebookAuthRequest,
): Promise<AxiosResponse<BackendResponse<AuthResponse>>> => {
  return instance.post<BackendResponse<AuthResponse>>(
    "/api/v1/auth/facebook",
    request,
  );
};

// 5. Đăng xuất (Backend endpoint: POST /api/v1/auth/logout)
export const postLogout = (): Promise<AxiosResponse<BackendResponse<null>>> => {
  return instance.post<BackendResponse<null>>("/api/v1/auth/logout");
};

// 6. Làm mới token (Backend endpoint: POST /api/v1/auth/refresh-token)
export const refreshToken = (
  refreshToken: string,
): Promise<AxiosResponse<BackendResponse<AuthResponse>>> => {
  return instance.post<BackendResponse<AuthResponse>>(
    "/api/v1/auth/refresh-token",
    { refreshToken },
  );
};

// 7. Gửi OTP (Backend endpoint: POST /api/v1/auth/send-otp)
export const sendOTP = (
  email: string,
): Promise<
  AxiosResponse<BackendResponse<{ success: boolean; message: string }>>
> => {
  return instance.post<BackendResponse<{ success: boolean; message: string }>>(
    "/api/v1/auth/send-otp",
    { email },
  );
};

// 8. Xác thực email bằng OTP (Backend endpoint: POST /api/v1/auth/verify-email)
export const verifyEmail = (
  email: string,
  otp: string,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.post<BackendResponse<{ success: boolean }>>(
    "/api/v1/auth/verify-email",
    { email, otp },
  );
};

// === LEGACY: Quên mật khẩu & Cập nhật mật khẩu (for backward compatibility) ===

// 9. Quên mật khẩu & Cập nhật mật khẩu mới
export const updatePasswordByEmail = async (
  email: string,
  newPass: string,
): Promise<AxiosResponse<BackendResponse<UserData | null>>> => {
  // B1: Tìm user theo email
  const res = await instance.get<BackendResponse<UserData[]>>(
    `/users?email=${email}`,
  );
  const users = res.data.DT;

  if (users && users.length > 0) {
    const user = users[0];
    // B2: Cập nhật mật khẩu mới qua PATCH
    return instance.patch<BackendResponse<UserData>>(`/users/${user.id}`, {
      password: newPass,
    });
  } else {
    // Trả về lỗi theo format chuẩn
    return {
      data: {
        EC: -1,
        EM: "Email không tồn tại trên hệ thống!",
        DT: null,
      },
    } as AxiosResponse<BackendResponse<null>>;
  }
};

// === USER PROFILE MANAGEMENT ===

// 10. Lấy thông tin profile của user hiện tại
export const getUserProfile = (
  userId: string,
): Promise<AxiosResponse<BackendResponse<UserData>>> => {
  return instance.get<BackendResponse<UserData>>(`/api/v1/users/${userId}`);
};

// 11. Cập nhật thông tin profile
export const updateUserProfile = (
  userId: string,
  updates: UpdateProfileRequest,
): Promise<AxiosResponse<BackendResponse<UserData>>> => {
  return instance.patch<BackendResponse<UserData>>(
    `/api/v1/users/${userId}`,
    updates,
  );
};

// 12. Xóa tài khoản người dùng
export const deleteUserAccount = (
  userId: string,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.delete<BackendResponse<{ success: boolean }>>(
    `/api/v1/users/${userId}`,
  );
};

// 13. Thay đổi mật khẩu
export const changePassword = (
  userId: string,
  oldPassword: string,
  newPassword: string,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.post<BackendResponse<{ success: boolean }>>(
    `/api/v1/users/${userId}/change-password`,
    { oldPassword, newPassword },
  );
};

// 14. Lấy danh sách tất cả users (admin only)
export const getAllUsers = (
  skip = 0,
  limit = 10,
  search?: string,
): Promise<
  AxiosResponse<BackendResponse<{ total: number; users: UserData[] }>>
> => {
  const params = new URLSearchParams();
  params.append("skip", skip.toString());
  params.append("limit", limit.toString());
  if (search) params.append("search", search);

  return instance.get<BackendResponse<{ total: number; users: UserData[] }>>(
    `/api/v1/users?${params.toString()}`,
  );
};

// === LEGACY: Old auth endpoints (keep for backward compatibility if needed) ===

// 15. Đăng ký (legacy - old endpoint)
export const legacyPostSignUp = (
  username: string,
  email: string,
  pass: string,
): Promise<AxiosResponse<BackendResponse<UserData>>> => {
  return instance.post<BackendResponse<UserData>>("/users", {
    username,
    email,
    password: pass,
    createdAt: new Date().toISOString(),
  });
};

// 16. Đăng nhập (legacy - old endpoint)
export const legacyPostLogin = (
  email: string,
  pass: string,
): Promise<AxiosResponse<BackendResponse<UserData[]>>> => {
  return instance.get<BackendResponse<UserData[]>>(
    `/users?email=${email}&password=${pass}`,
  );
};

// 17. Đăng nhập Google (legacy - old endpoint)
export const legacyPostLoginGoogle = (
  token: string,
): Promise<AxiosResponse<BackendResponse<UserData>>> => {
  return instance.post<BackendResponse<UserData>>("/google-login", {
    token,
  });
};
