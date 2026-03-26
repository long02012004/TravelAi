import React from 'react';
import styles from '../_shared.module.scss';
import StatCard from '../StatCard/StatCard';
import { MapPin, Star, Pencil, Plus, MagnifyingGlass, Trash } from "@phosphor-icons/react";
import { motion } from 'framer-motion';

const RestaurantsView: React.FC = () => {
  const restaurants = [
    { id: 'RS-4821', name: 'The Azure Kitchen', location: 'Quận 1, TP. Hồ Chí Minh', rating: 4.8, reviews: '1.2k', cuisine: 'VIỆT NAM', status: 'ĐANG MỞ', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=80&h=80&fit=crop' },
    { id: 'RS-5502', name: 'Saigon Garden Bistro', location: 'Quận 3, TP. Hồ Chí Minh', rating: 4.6, reviews: '987', cuisine: 'CHÂU ÂU', status: 'ĐANG MỞ', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=80&h=80&fit=crop' },
    { id: 'RS-3311', name: 'Hà Nội Old Quarter Pho', location: 'Hoàn Kiếm, Hà Nội', rating: 4.9, reviews: '2.8k', cuisine: 'VIỆT NAM', status: 'TẠM ĐÓNG', image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?q=80&w=80&h=80&fit=crop' },
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
          <h2>Quản lý Nhà hàng</h2>
          <p>Quản lý danh mục nhà hàng và địa điểm ẩm thực trên toàn hệ thống</p>
        </div>
        <div className={styles.pageActions}>
          <button className={styles.btnPrimary}>
            <Plus size={18} weight="bold" />
            <span>Thêm nhà hàng</span>
          </button>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.statsGrid}>
        <StatCard label="TỔNG NHÀ HÀNG" value="842" trend="+8% tháng này" trendUp={true} icon="ForkKnife" colorClass="bgOrange" />
        <StatCard label="ĐANG HOẠT ĐỘNG" value="790" footerText="Đang phục vụ" icon="CheckCircle" colorClass="bgEmerald" />
        <StatCard label="TẠM ĐÓNG" value="42" trend="Dự kiến xong T4" trendUp={true} icon="Storefront" colorClass="bgAmber" />
        <StatCard label="YÊU CẦU MỚI" value="156" trend="Chờ phê duyệt" trendUp={true} icon="Plus" colorClass="bgBlue" />
      </motion.div>

      <motion.div variants={rowVariants} className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <div className={styles.tabGroup}>
            <button className={`${styles.tab} ${styles.tabActive}`}>Tất cả (842)</button>
            <button className={styles.tab}>Đang hoạt động</button>
            <button className={styles.tab}>Tạm đóng</button>
          </div>
          <button className={styles.btnPrimary}>
            <Plus size={18} weight="bold" />
            <span>Thêm nhà hàng</span>
          </button>
        </div>
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Lọc:</span>
          <select className={styles.selectPill}>
            <option>Tất cả ẩm thực</option>
            <option>Việt Nam</option>
            <option>Châu Âu</option>
            <option>Châu Á</option>
          </select>
          <select className={styles.selectPill}>
            <option>Tất cả đánh giá</option>
            <option>5 sao</option>
            <option>4 sao</option>
          </select>
          <div className={styles.searchGroup}>
            <MagnifyingGlass size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Tìm theo tên hoặc địa điểm..." />
          </div>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Danh sách nhà hàng</h3>
          <button className={styles.tableAction}>Xuất danh sách</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>THÔNG TIN NHÀ HÀNG</th>
              <th>ĐỊA ĐIỂM</th>
              <th>ĐÁNH GIÁ</th>
              <th>ẨM THỰC</th>
              <th>TRẠNG THÁI</th>
              <th style={{ textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((res, idx) => (
              <motion.tr key={res.id} variants={rowVariants} custom={idx}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={res.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #f1f5f9' }} />
                    <div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: '0 0 3px 0', fontFamily: "'Manrope', sans-serif" }}>{res.name}</p>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', margin: 0 }}>#{res.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>{res.location}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={16} weight="fill" style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>{res.rating}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>({res.reviews})</span>
                  </div>
                </td>
                <td><span className={`${styles.badge} ${styles.bgOrange}`}>{res.cuisine}</span></td>
                <td>
                  <span className={`${styles.badge} ${res.status === 'ĐANG MỞ' ? styles.bgEmerald : styles.bgAmber}`}>
                    <span className={styles.dot} style={{ backgroundColor: res.status === 'ĐANG MỞ' ? '#10b981' : '#f59e0b' }}></span>
                    {res.status}
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
      </motion.div>
    </motion.div>
  );
};

export default RestaurantsView;
