// src/pages/requests/index.js
import Head from 'next/head';
import { useRouter } from 'next/router'; // Import useRouter
import { Card, CardHeader, CardContent, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Button, Grid } from '@mui/material';
import { FaUserPlus, FaCheck, FaTimes } from 'react-icons/fa'; // React Icons
import { useState, useEffect } from 'react';
import { getRequestsByUserId, acceptRequest, rejectRequest } from '../utils/api';

export default function Requests() {
  const router = useRouter(); // Initialize useRouter
  const [requests, setRequests] = useState([]);

  // Fetch requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Get user ID from localStorage
        const data = await getRequestsByUserId(userId);
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  // Handle accept request
  const handleAccept = async (requestId) => {
    try {
      await acceptRequest(requestId);
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
      console.log(`Accepted request with ID: ${requestId}`);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  // Handle reject request
  const handleReject = async (requestId) => {
    try {
      await rejectRequest(requestId);
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
      console.log(`Rejected request with ID: ${requestId}`);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  // Helper function to get the appropriate message based on request type
  const getRequestMessage = (request) => {
    return (
      <>
        <span
          onClick={() => router.push(`/profile/${request.user.id}`)}
          style={{
            cursor: 'pointer',
            color: '#1976d2', // Blue color
            fontWeight: 500, // Slightly bold
            '&:hover': { textDecoration: 'underline' }, // Underline on hover
          }}
        >
          {request.user.name}
        </span>{' '}
        wants to join your team{' '}
        <span
          onClick={() => router.push(`/team/${request.team.id}`)}
          style={{
            cursor: 'pointer',
            color: '#1976d2', // Blue color
            fontWeight: 500, // Slightly bold
            '&:hover': { textDecoration: 'underline' }, // Underline on hover
          }}
        >
          {request.team.name}
        </span>
        .
      </>
    );
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa, #f5f7fa)' }}>
      <Head>
        <title>Requests</title>
        <meta name="description" content="Your requests" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Requests List */}
      <Card
        sx={{
          maxWidth: '800px',
          margin: '0 auto',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ fontFamily: 'Poppins, sans-serif' }}>
              Requests
            </Typography>
          }
          sx={{ padding: '24px', borderBottom: '1px solid #e9ecef', backgroundColor: '#ffffff' }}
        />
        <CardContent sx={{ padding: '0', backgroundColor: '#ffffff' }}>
          <List>
            {requests.map((request) => (
              <ListItem
                key={request.id}
                sx={{
                  padding: '16px 24px',
                  borderBottom: '1px solid #e9ecef',
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover': { backgroundColor: '#f8f9fa', cursor: 'pointer' },
                  transition: 'background-color 0.3s ease',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
                  alignItems: { xs: 'flex-start', sm: 'center' }, // Align items to start on mobile
                  gap: { xs: 2, sm: 0 }, // Add gap between items on mobile
                }}
              >
                {/* Avatar */}
                <ListItemAvatar sx={{ minWidth: 'auto', marginRight: { xs: 0, sm: '16px' } }}>
                  <Avatar
                    src={request.user.profileImageUrl}
                    alt={request.user.name}
                    sx={{
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer', // Add cursor pointer
                    }}
                    onClick={() => router.push(`/profile/${request.user.id}`)} // Navigate to user profile
                  />
                </ListItemAvatar>

                {/* Text Content */}
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: '0.9rem', sm: '1rem' }, // Smaller font on mobile
                      }}
                    >
                      {getRequestMessage(request)}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Smaller font on mobile
                      }}
                    >
                      {new Date(request.joinDate).toLocaleString()}
                    </Typography>
                  }
                  sx={{ marginRight: { xs: 0, sm: '16px' }, flex: 1 }} // Adjust margin for mobile
                />

                {/* Buttons */}
                <Grid
                  container
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{
                    flexWrap: 'nowrap',
                    flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons vertically on mobile
                    gap: { xs: 1, sm: 2 }, // Add gap between buttons
                    width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                  }}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<FaCheck />}
                      onClick={() => handleAccept(request.id)}
                      sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        '&:hover': { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' },
                        width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }, // Smaller font on mobile
                        padding: { xs: '6px 12px', sm: '8px 16px' }, // Smaller padding on mobile
                      }}
                    >
                      Accept
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<FaTimes />}
                      onClick={() => handleReject(request.id)}
                      sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        '&:hover': { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' },
                        width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }, // Smaller font on mobile
                        padding: { xs: '6px 12px', sm: '8px 16px' }, // Smaller padding on mobile
                      }}
                    >
                      Reject
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
}