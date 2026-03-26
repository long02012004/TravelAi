import React from 'react';
import styles from '../_shared.module.scss';
import StatCard from '../StatCard/StatCard';
import { Envelope, Pencil, Trash, MagnifyingGlass, DotsThreeVertical, CheckCircle, XCircle, Clock, UserPlus } from "@phosphor-icons/react";
import { motion } from 'framer-motion';

const UsersView: React.FC = () => {
  const users = [
    { id: 'USR-7721', name: 'Nguyễn Văn An', email: 'an.nguyen@email.com', role: 'ADMIN', status: 'ACTIVE', joined: '12 Th10, 2023', avatar: 'https://i.pravatar.cc/100?u=1' },
    { id: 'USR-8812', name: 'Trần Thị Mai', email: 'mai.tran@email.com', role: 'EDITOR', status: 'ACTIVE', joined: '15 Th10, 2023', avatar: 'https://i.pravatar.cc/100?u=2' },
    { id: 'USR-3345', name: 'Lê Minh Quân', email: 'quan.lm@email.com', role: 'USER', status: 'BANNED', joined: '20 Th10, 2023', avatar: 'https://i.pravatar.cc/100?u=3' },
    { id: 'USR-9021', name: 'Phạm Hoàng Nam', email: 'nam.ph@email.com', role: 'USER', status: 'INACTIVE', joined: '22 Th10, 2023', avatar: 'https://i.pravatar.cc/100?u=4' },
    { id: 'USR-1120', name: 'Hoàng Thu Thủy', email: 'thuy.ht@email.com', role: 'USER', status: 'ACTIVE', joined: '24 Th10, 2023', avatar: 'https://i.pravatar.cc/100?u=5' },
  ];

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'ADMIN': return styles.bgBlue;
      case 'EDITOR': return styles.bgPurple;
      default: return styles.bgSlate;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE': return styles.bgEmerald;
      case 'BANNED': return styles.bgRed;
      default: return styles.bgAmber;
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'ACTIVE') return <CheckCircle size={13} weight="fill" />;
    if (status === 'BANNED') return <XCircle size={13} weight="fill" />;
    return <Clock size={13} weight="fill" />;
  };

  const statusLabel: Record<string, string> = { ACTIVE: 'Hoạt động', BANNED: 'Bị chặn', INACTIVE: 'Không hoạt động' };

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
          <h2>Quản lý Người dùng</h2>
          <p>Xem và quản lý tài khoản người dùng trên toàn hệ thống Travel AI</p>
        </div>
        <div className={styles.pageActions}>
          <button className={styles.btnPrimary}>
            <UserPlus size={18} weight="bold" />
            <span>Thêm người dùng</span>
          </button>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.statsGrid}>
        <StatCard label="TỔNG NGƯỜI DÙNG" value="12,840" trend="+156 tuần này" trendUp={true} icon="Users" colorClass="bgBlue" />
        <StatCard label="ĐANG HOẠT ĐỘNG" value="8,520" footerText="Trong 30 ngày qua" icon="UserCheck" colorClass="bgEmerald" />
        <StatCard label="YÊU CẦU DUYỆT" value="12" trend="Chờ xử lý" trendUp={true} icon="ClockCounterClockwise" colorClass="bgAmber" />
        <StatCard label="TÀI KHOẢN BỊ CHẶN" value="42" trend="-4% tháng trước" trendUp={false} icon="ShieldWarning" colorClass="bgPurple" />
      </motion.div>

      <motion.div variants={rowVariants} className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <div className={styles.tabGroup}>
            <button className={`${styles.tab} ${styles.tabActive}`}>Tất cả (12,840)</button>
            <button className={styles.tab}>Quyền Admin</button>
            <button className={styles.tab}>Bị chặn (42)</button>
          </div>
        </div>
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Tìm:</span>
          <div className={styles.searchGroup}>
            <MagnifyingGlass size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Tìm theo tên hoặc địa chỉ email..." />
          </div>
          <select className={styles.selectPill}>
            <option>Vai trò: Tất cả</option>
            <option>Admin</option>
            <option>Editor</option>
            <option>User</option>
          </select>
          <select className={styles.selectPill}>
            <option>Trạng thái: Tất cả</option>
            <option>Hoạt động</option>
            <option>Không hoạt động</option>
            <option>Bị chặn</option>
          </select>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Danh sách người dùng</h3>
          <button className={styles.tableAction}>Xuất danh sách</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>NGƯỜI DÙNG</th>
              <th>VAI TRÒ</th>
              <th>TRẠNG THÁI</th>
              <th>NGÀY THAM GIA</th>
              <th style={{ textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <motion.tr key={user.id} variants={rowVariants} custom={idx}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img src={user.avatar} alt="" style={{ width: '44px', height: '44px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #f1f5f9' }} />
                    <div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: '0 0 3px 0', fontFamily: "'Manrope', sans-serif" }}>{user.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Envelope size={12} style={{ color: '#cbd5e1' }} />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#94a3b8' }}>{user.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${getRoleStyle(user.role)}`}>{user.role}</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${getStatusStyle(user.status)}`}>
                    <StatusIcon status={user.status} />
                    {statusLabel[user.status]}
                  </span>
                </td>
                <td>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', margin: 0 }}>{user.joined}</p>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', margin: '2px 0 0 0' }}>#{user.id}</p>
                </td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button className={styles.actionBtn}><Pencil size={17} /></button>
                    <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`}><Trash size={17} /></button>
                    <button className={styles.actionBtn}><DotsThreeVertical size={17} weight="bold" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <p className={styles.paginationInfo}>Hiển thị <span>1–5</span> của <span>12,840</span> người dùng</p>
          <div className={styles.paginationBtns}>
            <button className={styles.pageBtn} disabled>‹</button>
            <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
            <span style={{ color: '#cbd5e1', fontWeight: 700, padding: '0 4px' }}>…</span>
            <button className={styles.pageBtn}>›</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UsersView;
