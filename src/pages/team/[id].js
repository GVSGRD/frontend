import Head from 'next/head';
import { useRouter } from 'next/router';
import { Typography, Avatar, IconButton, Chip, Box, Divider, Grid, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FaArrowLeft, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getTeamById, getTeamUsersByTeamId, getTechStacksByTeamId, createTeamUser, getTeamUserByUserIdAndTeamId, updateTeam, createTechStack, updateTechStack, deleteTechStack } from '../../utils/api';

export default function TeamDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [team, setTeam] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]);
  const [techStacks, setTechStacks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [joinStatus, setJoinStatus] = useState(null); // 'ACCEPTED', 'PENDING', or null
  const [openTechStackModal, setOpenTechStackModal] = useState(false);
  const [newTechStack, setNewTechStack] = useState('');
  const storedUserId = localStorage.getItem('userId');

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

        // Check if the current user is part of the team
        if (storedUserId) {
          const teamUser = await getTeamUserByUserIdAndTeamId(id, storedUserId);
          console.log("Hi" + teamUser.status);
          if (teamUser) {
            setJoinStatus(teamUser.status); // Set status to 'ACCEPTED' or 'PENDING'
          } else {
            setJoinStatus(null); // No entry, user is not part of the team
          }
        }
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, storedUserId]);

  const handleUserClick = (userId) => {
    router.push(`/profile/${userId}`);
  };

  const handleJoinTeam = async () => {
    try {
      const response = await createTeamUser({
        team: { id: team.id },
        user: { id: storedUserId },
        joinDate: new Date().toISOString(),
        status: 'PENDING',
      });
      setJoinStatus('PENDING'); // Update status to 'PENDING'
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const handleSaveTeam = async () => {
    try {
      await updateTeam(team);
      toggleEditMode();
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  const handleAddTechStack = async () => {
    try {
      const newTech = await createTechStack({ teamId: team.id, technology: newTechStack });
      setTechStacks([...techStacks, newTech]);
      setOpenTechStackModal(false);
      setNewTechStack('');
    } catch (error) {
      console.error('Error adding tech stack:', error);
    }
  };

  const handleUpdateTechStack = async (techStack) => {
    try {
      const updatedTechStack = await updateTechStack(techStack);
      setTechStacks(techStacks.map(tech => tech.id === updatedTechStack.id ? updatedTechStack : tech));
    } catch (error) {
      console.error('Error updating tech stack:', error);
    }
  };

  const handleDeleteTechStack = async (id) => {
    try {
      await deleteTechStack(id);
      setTechStacks(techStacks.filter(tech => tech.id !== id));
    } catch (error) {
      console.error('Error deleting tech stack:', error);
    }
  };

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
            {isEditMode ? (
              <>
                <TextField
                  fullWidth
                  value={team.name}
                  onChange={(e) => setTeam({ ...team, name: e.target.value })}
                  variant="outlined"
                  sx={{ marginBottom: '8px' }}
                />
                <TextField
                  fullWidth
                  value={team.tagLine}
                  onChange={(e) => setTeam({ ...team, tagLine: e.target.value })}
                  variant="outlined"
                />
              </>
            ) : (
              <>
                <Typography variant="h4" fontWeight="bold">
                  {team.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {team.tagLine}
                </Typography>
              </>
            )}
          </Box>
          {storedUserId && (
            <>
              {joinStatus === 'ACCEPTED' ? (
                isEditMode ? (
                  <Button onClick={handleSaveTeam} variant="contained" color="primary" sx={{ marginLeft: 'auto' }}>
                    Save
                  </Button>
                ) : (
                  <IconButton onClick={toggleEditMode} sx={{ marginLeft: 'auto' }}>
                    <FaEdit />
                  </IconButton>
                )
              ) : joinStatus === 'PENDING' ? (
                <Button variant="contained" disabled sx={{ marginLeft: 'auto' }}>
                  Requested
                </Button>
              ) : (
                <Button
                  onClick={handleJoinTeam}
                  variant="contained"
                  color="primary"
                  sx={{ marginLeft: 'auto' }}
                >
                  Join
                </Button>
              )}
            </>
          )}
        </Box>

        <Divider sx={{ marginBottom: '24px' }} />

        {/* Team Description */}
        <Paper elevation={0} sx={{ padding: '16px', marginBottom: '24px', backgroundColor: '#fff' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            About the Team
          </Typography>
          {isEditMode ? (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={team.description}
              onChange={(e) => setTeam({ ...team, description: e.target.value })}
              variant="outlined"
            />
          ) : (
            <Typography variant="body1" paragraph>
              {team.description}
            </Typography>
          )}
        </Paper>

        {/* Team Members */}
        <Paper elevation={0} sx={{ padding: '16px', marginBottom: '24px', backgroundColor: '#fff' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Team Members
          </Typography>
          <Grid container spacing={2}>
            {teamUsers.map((user) => (
              <Grid item xs={12} sm={6} key={user.id}>
                <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => handleUserClick(user.user.id)} style={{ cursor: 'pointer' }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tech Stacks
            </Typography>
            {isEditMode && (
              <IconButton onClick={() => setOpenTechStackModal(true)} sx={{ marginLeft: 'auto' }}>
                <FaPlus />
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {techStacks.map((tech) => (
              <Chip
                key={tech.id}
                label={tech.technology}
                sx={{ borderRadius: '4px' }}
                onDelete={isEditMode ? () => handleDeleteTechStack(tech.id) : null}
              />
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Add Tech Stack Modal */}
      <Dialog open={openTechStackModal} onClose={() => setOpenTechStackModal(false)}>
        <DialogTitle>Add New Tech Stack</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Technology"
            value={newTechStack}
            onChange={(e) => setNewTechStack(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTechStackModal(false)}>Cancel</Button>
          <Button onClick={handleAddTechStack} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}