import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  isFeatured?: boolean;
  author?: string;
  authorAvatar?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  shares?: number;
  relatedNews?: NewsItem[];
}

export interface NewsCategory {
  name: string;
  icon?: string;
  slug: string;
  count: number;
}

export interface CreateNewsRequest {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags?: string[];
}

export interface UpdateNewsRequest {
  title?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  category?: string;
  tags?: string[];
  isFeatured?: boolean;
}

// === NEWS ARTICLE OPERATIONS ===

// 1. Lấy danh sách tất cả bài viết
export const getAllNews = (
  skip = 0,
  limit = 10,
  sortBy = "date",
): Promise<AxiosResponse<BackendResponse<NewsItem[]>>> => {
  return instance.get<BackendResponse<NewsItem[]>>(
    `/api/news?skip=${skip}&limit=${limit}&sortBy=${sortBy}`,
  );
};

// 2. Lấy bài viết nổi bật (featured)
export const getFeaturedNews = (
  limit = 5,
): Promise<AxiosResponse<BackendResponse<NewsItem[]>>> => {
  return instance.get<BackendResponse<NewsItem[]>>(
    `/api/news/featured?limit=${limit}`,
  );
};

// 3. Lấy chi tiết một bài viết
export const getNewsDetail = (
  newsId: number,
): Promise<AxiosResponse<BackendResponse<NewsItem>>> => {
  return instance.get<BackendResponse<NewsItem>>(`/api/news/${newsId}`);
};

// 4. Lấy bài viết theo danh mục
export const getNewsByCategory = (
  category: string,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<NewsItem[]>>> => {
  return instance.get<BackendResponse<NewsItem[]>>(
    `/api/news/category/${category}?skip=${skip}&limit=${limit}`,
  );
};

// 5. Tìm kiếm bài viết
export const searchNews = (
  keyword: string,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<NewsItem[]>>> => {
  return instance.get<BackendResponse<NewsItem[]>>(
    `/api/news/search?keyword=${keyword}&skip=${skip}&limit=${limit}`,
  );
};

// 6. Lấy bài viết liên quan
export const getRelatedNews = (
  newsId: number,
  limit = 5,
): Promise<AxiosResponse<BackendResponse<NewsItem[]>>> => {
  return instance.get<BackendResponse<NewsItem[]>>(
    `/api/news/${newsId}/related?limit=${limit}`,
  );
};

// === NEWS MANAGEMENT (Admin) ===

// 7. Tạo bài viết mới (admin only)
export const createNews = (
  request: CreateNewsRequest,
): Promise<AxiosResponse<BackendResponse<NewsItem>>> => {
  return instance.post<BackendResponse<NewsItem>>("/api/news", request);
};

// 8. Cập nhật bài viết (admin only)
export const updateNews = (
  newsId: number,
  request: UpdateNewsRequest,
): Promise<AxiosResponse<BackendResponse<NewsItem>>> => {
  return instance.patch<BackendResponse<NewsItem>>(
    `/api/news/${newsId}`,
    request,
  );
};

// 9. Xóa bài viết (admin only)
export const deleteNews = (
  newsId: number,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.delete<BackendResponse<{ success: boolean }>>(
    `/api/news/${newsId}`,
  );
};

// === NEWS CATEGORIES ===

// 10. Lấy danh sách danh mục bài viết
export const getNewsCategories = (): Promise<
  AxiosResponse<BackendResponse<NewsCategory[]>>
> => {
  return instance.get<BackendResponse<NewsCategory[]>>("/api/news/categories");
};

// 11. Tạo danh mục mới (admin only)
export const createNewsCategory = (
  name: string,
  icon?: string,
): Promise<AxiosResponse<BackendResponse<NewsCategory>>> => {
  return instance.post<BackendResponse<NewsCategory>>("/api/news/categories", {
    name,
    icon,
  });
};

// === NEWS INTERACTIONS ===

// 12. Thích bài viết
export const likeNews = (
  newsId: number,
): Promise<AxiosResponse<BackendResponse<{ likes: number }>>> => {
  return instance.post<BackendResponse<{ likes: number }>>(
    `/api/news/${newsId}/like`,
  );
};

// 13. Bỏ thích bài viết
export const unlikeNews = (
  newsId: number,
): Promise<AxiosResponse<BackendResponse<{ likes: number }>>> => {
  return instance.delete<BackendResponse<{ likes: number }>>(
    `/api/news/${newsId}/like`,
  );
};

// 14. Chia sẻ bài viết
export const shareNews = (
  newsId: number,
  platform: "facebook" | "twitter" | "email" | "link",
): Promise<AxiosResponse<BackendResponse<{ shares: number }>>> => {
  return instance.post<BackendResponse<{ shares: number }>>(
    `/api/news/${newsId}/share`,
    { platform },
  );
};

// === NEWS SUBSCRIPTION ===

// 15. Đăng ký nhận bài viết (newsletter subscription)
export const subscribeNewsletter = (
  email: string,
  categories?: string[],
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.post<BackendResponse<{ success: boolean }>>(
    "/api/news/subscribe",
    { email, categories },
  );
};

// 16. Hủy đăng ký nhận bài viết
export const unsubscribeNewsletter = (
  email: string,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.post<BackendResponse<{ success: boolean }>>(
    "/api/news/unsubscribe",
    { email },
  );
};

// === NEWS COMMENTS ===

// 17. Lấy bình luận của bài viết
export const getNewsComments = (
  newsId: number,
  skip = 0,
  limit = 10,
): Promise<AxiosResponse<BackendResponse<unknown[]>>> => {
  return instance.get<BackendResponse<unknown[]>>(
    `/api/news/${newsId}/comments?skip=${skip}&limit=${limit}`,
  );
};

// 18. Thêm bình luận vào bài viết
export const createNewsComment = (
  newsId: number,
  content: string,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  return instance.post<BackendResponse<unknown>>(
    `/api/news/${newsId}/comments`,
    { content },
  );
};

// 19. Xóa bình luận
export const deleteNewsComment = (
  newsId: number,
  commentId: number,
): Promise<AxiosResponse<BackendResponse<{ success: boolean }>>> => {
  return instance.delete<BackendResponse<{ success: boolean }>>(
    `/api/news/${newsId}/comments/${commentId}`,
  );
};

// === POPULAR & TRENDING ===

// 20. Lấy bài viết phổ biến
export const getPopularNews = (
  limit = 10,
  timeRange = "month",
): Promise<AxiosResponse<BackendResponse<NewsItem[]>>> => {
  return instance.get<BackendResponse<NewsItem[]>>(
    `/api/news/popular?limit=${limit}&timeRange=${timeRange}`,
  );
};

// 21. Lấy bài viết đang trending
export const getTrendingNews = (
  limit = 5,
): Promise<AxiosResponse<BackendResponse<NewsItem[]>>> => {
  return instance.get<BackendResponse<NewsItem[]>>(
    `/api/news/trending?limit=${limit}`,
  );
};
