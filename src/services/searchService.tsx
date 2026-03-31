import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface SearchResultItem {
  id: number;
  title: string;
  location: string;
  type: "place" | "destination" | "hotel" | "restaurant";
  image: string;
  rating?: number;
  category?: string;
  price?: number;
}

export interface SearchFilters {
  keyword?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  distance?: number;
  province?: string;
  region?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  numberOfPeople?: number;
  skip?: number;
  limit?: number;
  sortBy?:
    | "relevance"
    | "rating"
    | "price_low"
    | "price_high"
    | "distance"
    | "trending";
}

export interface SearchResponse {
  total: number;
  results: SearchResultItem[];
  facets?: {
    categories: { name: string; count: number }[];
    locations: { name: string; count: number }[];
    priceRanges: { min: number; max: number; count: number }[];
  };
}

export interface AutocompleteResult {
  id: number;
  title: string;
  type: "place" | "destination" | "keyword";
  image?: string;
}

// === GLOBAL SEARCH ===

// 1. Tìm kiếm toàn cục
export const globalSearch = (
  filters: SearchFilters,
): Promise<AxiosResponse<BackendResponse<SearchResponse>>> => {
  const params = new URLSearchParams();

  if (filters.keyword) params.append("keyword", filters.keyword);
  if (filters.category) params.append("category", filters.category);
  if (filters.location) params.append("location", filters.location);
  if (filters.minPrice !== undefined)
    params.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice !== undefined)
    params.append("maxPrice", filters.maxPrice.toString());
  if (filters.rating !== undefined)
    params.append("rating", filters.rating.toString());
  if (filters.distance !== undefined)
    params.append("distance", filters.distance.toString());
  if (filters.province) params.append("province", filters.province);
  if (filters.region) params.append("region", filters.region);
  if (filters.tags && filters.tags.length > 0)
    params.append("tags", filters.tags.join(","));
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.numberOfPeople !== undefined)
    params.append("numberOfPeople", filters.numberOfPeople.toString());
  if (filters.skip !== undefined)
    params.append("skip", filters.skip.toString());
  if (filters.limit !== undefined)
    params.append("limit", filters.limit.toString());
  if (filters.sortBy) params.append("sortBy", filters.sortBy);

  return instance.get<BackendResponse<SearchResponse>>(
    `/api/search?${params.toString()}`,
  );
};

