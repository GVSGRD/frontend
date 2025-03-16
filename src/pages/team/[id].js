import Head from 'next/head';
import { useRouter } from 'next/router';
import { Typography, Avatar, IconButton, Chip, Box, Divider, Grid, Paper } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getTeamById, getTeamUsersByTeamId, getTechStacksByTeamId } from '../../utils/api';

export default function TeamDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [team, setTeam] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]);
  const [techStacks, setTechStacks] = useState([]);

  // Fetch team details, team users, and tech stacks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamData = await getTeamById(id);
        setTeam(teamData);

        const usersData = await getTeamUsersByTeamId(id);
        setTeamUsers(usersData);

        const techStacksData = await getTechStacksByTeamId(id);
        setTechStacks(techStacksData);
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!team) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Head>
        <title>{team.name}</title>
        <meta name="description" content={`Details of ${team.name}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Back Button */}
      <IconButton onClick={() => router.back()} style={{ marginBottom: '16px' }}>
        <FaArrowLeft />
      </IconButton>

      {/* Main Content */}
      <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
        {/* Team Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <Avatar
            src={team.profileImageUrl}
            alt={team.name}
            sx={{ width: 100, height: 100, marginRight: '16px' }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {team.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {team.tagLine}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ marginBottom: '24px' }} />

        {/* Team Description */}
        <Paper elevation={0} sx={{ padding: '16px', marginBottom: '24px', backgroundColor: '#fff' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            About the Team
          </Typography>
          <Typography variant="body1" paragraph>
            {team.description}
          </Typography>
        </Paper>

        {/* Team Members */}
        <Paper elevation={0} sx={{ padding: '16px', marginBottom: '24px', backgroundColor: '#fff' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Team Members
          </Typography>
          <Grid container spacing={2}>
            {teamUsers.map((user) => (
              <Grid item xs={12} sm={6} key={user.id}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={user.user.profileImageUrl}
                    alt={user.user.name}
                    sx={{ width: 56, height: 56, marginRight: '16px' }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {user.user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.user.designation}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Tech Stacks */}
        <Paper elevation={0} sx={{ padding: '16px', backgroundColor: '#fff' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Tech Stacks
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {techStacks.map((tech) => (
              <Chip key={tech.id} label={tech.technology} sx={{ borderRadius: '4px' }} />
            ))}
          </Box>
        </Paper>
      </Box>
    </div>
  );
}