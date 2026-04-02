import React from 'react';
import type { RoutePoint } from '../ItineraryDetail';
import styles from '../ItineraryDetail.module.scss';

interface Props {
  point: RoutePoint;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const getTypeProps = (type: string) => {
  switch (type) {
    case 'hotel':
      return { icon: 'ph-bed', bg: '#e0f2fe', color: '#0284c7', label: '🏨 Khách sạn' };
    case 'restaurant':
      return { icon: 'ph-fork-knife', bg: '#fef3c7', color: '#d97706', label: '🍽️ Nhà hàng' };
    case 'attraction':
      return { icon: 'ph-camera', bg: '#f1f5f9', color: '#475569', label: '📷 Địa điểm tham quan' };
    case 'shopping':
      return { icon: 'ph-shopping-bag', bg: '#dcfce7', color: '#15803d', label: '🛍️ Mua sắm' };
    default:
      return { icon: 'ph-map-pin', bg: '#f3e8ff', color: '#7e22ce', label: '📍 Địa điểm khác' };
  }
};

const PlaceCard: React.FC<Props> = ({ point, index, isActive, onClick }) => {
  const typeProps = getTypeProps(point.type);

  return (
    <div 
      className={`${styles.itiItem} ${isActive ? styles.itemActiveHighlight : ''}`} 
      onClick={onClick}
    >
      <div className={styles.itemNumber}>{index}</div>
      <div className={styles.itemImg}>
        {point.imageUrl ? (
          <img src={point.imageUrl} alt={point.name} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #94a3b8, #64748b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <i className={`ph-fill ${typeProps.icon}`} style={{ fontSize: '24px' }}></i>
          </div>
        )}
      </div>
      <div className={styles.itemInfo}>
        <h4>{point.name}</h4>
        <div className={styles.itemTime}>
          <i className="ph-bold ph-clock"></i> {point.time}
        </div>
        <div>
          <span 
            className={styles.itemBadge} 
            style={{ background: typeProps.bg, color: typeProps.color }}
          >
            {typeProps.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
