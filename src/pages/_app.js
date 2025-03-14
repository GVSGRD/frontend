import '../styles/globals.css'; // Import global styles
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/'; // Check if current page is login
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
          padding: isLoginPage ? '0' : '20px', // No padding for login page
          paddingBottom: isLoginPage ? '0' : '80px', // No padding for login page
          marginLeft: isLoginPage || isMobile ? '0' : '250px', // No margin for login page or mobile
          maxWidth: '100%', // Ensure content doesn't overflow
          overflowX: 'hidden', // Hide horizontal overflow
          backgroundColor: isLoginPage ? '#f0f0f0' : '#F8F9FA', // Use login page background for login
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