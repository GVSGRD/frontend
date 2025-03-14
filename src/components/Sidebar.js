// src/components/Sidebar.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Sidebar.module.css';
import {
  FaHome,
  FaUsers,
  FaEnvelope,
  FaBell,
  FaUserFriends,
  FaUser,
} from 'react-icons/fa';

export default function Sidebar({ isMobile }) {
  const router = useRouter();

  // Define menu items with icons
  const menuItems = [
    { href: '/', icon: <FaHome />, label: 'Home' },
    { href: '/teams', icon: <FaUsers />, label: 'Teams' },
    { href: '/messages', icon: <FaEnvelope />, label: 'Messages' },
    { href: '/notifications', icon: <FaBell />, label: 'Notifications' },
    { href: '/requests', icon: <FaUserFriends />, label: 'Requests' },
    { href: '/profile', icon: <FaUser />, label: 'Profile' },
  ];

  return (
    <div className={styles.sidebar}>
      {/* Conditionally render the logo only in desktop view */}
      {!isMobile && <h2 className={styles.logo}>ZoinMe</h2>}

      <ul className={styles.menu}>
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`${styles.menuItem} ${
                router.pathname === item.href ? styles.active : ''
              }`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {/* Conditionally render the label only in desktop view */}
              {!isMobile && <span className={styles.label}>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}