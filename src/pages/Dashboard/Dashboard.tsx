import AOS from "aos";
import "aos/dist/aos.css";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./Dashboard.module.scss";

// Import các Components con
import AddTripCard from "./components/AddTripCard/AddTripCard";
import ClockStation from "./components/ClockStation/ClockStation";
import JourneyMap from "./components/JourneyMap/JourneyMap";
import Sidebar from "./components/Sidebar/Sidebar";
import TripCard from "./components/TripCard/TripCard";

// Import Types
import { getMyTrips } from "../../services";
import TopBar from "./components/TopBar/TopBar";
import type { TripPlan } from "./types";

const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<TripPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "upcoming" | "completed" | "ongoing"
  >("all");

  const applyFilter = useCallback(
    (
      filterStatus: "all" | "upcoming" | "completed" | "ongoing",
      tripsToFilter?: TripPlan[],
    ) => {
      const tripsData = tripsToFilter || trips;
      setActiveFilter(filterStatus);

      if (filterStatus === "all") {
        setFilteredTrips(tripsData);
      } else {
        setFilteredTrips(
          tripsData.filter((trip) => trip.status === filterStatus),
        );
      }
    },
    [trips],
  );

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all trips (without status filter to get all types)
      const results = await getMyTrips();
      const sourceTrips = Array.isArray(results?.data?.DT)
        ? results.data.DT
        : [];
      const tripsData: TripPlan[] = sourceTrips.map((trip) => ({
        id: String(trip.id),
        title: trip.title,
        dateRange: `${trip.startDate} - ${trip.endDate}`,
        days: Math.max(
          1,
          Math.round(
            (new Date(trip.endDate).getTime() -
              new Date(trip.startDate).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        ),
        people: trip.numberOfPeople,
        image: trip.images?.[0] || "",
        status: "upcoming",
        checklist: trip.checklist || [],
      }));
      setTrips(tripsData);
      applyFilter("all", tripsData);
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error("Lỗi khi tải lịch trình");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [applyFilter]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchTrips();
  }, [fetchTrips]);

  const handleFilterClick = (
    status: "all" | "upcoming" | "completed" | "ongoing",
  ) => {
    applyFilter(status);
  };

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />

      <main className={styles.mainContent}>
        {/* TopBar */}
        <TopBar />

        <div className={styles.pageContent}>
          {/* Row 1: Clock & Map */}
          <div className={styles.topRow}>
            <div className={styles.clockCol}>
              <ClockStation />
            </div>
            <div className={styles.mapCol}>
              <JourneyMap />
            </div>
          </div>

          {/* Row 2: Management Header */}
          <div className={styles.sectionHeader}>
            <div className={styles.headerTitle}>
              <h2>Quản lý lịch trình</h2>
              <p>
                Bạn có <span>{filteredTrips.length}</span> chuyến đi đang được
                quản lý
              </p>
            </div>

            <div className={styles.tripFilters}>
              <button
                className={`${styles.filterBtn} ${activeFilter === "all" ? styles.active : ""}`}
                onClick={() => handleFilterClick("all")}
              >
                Tất cả
              </button>
              <button
                className={`${styles.filterBtn} ${activeFilter === "upcoming" ? styles.active : ""}`}
                onClick={() => handleFilterClick("upcoming")}
              >
                Sắp tới
              </button>
              <button
                className={`${styles.filterBtn} ${activeFilter === "completed" ? styles.active : ""}`}
                onClick={() => handleFilterClick("completed")}
              >
                Đã đi
              </button>
            </div>
          </div>

          {/* Row 3: Itinerary Grid */}
          <div className={styles.tripGrid}>
            {loading ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "40px",
                }}
              >
                <p>Đang tải lịch trình...</p>
              </div>
            ) : filteredTrips.length > 0 ? (
              <>
                {filteredTrips.map((trip) => (
                  <TripCard key={trip.id} data={trip} />
                ))}
                <AddTripCard />
              </>
            ) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "40px",
                }}
              >
                <p>Bạn chưa có chuyến đi nào. Hãy tạo chuyến đi đầu tiên!</p>
                <AddTripCard />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
