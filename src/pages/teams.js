// src/pages/teams/index.js
import Head from 'next/head';
import { Card, CardHeader, CardContent, Typography, Avatar, TextField, InputAdornment } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // React Icons

export default function Teams() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for teams
  const teams = [
    {
      id: 1,
      logo: '/logo1.png', // Replace with your logo path
      name: 'Tech Innovators',
      topic: 'Software Development',
      shortDescription: 'Building the future of technology with AI and blockchain.',
    },
    {
      id: 2,
      logo: '/logo2.png', // Replace with your logo path
      name: 'Cinephiles United',
      topic: 'Film Analysis',
      shortDescription: 'Discussing the most anticipated movies of the year.',
    },
    {
      id: 3,
      logo: '/logo3.png', // Replace with your logo path
      name: 'Food Lovers',
      topic: 'Culinary Arts',
      shortDescription: 'Exploring delicious recipes from around the world.',
    },
    {
      id: 4,
      logo: '/logo4.png', // Replace with your logo path
      name: 'Fitness Enthusiasts',
      topic: 'Health & Fitness',
      shortDescription: 'Sharing tips and routines for a healthier lifestyle.',
    },
    {
      id: 5,
      logo: '/logo5.png', // Replace with your logo path
      name: 'Travel Buddies',
      topic: 'Travel & Adventure',
      shortDescription: 'Discovering hidden gems and travel hacks around the globe.',
    },
    {
      id: 6,
      logo: '/logo6.png', // Replace with your logo path
      name: 'Bookworms',
      topic: 'Literature',
      shortDescription: 'Discussing classic and contemporary literature.',
    },
    {
      id: 7,
      logo: '/logo7.png', // Replace with your logo path
      name: 'Gamers Guild',
      topic: 'Gaming',
      shortDescription: 'Exploring the latest in gaming and esports.',
    },
    {
      id: 8,
      logo: '/logo8.png', // Replace with your logo path
      name: 'Artisans',
      topic: 'Art & Design',
      shortDescription: 'Celebrating creativity in art and design.',
    },
    {
      id: 9,
      logo: '/logo1.png', // Replace with your logo path
      name: 'Tech Innovators',
      topic: 'Software Development',
      shortDescription: 'Building the future of technology with AI and blockchain.',
    },
  ];

  // Filter teams based on search query
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate to team details page
  const handleTeamClick = (teamId) => {
    router.push(`/teams/${teamId}`);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Head>
        <title>Teams</title>
        <meta name="description" content="List of teams" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Search Bar */}
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '24px' }}>
        <TextField
          fullWidth
          placeholder="Search teams..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* List of Teams */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
          padding: '0 16px',
        }}
      >
        {filteredTeams.map((team) => (
          <Card
            key={team.id}
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              height: '100%', // Ensure all cards have the same height
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={() => handleTeamClick(team.id)}
          >
            <CardHeader
              avatar={
                <Avatar src={team.logo} alt={team.name} sx={{ width: 56, height: 56 }} /> // Team logo
              }
              title={
                <Typography variant="h6" fontWeight="bold" color="text.primary" noWrap>
                  {team.name}
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary" noWrap>
                  {team.topic}
                </Typography>
              }
              sx={{ padding: '16px' }} // Consistent padding
            />
            <CardContent sx={{ padding: '16px', flex: 1 }}>
              <Typography
                variant="body1"
                color="text.primary"
                paragraph
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3, // Limit to 3 lines
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {team.shortDescription}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}