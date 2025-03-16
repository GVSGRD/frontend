import Head from 'next/head';
import { Card, CardHeader, CardContent, Typography, Avatar, TextField, InputAdornment } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getTeamsByUserId } from '../utils/api';

export default function Teams() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState([]);

  // Fetch teams by user ID
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Get user ID from localStorage
        const response = await getTeamsByUserId(userId);
        setTeams(response.map((item) => item.team)); // Extract team data from response
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  // Filter teams based on search query
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.tagLine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle team click to navigate to team details
  const handleTeamClick = (teamId) => {
    router.push(`/team/${teamId}`);
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
            style: { borderRadius: '24px', backgroundColor: '#fff' },
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
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={() => handleTeamClick(team.id)}
          >
            <CardHeader
              avatar={
                <Avatar src={team.profileImageUrl} alt={team.name} sx={{ width: 56, height: 56 }} />
              }
              title={
                <Typography variant="h6" fontWeight="bold" color="text.primary" noWrap>
                  {team.name}
                </Typography>
              }
              subheader={
                <Typography variant="body2" color="text.secondary" noWrap>
                  {team.tagLine}
                </Typography>
              }
              sx={{ padding: '16px' }}
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
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {team.bio}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}