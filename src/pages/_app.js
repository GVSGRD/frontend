// src/pages/_app.js
import '../styles/globals.css'; // Import global styles
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login'; // Check if current page is login
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          paddingBottom: router.pathname !== '/login' ? '80px' : '20px', // Add padding for bottom navbar
          marginLeft: router.pathname !== '/login' && !isMobile ? '250px' : '0', // Add margin for sidebar
          maxWidth: '100%', // Ensure content doesn't overflow
          overflowX: 'hidden', // Hide horizontal overflow
          backgroundColor: '#F8F9FA', // Light grey background
          transition: 'margin-left 0.3s ease', // Smooth transition for margin-left
        }}
      >
        <Component {...pageProps} />
      </div>

      {/* Conditionally render Sidebar */}
      {!isLoginPage && <Sidebar isMobile={isMobile} />}
    </div>
  );
}

export default MyApp;