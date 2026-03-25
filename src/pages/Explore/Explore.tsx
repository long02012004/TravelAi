import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import styles from "./Explore.module.scss";
import VideoHome from "../../assets/video/Da_Nang.mp4";

import ExploreHero from "./components/ExploreHero/ExploreHero";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";
import FilterBar from "./components/FilterBar/FilterBar";
import TravelCard from "./components/TravelCard/TravelCard";
import AIRecommendations from "./components/AIRecommendations/AIRecommendations";

const MOCK_DATA = [
  {
    id: 1,
    title: "Nhà hàng Biển Xanh",
    rating: 4.8,
    distance: "1.2km",
    description: "Hải sản tươi sống",
    category: "restaurant",
    image: "https://picsum.photos/400/300",
    isHot: true,
    previewVideo: VideoHome,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1555510544-4464392c427f?auto=format&fit=crop&w=800&q=80",
    title: "Phố Cổ Hội An",
    rating: 4.8,
    distance: "800km",
    description: "Vẻ đẹp hoài cổ về đêm",
    category: "culture",
    previewVideo:
      "https://player.vimeo.com/external/517090081.sd.mp4?s=9897fb94e1e8b2ed3f07a781bcf7b25206253c15&profile_id=139&oauth2_token_id=57447761",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80",
    title: "Bà Nà Hills",
    rating: 4.7,
    distance: "750km",
    description: "Đường lên tiên cảnh",
    category: "popular",
    previewVideo:
      "https://player.vimeo.com/external/434045526.sd.mp4?s=c27dbed94f09d8d641d4f208c903a58e8011116c&profile_id=139&oauth2_token_id=57447761",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
    title: "Đảo Phú Quốc",
    rating: 4.9,
    distance: "1200km",
    description: "Thiên đường nghỉ dưỡng",
    category: "beach",
    previewVideo:
      "https://player.vimeo.com/external/403814144.sd.mp4?s=6953f93c20058b845dfd7cd6ecf7b49cb2e0ef75&profile_id=139&oauth2_token_id=57447761",
  },
  {
    id: 5,
    title: "Vịnh Hạ Long",
    rating: 4.9,
    distance: "150km",
    description: "Kỳ quan thiên nhiên thế giới",
    category: "popular",
    image: "https://images.unsplash.com/photo-1559592442-7e18ad73d631?auto=format&fit=crop&w=800&q=80",
    previewVideo: "https://player.vimeo.com/external/434045526.sd.mp4?s=c27dbed94f09d8d641d4f208c903a58e8011116c&profile_id=139&oauth2_token_id=57447761",
  },
  {
    id: 6,
    title: "Sapa - Fansipan",
    rating: 4.8,
    distance: "300km",
    description: "Nóc nhà Đông Dương",
    category: "popular",
    image: "https://images.unsplash.com/photo-1504457047772-27fad17438e2?auto=format&fit=crop&w=800&q=80",
    previewVideo: VideoHome,
  },
  {
    id: 7,
    title: "Cố đô Huế",
    rating: 4.7,
    distance: "700km",
    description: "Di sản văn hóa cố đô",
    category: "culture",
    image: "https://images.unsplash.com/photo-1599708153386-efdb71593ef0?auto=format&fit=crop&w=800&q=80",
    previewVideo: VideoHome,
  },
  {
    id: 8,
    title: "Mũi Né - Phan Thiết",
    rating: 4.6,
    distance: "1600km",
    description: "Đồi cát bay và biển xanh",
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    previewVideo: VideoHome,
  },
  {
    id: 9,
    title: "Chợ Bến Thành",
    rating: 4.5,
    distance: "1700km",
    description: "Biểu tượng Sài Gòn",
    category: "popular",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
    previewVideo: VideoHome,
  },
  {
    id: 10,
    title: "Nha Trang Beach",
    rating: 4.8,
    distance: "1300km",
    description: "Vịnh biển đẹp nhất thế giới",
    category: "beach",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=800&q=80",
    previewVideo: VideoHome,
  },
];

const Explore: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-quad",
      delay: 100,
    });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const filteredData = MOCK_DATA.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          {displayedData.length > 0 ? (
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`${styles.pageBtn} ${
                    currentPage === page ? styles.activePage : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className={styles.pageNavBtn}
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
