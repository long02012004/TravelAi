import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getAllNews, getFeaturedNews, getTrendingNews } from "../../services";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";
import FeaturedPost from "./components/FeaturedPost/FeaturedPost";
import NewsCard from "./components/NewsCard/NewsCard";
import Newsletter from "./components/Newsletter/Newsletter";
import NewsSidebar from "./components/NewsSidebar/NewsSidebar";
import styles from "./News.module.scss";
import type { NewsItem } from "./types";

const News: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [featured, setFeatured] = useState<NewsItem | null>(null);
  const [trendingNews, setTrendingNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const ITEMS_PER_PAGE = 6;
  const categories = [
    "Tất cả",
    "Điểm đến",
    "Ẩm thực",
    "Mẹo du lịch",
    "Sự kiện",
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-quad",
    });
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Fetch featured article
      const featuredResult = await getFeaturedNews(1);
      const featuredData = Array.isArray(featuredResult?.data)
        ? featuredResult.data[0]
        : featuredResult?.data;
      setFeatured(featuredData || null);

      // Fetch all news
      const allNewsResult = await getAllNews(0, 50);
      const newsData = Array.isArray(allNewsResult?.data)
        ? allNewsResult.data
        : [];
      setAllNews(newsData);

      // Fetch trending news
      const trendingResult = await getTrendingNews(5);
      const trendingData = Array.isArray(trendingResult?.data)
        ? trendingResult.data
        : [];
      setTrendingNews(trendingData);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Lỗi khi tải tin tức");
      setAllNews([]);
      setFeatured(null);
      setTrendingNews([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = useMemo(() => {
    return allNews.filter((n) => {
      const matchesTab = activeTab === "Tất cả" || n.category === activeTab;
      const matchesSearch =
        n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [allNews, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedNews = filteredNews.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  const handleTabChange = (cat: string) => {
    setActiveTab(cat);
    setCurrentPage(1);
  };

  return (
    <div className={styles.newsPage}>
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1 data-aos="fade-down">
            Tin tức & <span>Cảm hứng</span>
          </h1>
          <p data-aos="fade-up" data-aos-delay="200">
            Cập nhật những thông tin mới nhất và những câu chuyện thú vị về du
            lịch khắp thế giới.
          </p>
        </div>
      </header>

      {featured && (
        <div className={styles.featuredSection}>
          <div className={styles.container}>
            <FeaturedPost data={featured} />
          </div>
        </div>
      )}

      <div className={styles.contentSection}>
        <div className={styles.container}>
          <CategoryTabs
            categories={categories}
            activeCategory={activeTab}
            onCategoryChange={handleTabChange}
          />

          <div className={styles.layoutWrapper}>
            <main className={styles.mainGrid}>
              <div className={styles.grid}>
                {loading ? (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    <p>Đang tải tin tức...</p>
                  </div>
                ) : displayedNews.length > 0 ? (
                  displayedNews.map((item, index) => (
                    <div
                      key={item.id}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <NewsCard item={item} />
                    </div>
                  ))
                ) : (
                  <div className={styles.noResults} data-aos="zoom-in">
                    <p>😞 Không tìm thấy tin tức nào phù hợp.</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className={styles.paginationContainer} data-aos="fade-up">
                  <button
                    className={styles.pageNavBtn}
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <CaretLeft size={18} weight="bold" /> Trước
                  </button>

                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`${styles.pageBtn} ${
                            currentPage === page ? styles.activePage : ""
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    className={styles.pageNavBtn}
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Sau <CaretRight size={18} weight="bold" />
                  </button>
                </div>
              )}
            </main>

            <NewsSidebar
              trendingNews={trendingNews}
              categories={categories}
              activeCategory={activeTab}
              onCategoryChange={handleTabChange}
              onSearch={setSearchQuery}
            />
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
};

export default News;
