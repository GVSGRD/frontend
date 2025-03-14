import Head from 'next/head';
import { Card, CardHeader, CardContent, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material';

export default function Notifications() {
  const notifications = [
    { id: 1, type: 'like', user: 'John Doe', message: 'liked your post about Software Development.', timestamp: '2h', avatar: '/avatar1.jpg' },
    { id: 2, type: 'comment', user: 'Jane Smith', message: 'commented on your post about Film Analysis.', timestamp: '5h', avatar: '/avatar2.jpg' },
    { id: 3, type: 'follow', user: 'Alice Johnson', message: 'started following you.', timestamp: '1d', avatar: '/avatar3.jpg' },
    { id: 4, type: 'mention', user: 'Bob Brown', message: 'mentioned you in a comment.', timestamp: '3d', avatar: '/avatar4.jpg' },
  ];

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Head>
        <title>Notifications</title>
        <meta name="description" content="Your notifications" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Card sx={{ width: '100%', maxWidth: 800, borderRadius: 2, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}>
        <CardHeader
          title={<Typography variant="h6" fontWeight={600}>Notifications</Typography>}
          sx={{ padding: 2, borderBottom: '1px solid #e0e0e0' }}
        />
        <CardContent sx={{ padding: 0 }}>
          <List>
            {notifications.map(({ id, user, message, timestamp, avatar }) => (
              <ListItem
                key={id}
                sx={{
                  padding: 2,
                  borderBottom: '1px solid #e0e0e0',
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' },
                  transition: 'background-color 0.2s ease',
                }}
              >
                <ListItemAvatar>
                  <Avatar src={avatar} alt={user} sx={{ width: 48, height: 48 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#000' }}>
                      {user} <span style={{ fontWeight: 400, color: '#666' }}>{message}</span>
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#999' }}>
                      {timestamp}
                    </Typography>
                  }
                  sx={{ marginLeft: 2 }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}