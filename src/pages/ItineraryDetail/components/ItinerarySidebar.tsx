import React, { useState, useEffect } from 'react';
import type { RoutePoint } from '../ItineraryDetail';
import styles from '../ItineraryDetail.module.scss';
import PlaceCard from './PlaceCard';
import axios from 'axios';

interface Props {
  points: RoutePoint[];
  activePointId: string | null;
  onPointClick: (id: string) => void;
  isPreviewing: boolean;
  onTogglePreview: () => void;
  onOpenAddModal: () => void;
}

const ItinerarySidebar: React.FC<Props> = ({
  points,
  activePointId,
  onPointClick,
  isPreviewing,
  onTogglePreview,
  onOpenAddModal
}) => {
  const [activeTab, setActiveTab] = useState<'day1' | 'day2' | 'day3' | 'stats'>('day1');
  const [placeInfo, setPlaceInfo] = useState<{ title: string; desc: string; image: string } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  // Fetch Wikipedia data when activePointId changes
  useEffect(() => {
    if (!activePointId) {
      setPlaceInfo(null);
      return;
    }

    const point = points.find(p => p.id === activePointId);
    if (!point || point.name.toLowerCase() === 'khách sạn') {
      setPlaceInfo(null);
      return;
    }

    const fetchWiki = async () => {
      setIsLoadingInfo(true);
      try {
        // Sử dụng API tìm kiếm của Wikipedia để có kết quả chính xác hơn
        const searchRes = await axios.get(`https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(point.name)}&utf8=&format=json&origin=*`);
        
        if (searchRes.data.query.search.length > 0) {
          const title = searchRes.data.query.search[0].title;
          const res = await axios.get(`https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
          
          if (res.data && res.data.extract) {
            setPlaceInfo({
              title: res.data.title,
              desc: res.data.extract,
              image: res.data.thumbnail?.source || point.imageUrl || ''
            });
            return; // Thoát nếu thành công
          }
        }
      } catch (err) {
        console.error("Wikipedia API fall back to local description", err);
      } finally {
        setIsLoadingInfo(false);
      }
      
      // Nếu API Wikipedia lỗi hoặc không tìm thấy, fallback về description cục bộ
      setPlaceInfo({
        title: point.name,
        desc: point.description || 'Một địa điểm tuyệt vời trong chuyến hành trình của bạn.',
        image: point.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400&fit=crop'
      });
    };

    fetchWiki();
  }, [activePointId, points]);

  // Handle Text-to-Speech
  const handleTTS = () => {
    if (!placeInfo?.desc) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(placeInfo.desc);
      utterance.lang = 'vi-VN';
      utterance.volume = 1;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Split points into morning and afternoon
  const morningPoints = points.filter(p => {
    const hours = parseInt(p.time.split(':')[0], 10);
    return hours < 12;
  });

  const afternoonPoints = points.filter(p => {
    const hours = parseInt(p.time.split(':')[0], 10);
    return hours >= 12;
  });

  const renderTimelineGroup = (title: string, groupPoints: RoutePoint[], icon: string, bgClass: string, textClass: string, isAfternoon: boolean) => {
    if (groupPoints.length === 0) return null;

    return (
      <div className={styles.timeGroup} style={{ borderLeftColor: isAfternoon ? '#cbd5e1' : '#cbd5e1' }}>
        <div style={{
          position: 'absolute', left: '-14px', top: '-4px', width: '24px', height: '24px',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: bgClass, color: textClass
        }}>
          <i className={icon}></i>
        </div>
        <h3 className={styles.groupTitle}>{title}</h3>
        
        {groupPoints.map((point, idx) => {
          // Calculate global index for the badge number
          const globalIdx = points.findIndex(p => p.id === point.id) + 1;
          
          return (
            <React.Fragment key={point.id}>
              <PlaceCard 
                point={point} 
                index={globalIdx} 
                isActive={activePointId === point.id}
                onClick={() => onPointClick(point.id)}
              />
              
              {/* Show transport info between items, except the last one in the afternoon */}
              {idx < groupPoints.length - 1 && (
                <div className={styles.transportInfo}>
                  <i className="ph-fill ph-car-profile" style={{ color: '#cbd5e1', fontSize: '1.2rem' }}></i>
                  <span>Di chuyển khoảng 15 phút</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <aside className={styles.itinerarySidebar}>
      <div className={styles.itiSidebarHeader}>
        <div className={styles.itiTitleRow}>
          <h1 className={styles.itiMainTitle}>Lịch trình chi tiết</h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '8px' }}>
          Theo dõi các địa điểm tham quan theo từng ngày và dễ dàng quản lý chuyến đi của bạn.
        </p>
      </div>

      <div className={styles.itiContentScrollable}>
        {/* Day Tabs */}
        <div className={styles.itiDaysTabs} style={{ gap: '8px', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
          <button 
            className={`${styles.dayTab} ${activeTab === 'day1' ? styles.active : ''}`}
            onClick={() => setActiveTab('day1')}
            style={{ padding: '8px 20px', borderRadius: '24px', border: activeTab === 'day1' ? 'none' : '1px solid #e2e8f0', background: activeTab === 'day1' ? '#0ea5e9' : 'white', color: activeTab === 'day1' ? 'white' : '#64748b', fontWeight: 600 }}
          >Ngày 1</button>
          <button 
            className={`${styles.dayTab} ${activeTab === 'day2' ? styles.active : ''}`}
            onClick={() => setActiveTab('day2')}
            style={{ padding: '8px 20px', borderRadius: '24px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 600 }}
          >Ngày 2</button>
          
          <button 
            className={`${styles.dayTab} ${activeTab === 'stats' ? styles.active : ''} ${styles.tabStats}`}
            onClick={() => setActiveTab('stats')}
            style={{ padding: '8px 20px', borderRadius: '24px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 600 }}
          >
            <i className="ph-bold ph-chart-pie-slice"></i> Chi phí
          </button>
        </div>

        {/* --- WIKIPEDIA INFO BOX --- */}
        {isLoadingInfo && (
           <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Đang tải thông tin địa điểm...</div>
        )}
        {!isLoadingInfo && placeInfo && activeTab !== 'stats' && (
          <div style={{ 
            background: 'white', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)', 
            marginBottom: '24px', 
            border: '1px solid #f1f5f9' 
          }}>
            {placeInfo.image && (
              <div style={{ width: '100%', height: '140px', background: `url(${placeInfo.image}) center/cover` }}></div>
            )}
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px', fontWeight: 800 }}>{placeInfo.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                {placeInfo.desc.substring(0, 150)}...
              </p>
              <button 
                onClick={handleTTS}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  background: isSpeaking ? '#fef2f2' : '#f0fdf4', 
                  color: isSpeaking ? '#ef4444' : '#16a34a', 
                  border: `1px solid ${isSpeaking ? '#fecaca' : '#bbf7d0'}`, 
                  padding: '8px 16px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                {isSpeaking ? (
                  <><i className="ph-fill ph-speaker-high" style={{ animation: 'pulse 1s infinite' }}></i> Đang đọc âm thanh...</>
                ) : (
                  <><i className="ph-fill ph-play-circle"></i> Truyền tải âm thanh (Voice)</>
                )}
              </button>
            </div>
          </div>
        )}
        {/* --- END WIKIPEDIA INFO BOX --- */}

        {activeTab !== 'stats' ? (
          <div className="itinerary-timeline">
            {renderTimelineGroup("BUỔI SÁNG", morningPoints, "ph-fill ph-sun", "#e0f2fe", "#0ea5e9", false)}
            {renderTimelineGroup("BUỔI CHIỀU", afternoonPoints, "ph-fill ph-cloud-sun", "#fff7ed", "#f97316", true)}
          </div>
        ) : (
          <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <i className="ph-fill ph-money" style={{ color: '#10b981' }}></i> Dự toán chi phí
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
              <span style={{ color: '#64748b' }}>Khách sạn</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>1,200,000 ₫</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
              <span style={{ color: '#64748b' }}>Ăn uống</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>800,000 ₫</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
              <span style={{ color: '#64748b' }}>Di chuyển</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>300,000 ₫</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
              <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Tổng cộng</span>
              <span style={{ fontWeight: 800, color: '#0ea5e9', fontSize: '1.1rem' }}>2,300,000 ₫</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'stretch', gap: '12px', marginTop: '24px', height: '52px' }}>
          <button 
            className={`${styles.btnItiPreview} ${isPreviewing ? styles.btnItiPreviewActive : ''}`}
            onClick={onTogglePreview}
            style={{ whiteSpace: 'nowrap', padding: '0 20px', borderRadius: '14px', height: '100%' }}
          >
            {isPreviewing ? <><i className="ph-bold ph-stop-circle"></i> Dừng</> : <><i className="ph-fill ph-play-circle"></i> Xem trước</>}
          </button>
          
          <button 
            className={styles.btnAddSpot}
            onClick={onOpenAddModal}
            style={{ margin: 0, height: '100%' }}
          >
            <i className="ph-bold ph-plus"></i> Thêm địa điểm
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ItinerarySidebar;
