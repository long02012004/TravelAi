import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Explore.module.scss";

import { globalSearch } from "../../services";
import AIRecommendations from "./components/AIRecommendations/AIRecommendations";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";
import ExploreHero from "./components/ExploreHero/ExploreHero";
import FilterBar from "./components/FilterBar/FilterBar";
import TravelCard from "./components/TravelCard/TravelCard";

const Explore: React.FC = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allResults, setAllResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const ITEMS_PER_PAGE = 6;

  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword") || "";
    const dateRange = params.get("dateRange") || "";
    const people = params.get("people") || "";

    if (keyword) {
      setSearchTerm(keyword);
      fetchSearchResults(keyword, dateRange);
    }
  }, [location.search]);

  // Fetch search results from API
  const fetchSearchResults = async (keyword: string, dateRange?: string) => {
    try {
      setLoading(true);
      // Call globalSearch with keyword filter
      const results = await globalSearch({
        keyword: keyword,
        skip: 0,
        limit: 100, // Get more results for client-side pagination
      });

      if (results?.data) {
        // Map API response to card format if needed
        setAllResults(Array.isArray(results.data) ? results.data : []);
      } else {
        setAllResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Lỗi khi tải kết quả tìm kiếm");
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-quad",
      delay: 100,
    });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
    if (newSearchTerm) {
      fetchSearchResults(newSearchTerm);
    } else {
      setAllResults([]);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Filter results by category and search locally
  const filteredData = allResults.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || true;
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className={styles.explorePage}>
      <div data-aos="fade-down">
        <ExploreHero />
      </div>

      <main className={styles.mainContainer}>
        <div data-aos="fade-up" data-aos-delay="200">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>

        <div className={styles.cardGrid}>
          {loading ? (
            <div className={styles.noResults}>
              <p>Đang tải kết quả...</p>
            </div>
          ) : displayedData.length > 0 ? (
            displayedData.map((location, index) => (
              <div
                key={location.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <TravelCard {...location} />
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>Không tìm thấy kết quả phù hợp với yêu cầu của bạn.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.paginationContainer} data-aos="fade-up">
            <button
              className={styles.pageNavBtn}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <CaretLeft size={18} weight="bold" /> Prev
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
              Next <CaretRight size={18} weight="bold" />
            </button>
          </div>
        )}
        {/* Tích hợp AI Recommendations */}
        <AIRecommendations />
      </main>
    </div>
  );
};

export default Explore;
