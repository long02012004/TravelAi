import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  initial: string;
  color: string;
  text: string;
  delay: string;
}

// Lấy danh sách đánh giá khách hàng
export const getTestimonials = (): Promise<
  AxiosResponse<BackendResponse<TestimonialItem[]>>
> => {
  return instance.get<BackendResponse<TestimonialItem[]>>("/testimonials");
};
