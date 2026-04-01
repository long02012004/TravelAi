import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface HighlightItem {
  id: string;
  title: string;
  location: string;
  rating: string;
  reviews: string;
  img: string;
  desc: string;
  type: string;
}

// Lấy danh sách địa điểm nổi bật
export const getHighlightLocations = (): Promise<
  AxiosResponse<BackendResponse<HighlightItem[]>>
> => {
  return instance.get<BackendResponse<HighlightItem[]>>("/highlight_locations");
};

// Lấy danh sách khách sạn nổi bật
export const getHighlightHotels = (): Promise<
  AxiosResponse<BackendResponse<HighlightItem[]>>
> => {
  return instance.get<BackendResponse<HighlightItem[]>>("/highlight_hotels");
};

// Lấy danh sách nhà hàng nổi bật
export const getHighlightRestaurants = (): Promise<
  AxiosResponse<BackendResponse<HighlightItem[]>>
> => {
  return instance.get<BackendResponse<HighlightItem[]>>(
    "/highlight_restaurants",
  );
};
