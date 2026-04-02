import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface Booking {
  id: number;
  userId: string;
  itemType: "hotel" | "restaurant" | "tour" | "activity";
  itemId: number;
  itemName: string;
  bookingDate: string;
  startDate: string;
  endDate?: string;
  numberOfGuests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "unpaid" | "paid" | "refunded";
  customerNotes?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  itemType: "hotel" | "restaurant" | "tour" | "activity";
  itemId: number;
  startDate: string;
  endDate?: string;
  numberOfGuests: number;
  totalPrice: number;
  customerNotes?: string;
  specialRequests?: string;
}

export interface UpdateBookingRequest {
  startDate?: string;
  endDate?: string;
  numberOfGuests?: number;
  totalPrice?: number;
  customerNotes?: string;
  specialRequests?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
}

export interface Notification {
  id: number;
  userId: string;
  type: "booking" | "review" | "message" | "promotion" | "system";
  title: string;
  content: string;
  image?: string;
  relatedId?: number;
  read: boolean;
  createdAt: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  currency: string;
  method:
    | "credit_card"
    | "debit_card"
    | "paypal"
    | "bank_transfer"
    | "e_wallet";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UploadResponse {
  url: string;
  publicId: string;
  size: number;
  type: string;
}

// === BOOKING OPERATIONS ===

// 1. Tạo đặt chỗ mới
export const createBooking = (
  request: CreateBookingRequest,
): Promise<AxiosResponse<BackendResponse<Booking>>> => {
  return instance.post<BackendResponse<Booking>>("/api/bookings", request);
};

// 2. Lấy danh sách đặt chỗ của user
export const getUserBookings = (
  skip = 0,
  limit = 10,
  status?: string,
): Promise<AxiosResponse<BackendResponse<Booking[]>>> => {
  const url = status
    ? `/api/bookings?skip=${skip}&limit=${limit}&status=${status}`
    : `/api/bookings?skip=${skip}&limit=${limit}`;
  return instance.get<BackendResponse<Booking[]>>(url);
};

// 3. Lấy chi tiết đặt chỗ
export const getBookingDetail = (
  bookingId: number,
): Promise<AxiosResponse<BackendResponse<Booking>>> => {
  return instance.get<BackendResponse<Booking>>(`/api/bookings/${bookingId}`);
};

// 4. Cập nhật đặt chỗ
export const updateBooking = (
  bookingId: number,
  request: UpdateBookingRequest,
): Promise<AxiosResponse<BackendResponse<Booking>>> => {
  return instance.patch<BackendResponse<Booking>>(
    `/api/bookings/${bookingId}`,
    request,
  );
};

// 5. Hủy đặt chỗ
export const cancelBooking = (
  bookingId: number,
  reason?: string,
): Promise<AxiosResponse<BackendResponse<Booking>>> => {
  return instance.patch<BackendResponse<Booking>>(
    `/api/bookings/${bookingId}/cancel`,
    { reason },
  );
};

// 6. Xác nhận đặt chỗ
export const confirmBooking = (
  bookingId: number,
): Promise<AxiosResponse<BackendResponse<Booking>>> => {
  return instance.patch<BackendResponse<Booking>>(
    `/api/bookings/${bookingId}/confirm`,
  );
};

// === NOTIFICATION OPERATIONS ===

// 7. Lấy danh sách thông báo
export const getNotifications = (
  skip = 0,
  limit = 10,
  read?: boolean,
): Promise<AxiosResponse<BackendResponse<Notification[]>>> => {
  const url =
    read !== undefined
      ? `/api/notifications?skip=${skip}&limit=${limit}&read=${read}`
      : `/api/notifications?skip=${skip}&limit=${limit}`;
  return instance.get<BackendResponse<Notification[]>>(url);
};

// 8. Đánh dấu thông báo là đã đọc
export const markNotificationAsRead = (
  notificationId: number,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.patch<BackendResponse<{ success: boolean }>>(
    `/api/notifications/${notificationId}/read`,
  );
};

// 9. Đánh dấu tất cả thông báo là đã đọc
export const markAllNotificationsAsRead = (): Promise<
  AxiosResponse<BackendResponse<{ success: boolean }>>
> => {
  return instance.patch<BackendResponse<{ success: boolean }>>(
    "/api/notifications/read-all",
  );
};

// 10. Xóa thông báo
export const deleteNotification = (
  notificationId: number,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.delete<BackendResponse<{ success: boolean }>>(
    `/api/notifications/${notificationId}`,
  );
};

// 11. Xóa tất cả thông báo
export const deleteAllNotifications = (): Promise<
  AxiosResponse<BackendResponse<{ success: boolean }>>
> => {
  return instance.delete<BackendResponse<{ success: boolean }>>(
    "/api/notifications",
  );
};

// 12. Lấy số lượng thông báo chưa đọc
export const getUnreadNotificationsCount = (): Promise<
  AxiosResponse<BackendResponse<{ count: number }>>
> => {
  return instance.get<BackendResponse<{ count: number }>>(
    "/api/notifications/unread-count",
  );
};

// === PAYMENT OPERATIONS ===

// 13. Tạo thanh toán cho đặt chỗ
export const createPayment = (
  bookingId: number,
  method: string,
): Promise<AxiosResponse<BackendResponse<Payment>>> => {
  return instance.post<BackendResponse<Payment>>("/api/payments", {
    bookingId,
    method,
  });
};

// 14. Lấy chi tiết thanh toán
export const getPaymentDetail = (
  paymentId: number,
): Promise<AxiosResponse<BackendResponse<Payment>>> => {
  return instance.get<BackendResponse<Payment>>(`/api/payments/${paymentId}`);
};

// 15. Lấy lịch sử thanh toán của user
export const getUserPaymentHistory = (
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<Payment[]>>> => {
  return instance.get<BackendResponse<Payment[]>>(
    `/api/payments/history?skip=${skip}&limit=${limit}`,
  );
};

// 16. Hoàn lại tiền cho thanh toán
export const refundPayment = (
  paymentId: number,
  reason?: string,
): Promise<AxiosResponse<BackendResponse<Payment>>> => {
  return instance.post<BackendResponse<Payment>>(
    `/api/payments/${paymentId}/refund`,
    { reason },
  );
};

// === FILE UPLOAD ===

// 17. Tải lên hình ảnh
export const uploadImage = (
  file: File,
  folder?: string,
): Promise<AxiosResponse<BackendResponse<UploadResponse>>> => {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);

  return instance.post<BackendResponse<UploadResponse>>(
    "/api/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

// 18. Tải lên nhiều hình ảnh
export const uploadMultipleImages = (
  files: File[],
  folder?: string,
): Promise<AxiosResponse<BackendResponse<UploadResponse[]>>> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  if (folder) formData.append("folder", folder);

  return instance.post<BackendResponse<UploadResponse[]>>(
    "/api/upload/images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

// 19. Tải lên tài liệu
export const uploadDocument = (
  file: File,
  folder?: string,
): Promise<AxiosResponse<BackendResponse<UploadResponse>>> => {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);

  return instance.post<BackendResponse<UploadResponse>>(
    "/api/upload/document",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

// 20. Xóa ảnh/tài liệu đã tải lên
export const deleteUploadedFile = (
  publicId: string,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.delete<BackendResponse<{ success: boolean }>>(
    `/api/upload/${publicId}`,
  );
};
