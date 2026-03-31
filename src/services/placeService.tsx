import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface Province {
  id: number;
  name: string;
  region?: string;
  slug?: string;
}

export interface Place {
  id: number;
  title: string;
  location: string;
  description?: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  thumbnail?: string;
  images?: string[];
  gallery?: string[];
  distance?: string;
  services?: {
    hotels?: Place[];
    restaurants?: Place[];
    tours?: Place[];
  };
  price?: number;
  priceRange?: string;
  visitTime?: string;
  openingHours?: string;
  contact?: string;
  website?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  provinceId?: number;
  province?: Province;
  createdAt?: string;
  updatedAt?: string;

  // Extended fields from backend destination response
  name?: string;
  address?: string;
  tips?: {
    icon: string;
    title: string;
    content: string;
  }[];
  weather?: {
    temp: number;
    description: string;
    icon: string;
  };
  travelTime?: string;
  mapScreenshot?: string;
  quickInfo?: {
    id: number;
    label: string;
    value: string;
  }[];
  reviewsData?: {
    average: number;
    total: number;
    breakdown: { stars: number; percentage: number }[];
    list: {
      user: string;
      avatar: string;
      rating: number;
      date: string;
      tag: string;
      content: string;
      images?: string[];
    }[];
  };
}

export interface Destination {
  id: number;
  title: string;
  slug: string;
  location: string;
  category: string;
  description: string;
  heroImage: string;
  gallery?: string[];
  rating?: number;
  reviewCount?: number;
  distance?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  weather?: {
    temp: number;
    description: string;
    icon: string;
  };
  travelTime?: {
    fromHanoi: string;
    fromHCM: string;
  };
  bestTime?: string;
  thingsToKnow?: string[];
  services?: {
    hotels: Place[];
    restaurants: Place[];
    tours: Place[];
  };
  reviews?: unknown[];
  relatedDestinations?: Destination[];
}

export interface SearchPlaceParams {
  category?: string;
  region?: string;
  search?: string;
  skip?: number;
  limit?: number;
  sortBy?: string;
}

// === PROVINCE Operations ===

// 1. Lấy danh sách tất cả tỉnh/thành phố
export const getAllProvinces = (): Promise<
  AxiosResponse<BackendResponse<Province[]>>
> => {
  return instance.get<BackendResponse<Province[]>>("/api/places/provinces");
};

// === PLACE Operations ===

// 2. Lấy danh sách địa điểm theo tỉnh/thành phố
export const getPlacesByProvince = (
  provinceId: number,
): Promise<AxiosResponse<BackendResponse<Place[]>>> => {
  return instance.get<BackendResponse<Place[]>>(
    `/api/places/by-province/${provinceId}`,
  );
};

// 3. Lấy danh sách địa điểm theo danh mục
export const getPlacesByCategory = (
  category: string,
): Promise<AxiosResponse<BackendResponse<Place[]>>> => {
  return instance.get<BackendResponse<Place[]>>(
    `/api/places/category/${category}`,
  );
};

// 4. Lấy chi tiết địa điểm
export const getPlaceDetail = (
  placeId: number | string,
): Promise<AxiosResponse<BackendResponse<Place>>> => {
  return instance.get<BackendResponse<Place>>(`/api/places/${placeId}`);
};

// === DESTINATION Operations ===

// 5. Tìm kiếm và lọc địa điểm
export const searchPlaces = (
  params: SearchPlaceParams,
): Promise<AxiosResponse<BackendResponse<Place[]>>> => {
  const queryParams = new URLSearchParams();

  if (params.category) queryParams.append("category", params.category);
  if (params.region) queryParams.append("region", params.region);
  if (params.search) queryParams.append("search", params.search);
  if (params.skip !== undefined)
    queryParams.append("skip", params.skip.toString());
  if (params.limit !== undefined)
    queryParams.append("limit", params.limit.toString());
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);

  const queryString = queryParams.toString();
  const url = queryString ? `/api/places?${queryString}` : "/api/places";

  return instance.get<BackendResponse<Place[]>>(url);
};

// 6. Lấy danh sách tất cả các địa điểm (với pagination)
export const getAllPlaces = (
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<Place[]>>> => {
  return instance.get<BackendResponse<Place[]>>(
    `/api/places?skip=${skip}&limit=${limit}`,
  );
};

// === FAVORITE Operations ===

// 7. Thêm địa điểm vào danh sách yêu thích
export const addPlaceToFavorite = (
  placeId: number,
): Promise<
  AxiosResponse<BackendResponse<{ success: boolean; isFavorited: boolean }>>
> => {
  return instance.post<
    BackendResponse<{ success: boolean; isFavorited: boolean }>
  >(`/api/places/${placeId}/favorites`);
};

// 8. Bỏ địa điểm khỏi danh sách yêu thích
export const removePlaceFromFavorite = (
  placeId: number,
): Promise<
  AxiosResponse<BackendResponse<{ success: boolean; isFavorited: boolean }>>
> => {
  return instance.delete<
    BackendResponse<{ success: boolean; isFavorited: boolean }>
  >(`/api/places/${placeId}/favorites`);
};

// 9. Lấy danh sách các địa điểm yêu thích của user
export const getFavoritePlaces = (): Promise<
  AxiosResponse<BackendResponse<Place[]>>
> => {
  return instance.get<BackendResponse<Place[]>>("/api/places/favorites");
};

// === SEARCH & FILTER ===

// 10. Tìm kiếm điểm đến theo từ khóa
export const searchDestinations = (
  keyword: string,
): Promise<AxiosResponse<BackendResponse<Destination[]>>> => {
  return instance.get<BackendResponse<Destination[]>>(
    `/api/destinations/search?q=${keyword}`,
  );
};

// 11. Lấy điểm đến theo slug
export const getDestinationBySlug = (
  slug: string,
): Promise<AxiosResponse<BackendResponse<Destination>>> => {
  return instance.get<BackendResponse<Destination>>(
    `/api/destinations/${slug}`,
  );
};

// 12. Lấy các dịch vụ cho một điểm đến (khách sạn, nhà hàng, tour)
export const getDestinationServices = (
  destinationId: number,
  serviceType: "hotel" | "restaurant" | "tour",
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<Place[]>>> => {
  return instance.get<BackendResponse<Place[]>>(
    `/api/destinations/${destinationId}/services?type=${serviceType}&skip=${skip}&limit=${limit}`,
  );
};
