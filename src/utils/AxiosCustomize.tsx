import axios from "axios";
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

/**
 * ─── Axios Custom Instance ───────────────────────────────────────────
 * Cấu hình Axios instance với:
 * - base URL được đồng bộ lên port 8081 (theo yêu cầu người dùng)
 * - Interceptors cho request và response
 * - Tự động bọc dữ liệu trả về vào cấu trúc BackendResponse chuẩn { EC, EM, DT }
 * ─────────────────────────────────────────────────────────────────────
 */

// 1. Định nghĩa Interface cho cấu trúc trả về
interface BackendResponse<T = unknown> {
  EC: number;
  EM: string;
  DT: T;
}

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

const instance = axios.create({
  baseURL: "http://localhost:8081/",
});

// Interceptor cho Request
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    NProgress.start();
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    NProgress.done();
    return Promise.reject(error);
  },
);

// Interceptor cho Response
instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse<BackendResponse> => {
    NProgress.done();

    // Bọc dữ liệu trả về vào cấu trúc chuẩn để dễ dàng sử dụng ở frontend
    const customRes: BackendResponse = {
      EC: 0,
      EM: "Success",
      DT: response.data,
    };

    // Ép kiểu qua 'unknown' trước khi ép về BackendResponse
    return {
      ...response,
      data: customRes,
    } as unknown as AxiosResponse<BackendResponse>;
  },
  (error: AxiosError) => {
    NProgress.done();
    return Promise.reject(error);
  },
);

export default instance;