// 2. Tìm kiếm theo danh mục
export const searchByCategory = (
  category: string,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<SearchResultItem[]>>> => {
  return instance.get<BackendResponse<SearchResultItem[]>>(
    `/api/search/category/${category}?skip=${skip}&limit=${limit}`,
  );
};

// 3. Tìm kiếm theo vị trí
export const searchByLocation = (
  location: string,
  radius?: number,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<SearchResultItem[]>>> => {
  const url = radius
    ? `/api/search/location/${location}?radius=${radius}&skip=${skip}&limit=${limit}`
    : `/api/search/location/${location}?skip=${skip}&limit=${limit}`;

  return instance.get<BackendResponse<SearchResultItem[]>>(url);
};

// === ADVANCED SEARCH ===

// 4. Tìm kiếm với các bộ lọc nâng cao
export const advancedSearch = (
  keyword: string,
  filters: Omit<SearchFilters, "keyword">,
): Promise<AxiosResponse<BackendResponse<SearchResponse>>> => {
  return globalSearch({ ...filters, keyword });
};

// 5. Tìm kiếm theo ngân sách
export const searchByBudget = (
  minPrice: number,
  maxPrice: number,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<SearchResultItem[]>>> => {
  return instance.get<BackendResponse<SearchResultItem[]>>(
    `/api/search/budget?minPrice=${minPrice}&maxPrice=${maxPrice}&skip=${skip}&limit=${limit}`,
  );
};

// 6. Tìm kiếm theo đánh giá
export const searchByRating = (
  minRating: number,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<SearchResultItem[]>>> => {
  return instance.get<BackendResponse<SearchResultItem[]>>(
    `/api/search/rating?minRating=${minRating}&skip=${skip}&limit=${limit}`,
  );
};

// 7. Tìm kiếm theo ngày
export const searchByDateRange = (
  startDate: string,
  endDate: string,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<SearchResultItem[]>>> => {
  return instance.get<BackendResponse<SearchResultItem[]>>(
    `/api/search/date-range?startDate=${startDate}&endDate=${endDate}&skip=${skip}&limit=${limit}`,
  );
};

// === AUTOCOMPLETE & SUGGESTIONS ===

// 8. Autocomplete cho tìm kiếm
export const searchAutocomplete = (
  keyword: string,
  limit = 5,
): Promise<AxiosResponse<BackendResponse<AutocompleteResult[]>>> => {
  return instance.get<BackendResponse<AutocompleteResult[]>>(
    `/api/search/autocomplete?keyword=${keyword}&limit=${limit}`,
  );
};

// 9. Gợi ý tìm kiếm phổ biến
export const getPopularSearches = (
  limit = 10,
): Promise<AxiosResponse<BackendResponse<string[]>>> => {
  return instance.get<BackendResponse<string[]>>(
    `/api/search/popular?limit=${limit}`,
  );
};

// 10. Lấy danh sách tags/keywords phổ biến
export const getPopularTags = (): Promise<
  AxiosResponse<BackendResponse<string[]>>
> => {
  return instance.get<BackendResponse<string[]>>("/api/search/popular-tags");
};

// === SAVED SEARCHES ===

// 11. Lưu tìm kiếm
export const saveSearch = (
  name: string,
  filters: SearchFilters,
): Promise<AxiosResponse<BackendResponse<{ id: string; name: string }>>> => {
  return instance.post<BackendResponse<{ id: string; name: string }>>(
    "/api/search/saved",
    { name, filters },
  );
};

// 12. Lấy danh sách tìm kiếm đã lưu
export const getSavedSearches = (): Promise<
  AxiosResponse<
    BackendResponse<Array<{ id: string; name: string; filters: SearchFilters }>>
  >
> => {
  return instance.get<
    BackendResponse<Array<{ id: string; name: string; filters: SearchFilters }>>
  >("/api/search/saved");
};

// 13. Xóa tìm kiếm đã lưu
export const deleteSavedSearch = (
  searchId: string,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.delete<BackendResponse<{ success: boolean }>>(
    `/api/search/saved/${searchId}`,
  );
};

// === TRENDING & POPULAR ===

// 14. Lấy các điểm đến đang trending
export const getTrendingDestinations = (
  limit = 10,
): Promise<AxiosResponse<BackendResponse<SearchResultItem[]>>> => {
  return instance.get<BackendResponse<SearchResultItem[]>>(
    `/api/search/trending?limit=${limit}`,
  );
};

// 15. Lấy các điểm đến phổ biến
export const getPopularDestinations = (
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<SearchResultItem[]>>> => {
  return instance.get<BackendResponse<SearchResultItem[]>>(
    `/api/search/popular?skip=${skip}&limit=${limit}`,
  );
};

// 16. Lấy các điểm đến gần đây được xem
export const getRecentlyViewedDestinations = (
  limit = 5,
): Promise<AxiosResponse<BackendResponse<SearchResultItem[]>>> => {
  return instance.get<BackendResponse<SearchResultItem[]>>(
    `/api/search/recently-viewed?limit=${limit}`,
  );
};

// === FILTERS & FACETS ===

// 17. Lấy danh sách bộ lọc khả dụng
export const getAvailableFilters = (): Promise<
  AxiosResponse<
    BackendResponse<{
      categories: Array<{ name: string; count: number }>;
      locations: Array<{ name: string; count: number }>;
      priceRanges: Array<{ min: number; max: number; count: number }>;
      ratings: Array<{ value: number; count: number }>;
    }>
  >
> => {
  return instance.get<
    BackendResponse<{
      categories: Array<{ name: string; count: number }>;
      locations: Array<{ name: string; count: number }>;
      priceRanges: Array<{ min: number; max: number; count: number }>;
      ratings: Array<{ value: number; count: number }>;
    }>
  >("/api/search/filters");
};

// === SEARCH HISTORY ===

// 18. Lấy lịch sử tìm kiếm
export const getSearchHistory = (
  limit = 10,
): Promise<AxiosResponse<BackendResponse<string[]>>> => {
  return instance.get<BackendResponse<string[]>>(
    `/api/search/history?limit=${limit}`,
  );
};

// 19. Xóa lịch sử tìm kiếm
export const clearSearchHistory = (): Promise<
  AxiosResponse<BackendResponse<{ success: boolean }>>
> => {
  return instance.delete<BackendResponse<{ success: boolean }>>(
    "/api/search/history",
  );
};
