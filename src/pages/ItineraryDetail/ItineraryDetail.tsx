import React, { useState, useEffect } from 'react';
import styles from './ItineraryDetail.module.scss';
import ItinerarySidebar from './components/ItinerarySidebar';
import ItineraryMap from './components/ItineraryMap';
import AddSpotModal from './components/AddSpotModal';
import AOS from 'aos';
import 'aos/dist/aos.css';

export interface RoutePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  time: string; // HH:mm format
  type: 'hotel' | 'restaurant' | 'attraction' | 'shopping' | 'other';
  imageUrl?: string;
  description?: string;
}

const INITIAL_POINTS: RoutePoint[] = [
  {
    id: 'p1',
    name: 'Cầu Rồng Đà Nẵng',
    lat: 16.0614,
    lng: 108.227,
    time: '09:00',
    type: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=400&auto=format&fit=crop',
    description: 'Cầu Rồng không chỉ là biểu tượng kiến trúc vĩ đại của Đà Nẵng mà còn là điểm đến không thể bỏ qua với màn phun lửa và phun nước ngoạn mục vào mỗi tối cuối tuần.'
  },
  {
    id: 'p2',
    name: 'Biển Mỹ Khê',
    lat: 16.0544,
    lng: 108.249,
    time: '11:45',
    type: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop',
    description: 'Được tạp chí Forbes bình chọn là một trong những bãi biển quyến rũ nhất hành tinh, Mỹ Khê thu hút du khách bởi bãi cát trắng mịn, bờ biển uốn lượn, nước trong xanh.'
  },
  {
    id: 'p3',
    name: 'Bà Nà Hills',
    lat: 15.9975,
    lng: 107.992,
    time: '13:00',
    type: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop',
    description: 'Bà Nà Hills mang đến trải nghiệm thời tiết 4 mùa trong 1 ngày kỳ diệu. Bạn sẽ được ngoạn cảnh trên tuyến cáp treo đạt nhiều kỷ lục thế giới.'
  },
  {
    id: 'p4',
    name: 'Cầu Vàng',
    lat: 15.9950,
    lng: 107.9876,
    time: '14:00',
    type: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=400&auto=format&fit=crop',
    description: 'Cầu Vàng được nâng đỡ bởi đôi bàn tay khổng lồ, là điểm check-in nổi tiếng bậc nhất thế giới.'
  }
];

import Navbar from '../../components/Layout/Navbar/Navbar';

const ItineraryDetail: React.FC = () => {
  const [points, setPoints] = useState<RoutePoint[]>(INITIAL_POINTS);
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    AOS.init({ duration: 1000 });
    AOS.refresh();
  }, []);

  const handleAddSpot = (newPoint: Omit<RoutePoint, 'id'>) => {
    const point: RoutePoint = {
      ...newPoint,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    const newPoints = [...points, point].sort((a, b) => {
      const timeA = parseInt(a.time.replace(':', ''), 10);
      const timeB = parseInt(b.time.replace(':', ''), 10);
      return timeA - timeB;
    });

    setPoints(newPoints);
    setActivePointId(point.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Navbar isSolid={true} />
      <div className={styles.splitViewContainer} style={{ flex: 1, marginTop: '72px' }}>
        <ItinerarySidebar 
          points={points} 
          activePointId={activePointId}
          onPointClick={(id) => setActivePointId(id)}
          isPreviewing={isPreviewing}
          onTogglePreview={() => setIsPreviewing(!isPreviewing)}
          onOpenAddModal={() => setIsModalOpen(true)}
        />
        
        <ItineraryMap 
          points={points} 
          activePointId={activePointId}
          onPointClick={(id) => setActivePointId(id)}
          isPreviewing={isPreviewing}
          onAddSpot={(point) => handleAddSpot(point)}
        />

        {isModalOpen && (
          <AddSpotModal 
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddSpot}
          />
        )}
      </div>
    </div>
  );
};

export default ItineraryDetail;
