// src/pages/index.js
import Head from 'next/head';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, Button, TextField, InputAdornment } from '@mui/material';
import { FaHeart, FaComment, FaShare, FaUserPlus, FaSearch } from 'react-icons/fa'; // React Icons

export default function Home() {
  // Sample data for posts
  const posts = [
    {
      id: 1,
      teamName: 'Tech Innovators',
      topic: 'Software',
      description: 'Discover the latest trends in software development and how they are shaping the future of technology. From AI to blockchain, we cover it all.',
      image: '/img1.jpg', // Replace with your image path
      likes: 120,
      comments: 45,
    },
    {
      id: 2,
      teamName: 'Cinephiles United',
      topic: 'Movie',
      description: 'Join us as we discuss the most anticipated movies of the year and their impact on the film industry. From indie gems to blockbusters, we’ve got you covered.',
      image: '/img2.jpg', // Replace with your image path
      likes: 98,
      comments: 32,
    },
    {
      id: 3,
      teamName: 'Food Lovers',
      topic: 'Food',
      description: 'Explore delicious recipes and culinary tips from around the world to elevate your cooking game. From street food to fine dining, we celebrate all things food.',
      image: '/img3.jpg', // Replace with your image path
      likes: 150,
      comments: 60,
    },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="News feed for teams and topics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Search Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '24px' }}>
        <TextField
          fullWidth
          placeholder="Search posts..."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch style={{ color: '#6c757d' }} /> {/* Search icon */}
              </InputAdornment>
            ),
            style: { borderRadius: '24px', backgroundColor: '#fff' }, // Rounded search bar
          }}
        />
      </div>

      {/* News Feed Posts */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {posts.map((post) => (
          <Card key={post.id} style={{ marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
            <CardHeader
              avatar={
                <Avatar src="/logo.png" alt="Logo" sx={{ width: 48, height: 48 }} /> // Simple avatar
              }
              title={
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  {post.teamName}
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary">
                  {post.topic}
                </Typography>
              }
              sx={{ padding: '16px' }} // Consistent padding
            />
            <CardContent sx={{ padding: '16px' }}>
              <Typography variant="body1" color="text.primary" paragraph>
                {post.description}
              </Typography>

              {/* Optional Image */}
              {post.image && (
                <div style={{ marginTop: '16px' }}>
                  <Image
                    src={post.image}
                    alt={post.topic}
                    width={600}
                    height={400}
                    style={{ borderRadius: '8px', width: '100%', height: 'auto' }}
                  />
                </div>
              )}
            </CardContent>

            <CardActions style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <IconButton aria-label="like" sx={{ color: 'text.secondary' }}>
                  <FaHeart />
                  <Typography variant="body2" color="text.secondary" sx={{ marginLeft: '8px' }}>
                    {post.likes}
                  </Typography>
                </IconButton>
                <IconButton aria-label="comment" sx={{ color: 'text.secondary' }}>
                  <FaComment />
                  <Typography variant="body2" color="text.secondary" sx={{ marginLeft: '8px' }}>
                    {post.comments}
                  </Typography>
                </IconButton>
                <IconButton aria-label="share" sx={{ color: 'text.secondary' }}>
                  <FaShare />
                </IconButton>
              </div>
              <Button variant="outlined" color="primary" startIcon={<FaUserPlus />} sx={{ borderRadius: '20px', textTransform: 'none' }}>
                Join
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
}