import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface Activity {
  time: string;
  activity: string;
  location: string;
  duration: string;
  estimatedCost: number;
  description: string;
  tips?: string;
}

export interface Meal {
  type: "breakfast" | "lunch" | "dinner";
  suggestion: string;
  price?: number;
}

export interface Accommodation {
  name: string;
  price: number;
  rating: number;
  description?: string;
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
  meals: Meal[];
  accommodation: Accommodation;
  totalDayBudget: number;
}

export interface GeneratedItinerary {
  id?: string;
  itinerary: DayItinerary[];
  totalBudget: number;
  totalCost: number;
  savings: number;
}

export interface GenerateTripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  numberOfPeople: number;
  interests: string[];
  budget: number;
  travelStyle: "adventure" | "relaxing" | "cultural" | "luxury" | "budget";
}

export interface TemplateItinerary {
  id: number;
  title: string;
  description: string;
  location: string;
  duration: number;
  durationText: string;
  price: number;
  maxPeople: number;
  rating: number;
  reviews: number;
  category: string;
  images: string[];
  steps: DayItinerary[];
  includedServices: string[];
  excludedServices: string[];
  bestTime: string;
  difficulty: "easy" | "moderate" | "hard";
  createdAt?: string;
  updatedAt?: string;
}

export interface ItineraryCategory {
  name: string;
  icon: string;
  count: number;
  slug: string;
}

// === AI ITINERARY GENERATION ===

// 1. Tạo lịch trình du lịch từ AI
export const generateItinerary = (
  request: GenerateTripRequest,
): Promise<AxiosResponse<BackendResponse<GeneratedItinerary>>> => {
  return instance.post<BackendResponse<GeneratedItinerary>>(
    "/api/ai/trips/generate",
    request,
  );
};

// === TEMPLATE ITINERARIES ===

// 2. Lấy danh sách tất cả các template itinerary
export const getAllItineraries = (
  category?: string,
  skip = 0,
  limit = 10,
  sortBy = "createdAt",
): Promise<AxiosResponse<BackendResponse<TemplateItinerary[]>>> => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  params.append("skip", skip.toString());
  params.append("limit", limit.toString());
  params.append("sortBy", sortBy);

  return instance.get<BackendResponse<TemplateItinerary[]>>(
    `/api/itineraries?${params.toString()}`,
  );
};

// 3. Lấy chi tiết một template itinerary
export const getItineraryDetail = (
  itineraryId: number,
): Promise<AxiosResponse<BackendResponse<TemplateItinerary>>> => {
  return instance.get<BackendResponse<TemplateItinerary>>(
    `/api/itineraries/${itineraryId}`,
  );
};

// 4. Tạo trip từ một template itinerary
export const createTripFromItinerary = (
  itineraryId: number,
  numberOfPeople?: number,
  startDate?: string,
): Promise<
  AxiosResponse<BackendResponse<{ tripId: number; tripData: unknown }>>
> => {
  const body: Record<string, unknown> = {};
  if (numberOfPeople !== undefined) body.numberOfPeople = numberOfPeople;
  if (startDate !== undefined) body.startDate = startDate;

  return instance.post<BackendResponse<{ tripId: number; tripData: unknown }>>(
    `/api/itineraries/${itineraryId}/create-trip`,
    body,
  );
};

// 5. Lấy danh sách các danh mục itinerary
export const getItineraryCategories = (): Promise<
  AxiosResponse<BackendResponse<ItineraryCategory[]>>
> => {
  return instance.get<BackendResponse<ItineraryCategory[]>>(
    "/api/itineraries/categories",
  );
};

// 6. Lấy các itinerary đang trending
export const getTrendingItineraries = (
  limit = 5,
): Promise<AxiosResponse<BackendResponse<TemplateItinerary[]>>> => {
  return instance.get<BackendResponse<TemplateItinerary[]>>(
    `/api/itineraries/trending?limit=${limit}`,
  );
};

// === SEARCH & FILTER ===

// 7. Tìm kiếm itinerary theo tiêu chí
export const searchItineraries = (
  keyword: string,
  location?: string,
  maxPrice?: number,
  maxPeople?: number,
): Promise<AxiosResponse<BackendResponse<TemplateItinerary[]>>> => {
  const params = new URLSearchParams();
  params.append("search", keyword);
  if (location) params.append("location", location);
  if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
  if (maxPeople !== undefined) params.append("maxPeople", maxPeople.toString());

  return instance.get<BackendResponse<TemplateItinerary[]>>(
    `/api/itineraries/search?${params.toString()}`,
  );
};

// 8. Lọc itinerary theo giá
export const getItinerariesByPriceRange = (
  minPrice: number,
  maxPrice: number,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<TemplateItinerary[]>>> => {
  return instance.get<BackendResponse<TemplateItinerary[]>>(
    `/api/itineraries/price?minPrice=${minPrice}&maxPrice=${maxPrice}&skip=${skip}&limit=${limit}`,
  );
};

// 9. Lấy itinerary theo vị trí
export const getItinerariesByLocation = (
  location: string,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<TemplateItinerary[]>>> => {
  return instance.get<BackendResponse<TemplateItinerary[]>>(
    `/api/itineraries/location/${location}?skip=${skip}&limit=${limit}`,
  );
};

// === RECOMMENDATION ===

// 10. Lấy các itinerary được đề xuất dựa trên preferences
export const getRecommendedItineraries = (
  interests: string[],
  budget: number,
  numberOfPeople: number,
): Promise<AxiosResponse<BackendResponse<TemplateItinerary[]>>> => {
  return instance.post<BackendResponse<TemplateItinerary[]>>(
    "/api/itineraries/recommendations",
    {
      interests,
      budget,
      numberOfPeople,
    },
  );
};

// 11. Lấy itinerary tương tự
export const getSimilarItineraries = (
  itineraryId: number,
  limit = 5,
): Promise<AxiosResponse<BackendResponse<TemplateItinerary[]>>> => {
  return instance.get<BackendResponse<TemplateItinerary[]>>(
    `/api/itineraries/${itineraryId}/similar?limit=${limit}`,
  );
};
