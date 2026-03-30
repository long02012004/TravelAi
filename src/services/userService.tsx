import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface UserData {
  id: string;
  username: string;
  email: string;
  password?: string;
  accessToken?: string;
}

export interface BackendResponse<T = unknown> {
  EC: number;
  EM: string;
  DT: T;
}

// 1. Đăng ký
export const postSignUp = (
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

// 2. Đăng nhập
export const postLogin = (
  email: string,
  pass: string,
): Promise<AxiosResponse<BackendResponse<UserData[]>>> => {
  return instance.get<BackendResponse<UserData[]>>(
    `/users?email=${email}&password=${pass}`,
  );
};

// 3. Đăng nhập Google
export const postLoginGoogle = (
  token: string,
): Promise<AxiosResponse<BackendResponse<UserData>>> => {
  return instance.post<BackendResponse<UserData>>("/google-login", {
    token,
  });
};

// 4. Quên mật khẩu & Cập nhật mật khẩu mới (Đã chuẩn hóa Type)
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
    // B2: Cập nhật mật khẩu mới qua PATCH (chỉ ghi đè trường password)
    return instance.patch<BackendResponse<UserData>>(`/users/${user.id}`, {
      password: newPass,
    });
  } else {
    // Trả về lỗi theo format chuẩn để FE dễ xử lý toast
    return {
      data: {
        EC: -1,
        EM: "Email không tồn tại trên hệ thống!",
        DT: null,
      },
    } as AxiosResponse<BackendResponse<null>>;
  }
};
