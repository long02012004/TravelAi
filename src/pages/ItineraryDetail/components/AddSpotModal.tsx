import React, { useState } from 'react';
import type { RoutePoint } from '../ItineraryDetail';
import styles from '../ItineraryDetail.module.scss';
import axios from 'axios';

interface Props {
  onClose: () => void;
  onAdd: (point: Omit<RoutePoint, 'id'>) => void;
}

const AddSpotModal: React.FC<Props> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<RoutePoint['type']>('attraction');
  const [time, setTime] = useState('09:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDescription = async (query: string) => {
    try {
      // Use Wikipedia API as a free alternative to Google Places for descriptions
      const searchRes = await axios.get(`https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`);
      if (searchRes.data.query.search.length > 0) {
        const title = searchRes.data.query.search[0].title;
        const detailRes = await axios.get(`https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
        return detailRes.data.extract || '';
      }
      return '';
    } catch (err) {
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    setLoading(true);
    setError('');

    try {
      // Use Nominatim to geocode the address
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&countrycodes=vn&limit=1`);
      
      if (res.data && res.data.length > 0) {
        // Lấy mô tả chi tiết từ Wikipedia (thay thế cho Google API vì Google API cần API Key trả phí)
        const description = await fetchDescription(name);
        
        onAdd({
          name,
          lat: parseFloat(res.data[0].lat),
          lng: parseFloat(res.data[0].lon),
          time,
          type,
          description: description || `Đây là một địa điểm thú vị tại ${address}.`
        });
        onClose();
      } else {
        setError('Không tìm thấy tọa độ cho địa chỉ này.');
      }
    } catch (err) {
      setError('Lỗi kết nối khi tìm địa chỉ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Thêm địa điểm nhanh</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <i className="ph-bold ph-x"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px' }}>
          {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}
          
          <div className={styles.formGroup}>
            <input 
              type="text" 
              placeholder="Tên địa điểm *" 
              value={name}
              onChange={e => setName(e.target.value)}
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <input 
              type="text" 
              placeholder="Địa chỉ *" 
              value={address}
              onChange={e => setAddress(e.target.value)}
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div className={styles.formGroup} style={{ flex: 1, margin: 0 }}>
              <select 
                value={type} 
                onChange={e => setType(e.target.value as any)}
                required
              >
                <option value="hotel">Khách sạn</option>
                <option value="restaurant">Nhà hàng</option>
                <option value="attraction">Tham quan</option>
                <option value="shopping">Mua sắm</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className={styles.formGroup} style={{ flex: 1, margin: 0 }}>
              <input 
                type="time" 
                value={time}
                onChange={e => setTime(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? 'Đang thêm...' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpotModal;
