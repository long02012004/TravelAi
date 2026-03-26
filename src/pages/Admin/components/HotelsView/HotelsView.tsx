import React from 'react';
import styles from '../_shared.module.scss';
import StatCard from '../StatCard/StatCard';
import { MapPin, Star, Pencil, Plus, CaretLeft, CaretRight, Trash } from "@phosphor-icons/react";
import { motion } from 'framer-motion';

const HotelsView: React.FC = () => {
  const hotels = [
    { id: 'AZ-1024', name: 'Grand Azure Resort', location: 'Đà Nẵng, Việt Nam', rating: 4.9, reviews: '2.4k', type: 'RESORT', status: 'HOẠT ĐỘNG', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=80&h=80&fit=crop' },
    { id: 'AZ-2051', name: 'Slate Heritage Palace', location: 'Hà Nội, Việt Nam', rating: 4.7, reviews: '1.8k', type: 'CỔ ĐIỂN', status: 'BẢO TRÌ', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=80&h=80&fit=crop' },
    { id: 'AZ-0992', name: 'Emerald Bay Suites', location: 'Phú Quốc, Việt Nam', rating: 4.5, reviews: '942', type: 'HIỆN ĐẠI', status: 'HOẠT ĐỘNG', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=80&h=80&fit=crop' },
    { id: 'AZ-3301', name: 'The Pearl Danang', location: 'Đà Nẵng, Việt Nam', rating: 4.8, reviews: '3.1k', type: 'RESORT', status: 'HOẠT ĐỘNG', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=80&h=80&fit=crop' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  } as const;
  const rowVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  } as const;

  return (
    <motion.div className={styles.contentArea} initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={rowVariants} className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h2>Quản lý Khách sạn</h2>
          <p>Theo dõi và quản lý toàn bộ cơ sở lưu trú trên hệ thống</p>
        </div>
        <div className={styles.pageActions}>
          <button className={styles.btnPrimary}>
            <Plus size={18} weight="bold" />
            <span>Thêm khách sạn</span>
          </button>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.statsGrid}>
        <StatCard label="TỔNG KHÁCH SẠN" value="1,284" trend="+12% tháng này" trendUp={true} icon="Bed" colorClass="bgBlue" />
        <StatCard label="ĐANG HOẠT ĐỘNG" value="1,150" footerText="Đang vận hành" icon="CheckCircle" colorClass="bgEmerald" />
        <StatCard label="ĐANG BẢO TRÌ" value="42" trend="Theo lịch trình" trendUp={true} icon="Wrench" colorClass="bgAmber" />
        <StatCard label="YÊU CẦU MỚI" value="92" trend="Chờ phê duyệt" trendUp={true} icon="Storefront" colorClass="bgPurple" />
      </motion.div>

      <motion.div variants={rowVariants} className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <div className={styles.tabGroup}>
            <button className={`${styles.tab} ${styles.tabActive}`}>Tất cả (1,284)</button>
            <button className={styles.tab}>Đang hoạt động</button>
            <button className={styles.tab}>Bảo trì</button>
            <button className={styles.tab}>Lưu trữ</button>
          </div>
        </div>
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Lọc:</span>
          <select className={styles.selectPill}>
            <option>Tất cả phong cách</option>
            <option>Resort</option>
            <option>Cổ điển</option>
            <option>Hiện đại</option>
          </select>
          <select className={styles.selectPill}>
            <option>Tất cả đánh giá</option>
            <option>5 sao</option>
            <option>4 sao</option>
          </select>
          <div className={styles.searchGroup}>
            <MapPin size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Tìm theo tên hoặc địa điểm..." />
          </div>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Danh sách khách sạn</h3>
          <button className={styles.tableAction}>Xuất danh sách</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>THÔNG TIN KHÁCH SẠN</th>
              <th>ĐỊA ĐIỂM</th>
              <th>ĐÁNH GIÁ</th>
              <th>PHONG CÁCH</th>
              <th>TRẠNG THÁI</th>
              <th style={{ textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel, idx) => (
              <motion.tr key={hotel.id} variants={rowVariants} custom={idx}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={hotel.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #f1f5f9' }} />
                    <div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: '0 0 3px 0', fontFamily: "'Manrope', sans-serif" }}>{hotel.name}</p>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', margin: 0 }}>#{hotel.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>{hotel.location}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={16} weight="fill" style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>{hotel.rating}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>({hotel.reviews})</span>
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${hotel.type === 'RESORT' ? styles.bgBlue : hotel.type === 'BẢO TRÌ' ? styles.bgAmber : styles.bgPurple}`}>{hotel.type}</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${hotel.status === 'HOẠT ĐỘNG' ? styles.bgEmerald : styles.bgAmber}`}>
                    <span className={styles.dot} style={{ backgroundColor: hotel.status === 'HOẠT ĐỘNG' ? '#10b981' : '#f59e0b' }}></span>
                    {hotel.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button className={styles.actionBtn}><Pencil size={17} /></button>
                    <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`}><Trash size={17} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <p className={styles.paginationInfo}>Hiển thị <span>1–4</span> của <span>1,284</span> kết quả</p>
          <div className={styles.paginationBtns}>
            <button className={styles.pageBtn} disabled><CaretLeft size={16} /></button>
            <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
            <span style={{ color: '#cbd5e1', fontWeight: 700, padding: '0 4px' }}>…</span>
            <button className={styles.pageBtn}><CaretRight size={16} /></button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HotelsView;
