import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Import các Component con
import { getPlaceDetail, getPlaceReviews } from "../../services";
import HighlightLocations from "../Home/components/HighlightLocations/HighlightLocations";
import styles from "./DestinationDetail.module.scss";
import DestHero from "./components/DestHero/DestHero";
import DestTabs from "./components/DestTabs/DestTabs";
import OverviewTab from "./components/OverviewTab/OverviewTab";
import QuickStats from "./components/QuickStats/QuickStats";
import ReviewsTab from "./components/ReviewsTab/ReviewsTab";
import ServicesTab from "./components/ServicesTab/ServicesTab";
import Sidebar from "./components/Sidebar/Sidebar";
import TipsTab from "./components/TipsTab/TipsTab";

// --- ĐỊNH NGHĨA INTERFACE ---
export interface Destination {
  id: number;
  title: string;
  location: string;
  heroImage: string;
  rating: string;
  reviews: string;
  distance: string;
  price: string;
  time: string;
  category: string;
  description: string;
  gallery: string[];
  services: {
    id: number;
    type: "Khách sạn" | "Nhà hàng" | "Tour";
    name: string;
    location: string;
    price: string;
    unit: string;
    rating: number;
    image: string;
    buttonText: string;
  }[];
  reviewsData: {
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
  travelTips: {
    icon: string;
    title: string;
    content: string;
  }[];
  weatherCurrent: {
    temp: number;
    description: string;
    icon: string;
  };
  travelTimeFromHanoi: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  mapScreenshot: string;
  quickInfo: {
    id: number;
    label: string;
    value: string;
  }[];
}

const destinationsData: Record<string, Destination> = {
  "vinh-ha-long": {
    id: 1,
    title: "Vịnh Hạ Long",
    location: "QUẢNG NINH, VIỆT NAM",
    heroImage:
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=100&w=1920",
    rating: "4.8",
    reviews: "2.3k",
    distance: "165 km",
    price: "1.5tr - 5tr VNĐ",
    time: "2-3 ngày",
    category: "Di sản thiên nhiên thế giới",
    description:
      "Hội An nổi tiếng với vẻ đẹp lãng mạn, cổ kính, yên bình với những ngôi nhà cổ, phố đèn lồng và dòng sông Hoài thơ mộng. Đây là điểm đến không thể bỏ qua cho những ai yêu thích văn hóa và lịch sử Việt Nam.\n\nNơi đây không chỉ có cảnh quan sơn thủy hữu tình mà còn chứa đựng những giá trị văn hóa, lịch sử lâu đời. Du khách có thể tham gia các hoạt động như chèo thuyền kayak, tham quan hang động (Hang Sửng Sốt, Động Thiên Cung), hay đơn giản là ngắm hoàng hôn trên boong tàu.",
    gallery: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800",
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800",
    ],
    weatherCurrent: {
      temp: 28,
      description: "Trời nắng đẹp",
      icon: "CloudSun",
    },
    travelTimeFromHanoi: "2h 30m",
    coordinates: { lat: 20.9101, lng: 107.1839 },
    mapScreenshot:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=600",
    quickInfo: [
      { id: 1, label: "Giờ mở cửa", value: "24/7" },
      { id: 2, label: "Phí vào cửa", value: "40.000đ/người" },
      { id: 3, label: "Di chuyển", value: "Xe bus, tàu thủy" },
      { id: 4, label: "Ngôn ngữ", value: "Tiếng Việt, Tiếng Anh" },
    ],
    services: [
      {
        id: 1,
        type: "Khách sạn",
        name: "Vinpearl Resort & Spa",
        location: "Đảo Rều, Phường Bãi Cháy, Hạ Long",
        price: "2.500.000đ",
        unit: "đêm",
        rating: 4.9,
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400",
        buttonText: "Đặt ngay",
      },
      {
        id: 2,
        type: "Nhà hàng",
        name: "Nhà hàng Hồng Hạnh 3",
        location: "Đường bao biển Cột 5, Hạ Long",
        price: "500.000đ",
        unit: "người",
        rating: 4.7,
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400",
        buttonText: "Xem thực đơn",
      },
      {
        id: 3,
        type: "Tour",
        name: "Tour Du Thuyền 2 Ngày",
        location: "Bến tàu Tuần Châu, Hạ Long",
        price: "3.200.000đ",
        unit: "khách",
        rating: 4.8,
        image:
          "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=400",
        buttonText: "Khám phá",
      },
    ],
    reviewsData: {
      average: 4.8,
      total: 2341,
      breakdown: [
        { stars: 5, percentage: 75 },
        { stars: 4, percentage: 20 },
        { stars: 3, percentage: 4 },
        { stars: 2, percentage: 1 },
        { stars: 1, percentage: 0 },
      ],
      list: [
        {
          user: "Nguyễn Thu Hà",
          avatar: "https://i.pravatar.cc/150?u=ha",
          rating: 5,
          date: "2 ngày trước",
          tag: "Du lịch cùng gia đình",
          content:
            "Chuyến đi tuyệt vời! Cảnh đẹp mê hồn, đặc biệt là lúc hoàng hôn. Dịch vụ du thuyền 5 sao rất đáng tiền.",
          images: [
            "https://images.unsplash.com/photo-1528127269322-539801943592?w=100",
          ],
        },
      ],
    },
    travelTips: [
      {
        icon: "Camera",
        title: "Máy ảnh & Ống kính",
        content: "Mang theo máy ảnh chuyên nghiệp hoặc điện thoại tốt.",
      },
      {
        icon: "Sun",
        title: "Kem chống nắng",
        content: "Dù là mùa nào, hãy luôn thoa kem chống nắng khi ra ngoài.",
      },
    ],
  },
};

const DestinationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<Destination | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState(false);
  const mockData = destinationsData[slug || "vinh-ha-long"];

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    window.scrollTo(0, 0);
    fetchPlaceDetail();
  }, [slug]);

  const fetchPlaceDetail = async () => {
    try {
      setLoading(true);
      if (!slug) return;

      // Try to fetch from API using slug
      const result = await getPlaceDetail(slug);
      if (result?.data) {
        // Map API response to Destination interface
        const placeData = result.data;
        const enrichedData: Destination = {
          title: placeData.name || mockData.title,
          location:
            placeData.location || placeData.address || mockData.location,
          heroImage:
            placeData.image || placeData.thumbnail || mockData.heroImage,
          rating: placeData.rating?.toString() || mockData.rating,
          reviews: placeData.reviewCount?.toString() || mockData.reviews,
          distance: placeData.distance || mockData.distance,
          price: placeData.priceRange || mockData.price,
          time: placeData.visitTime || mockData.time,
          category: placeData.category || mockData.category,
          description: placeData.description || mockData.description,
          gallery: placeData.gallery || placeData.images || mockData.gallery,
          services: placeData.services || mockData.services,
          reviewsData: placeData.reviewsData || mockData.reviewsData,
          travelTips: placeData.tips || mockData.travelTips,
          weatherCurrent: placeData.weather || mockData.weatherCurrent,
          travelTimeFromHanoi:
            placeData.travelTime || mockData.travelTimeFromHanoi,
          coordinates: placeData.coordinates || mockData.coordinates,
          mapScreenshot: placeData.mapScreenshot || mockData.mapScreenshot,
          quickInfo: placeData.quickInfo || mockData.quickInfo,
        };
        setData(enrichedData);

        // Also fetch reviews separately
        const reviewsResult = await getPlaceReviews(slug, 0, 10);
        if (reviewsResult?.data) {
          // Update reviews data if fetch was successful
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  reviewsData: {
                    ...prev.reviewsData,
                    list: Array.isArray(reviewsResult.data)
                      ? reviewsResult.data
                      : prev.reviewsData.list,
                  },
                }
              : null,
          );
        }
      } else {
        // Fallback to mock data
        setData(mockData);
      }
    } catch (error) {
      console.error("Error fetching place detail:", error);
      toast.error("Lỗi khi tải thông tin địa điểm");
      // Use mock data as fallback
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data)
    return <div className={styles.loading}>Đang tải dữ liệu...</div>;

  return (
    <main className={styles.destMain}>
      <DestHero data={data} />
      <QuickStats data={data} />
      <DestTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.destContentGrid}>
        <div className={styles.destLeft}>
          {activeTab === "overview" && <OverviewTab data={data} />}
          {activeTab === "services" && <ServicesTab services={data.services} />}
          {activeTab === "reviews" && <ReviewsTab reviews={data.reviewsData} placeId={data.id || 1} />}
          {activeTab === "tips" && <TipsTab tips={data.travelTips} />}
        </div>

        <Sidebar data={data} />
      </div>

      <HighlightLocations
        titlePrimary="Địa điểm"
        titleHighlight="liên quan"
        description={`Những địa điểm tương tự như ${data.title} dành cho bạn.`}
      />
    </main>
  );
};

export default DestinationDetail;
