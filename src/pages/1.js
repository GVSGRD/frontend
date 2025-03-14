// src/pages/teams/[teamId].js
import Head from 'next/head';
import { Card, CardHeader, CardContent, Typography, Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';

// Sample data for team details
const teamDetails = {
  1: {
    logo: '/logo1.png', // Replace with your logo path
    name: 'Tech Innovators',
    topic: 'Software Development',
    bio: 'We are a group of passionate developers building the future of technology.',
    description: 'Our team focuses on cutting-edge technologies like AI, blockchain, and cloud computing. We believe in innovation and collaboration.',
    techStack: ['React', 'Node.js', 'Python', 'Blockchain'],
    members: [
      {
        id: 1,
        name: 'John Doe',
        role: 'Admin',
        avatar: '/avatar1.png', // Replace with your avatar path
      },
      {
        id: 2,
        name: 'Jane Smith',
        role: 'Member',
        avatar: '/avatar2.png', // Replace with your avatar path
      },
    ],
  },
  2: {
    logo: '/logo2.png', // Replace with your logo path
    name: 'Cinephiles United',
    topic: 'Film Analysis',
    bio: 'We are movie enthusiasts who love discussing the art of filmmaking.',
    description: 'From indie gems to blockbusters, we analyze and appreciate all forms of cinema.',
    techStack: ['Film Analysis', 'Scriptwriting', 'Cinematography'],
    members: [
      {
        id: 1,
        name: 'Alice Johnson',
        role: 'Admin',
        avatar: '/avatar3.png', // Replace with your avatar path
      },
      {
        id: 2,
        name: 'Bob Brown',
        role: 'Member',
        avatar: '/avatar4.png', // Replace with your avatar path
      },
    ],
  },
  3: {
    logo: '/logo3.png', // Replace with your logo path
    name: 'Food Lovers',
    topic: 'Culinary Arts',
    bio: 'We are foodies who love exploring and sharing recipes from around the world.',
    description: 'From street food to fine dining, we celebrate the diversity of global cuisine.',
    techStack: ['Cooking', 'Recipe Development', 'Food Photography'],
    members: [
      {
        id: 1,
        name: 'Charlie Davis',
        role: 'Admin',
        avatar: '/avatar5.png', // Replace with your avatar path
      },
      {
        id: 2,
        name: 'Diana Evans',
        role: 'Member',
        avatar: '/avatar6.png', // Replace with your avatar path
      },
    ],
  },
};

export default function TeamDetails() {
  const router = useRouter();
  const { teamId } = router.query;
  const team = teamDetails[teamId];

  if (!team) {
    return <Typography variant="h6">Team not found</Typography>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Head>
        <title>{team.name} - Team Details</title>
        <meta name="description" content="Team details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Team Details */}
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
            <CardHeader
              avatar={
                <Avatar src={team.logo} alt={team.name} sx={{ width: 56, height: 56 }} /> // Team logo
              }
              title={
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  {team.name}
                </Typography>
              }
              subheader={
                <Typography variant="body1" color="text.secondary">
                  {team.topic}
                </Typography>
              }
              sx={{ padding: '16px' }} // Consistent padding
            />
            <CardContent sx={{ padding: '16px' }}>
              <Typography variant="body1" color="text.primary" paragraph>
                <strong>Bio:</strong> {team.bio}
              </Typography>
              <Typography variant="body1" color="text.primary" paragraph>
                <strong>Description:</strong> {team.description}
              </Typography>
              <Typography variant="body1" color="text.primary" paragraph>
                <strong>Tech Stack/Tools:</strong> {team.techStack.join(', ')}
              </Typography>

              {/* Team Members */}
              <Typography variant="h6" color="text.primary" sx={{ marginTop: '16px' }}>
                Team Members
              </Typography>
              <List>
                {team.members.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemAvatar>
                      <Avatar src={member.avatar} alt={member.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={member.name}
                      secondary={member.role}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}