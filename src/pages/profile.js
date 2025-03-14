// src/pages/profile.js
import Head from 'next/head';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  TextField,
  IconButton,
} from '@mui/material';
import {
  FaBriefcase,
  FaGraduationCap,
  FaThumbsUp,
  FaLink,
  FaEnvelope,
  FaEdit,
} from 'react-icons/fa';
import { useState } from 'react';

// Reusable Editable Text Component
const EditableText = ({ isEditMode, value, onChange, multiline, rows, variant = 'body1', fontWeight = 'normal' }) => {
  return isEditMode ? (
    <TextField
      fullWidth
      multiline={multiline}
      rows={rows}
      value={value}
      onChange={onChange}
      variant="outlined"
    />
  ) : (
    <Typography variant={variant} fontWeight={fontWeight} color="text.primary">
      {value}
    </Typography>
  );
};

// Profile Header Component
const ProfileHeader = ({ profile, isEditMode, toggleEditMode, handleInputChange }) => {
  return (
    <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginBottom: '20px' }}>
      <CardHeader
        avatar={<Avatar src={profile.avatar} alt={profile.name} sx={{ width: 100, height: 100 }} />}
        title={
          <>
            <EditableText
              isEditMode={isEditMode}
              value={profile.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              variant="h4"
              fontWeight="bold"
            />
            <EditableText
              isEditMode={isEditMode}
              value={profile.headline}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              variant="body1"
            />
            <EditableText
              isEditMode={isEditMode}
              value={profile.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              variant="body2"
            />
            {!isEditMode && (
              <Typography variant="body2" color="text.secondary">
                {profile.connections} connections
              </Typography>
            )}
          </>
        }
        action={
          <IconButton onClick={toggleEditMode} sx={{ color: 'text.primary' }}>
            <FaEdit />
          </IconButton>
        }
        sx={{ padding: '24px' }}
      />
      <CardContent sx={{ padding: '24px' }}>
        <Button variant="contained" color="primary" startIcon={<FaEnvelope />} sx={{ marginRight: '8px' }}>
          Message
        </Button>
        <Button variant="outlined" color="primary" startIcon={<FaLink />}>
          Connect
        </Button>
      </CardContent>
    </Card>
  );
};

// About Section Component
const AboutSection = ({ profile, isEditMode, handleInputChange }) => {
  return (
    <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginBottom: '20px' }}>
      <CardHeader
        title={<Typography variant="h6" fontWeight="bold" color="text.primary">About</Typography>}
        sx={{ padding: '16px' }}
      />
      <CardContent sx={{ padding: '16px' }}>
        <EditableText
          isEditMode={isEditMode}
          value={profile.about}
          onChange={(e) => handleInputChange('about', e.target.value)}
          multiline
          rows={4}
        />
      </CardContent>
    </Card>
  );
};

// Experience Section Component
const ExperienceSection = ({ profile, isEditMode, handleInputChange }) => {
  return (
    <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginBottom: '20px' }}>
      <CardHeader
        title={<Typography variant="h6" fontWeight="bold" color="text.primary">Experience</Typography>}
        sx={{ padding: '16px' }}
      />
      <CardContent sx={{ padding: '16px' }}>
        <List>
          {profile.experience.map((exp) => (
            <ListItem key={exp.id} sx={{ padding: '8px 0' }}>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#e9ecef', color: '#212529' }}>
                  <FaBriefcase />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <EditableText
                      isEditMode={isEditMode}
                      value={exp.role}
                      onChange={(e) => {
                        const updatedExperience = profile.experience.map((item) =>
                          item.id === exp.id ? { ...item, role: e.target.value } : item
                        );
                        handleInputChange('experience', updatedExperience);
                      }}
                      variant="body1"
                      fontWeight="bold"
                    />
                    <EditableText
                      isEditMode={isEditMode}
                      value={exp.company}
                      onChange={(e) => {
                        const updatedExperience = profile.experience.map((item) =>
                          item.id === exp.id ? { ...item, company: e.target.value } : item
                        );
                        handleInputChange('experience', updatedExperience);
                      }}
                      variant="body2"
                    />
                  </>
                }
                secondary={
                  <EditableText
                    isEditMode={isEditMode}
                    value={exp.description}
                    onChange={(e) => {
                      const updatedExperience = profile.experience.map((item) =>
                        item.id === exp.id ? { ...item, description: e.target.value } : item
                      );
                      handleInputChange('experience', updatedExperience);
                    }}
                    multiline
                    rows={2}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Education Section Component
const EducationSection = ({ profile, isEditMode, handleInputChange }) => {
  return (
    <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginBottom: '20px' }}>
      <CardHeader
        title={<Typography variant="h6" fontWeight="bold" color="text.primary">Education</Typography>}
        sx={{ padding: '16px' }}
      />
      <CardContent sx={{ padding: '16px' }}>
        <List>
          {profile.education.map((edu) => (
            <ListItem key={edu.id} sx={{ padding: '8px 0' }}>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#e9ecef', color: '#212529' }}>
                  <FaGraduationCap />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    <EditableText
                      isEditMode={isEditMode}
                      value={edu.school}
                      onChange={(e) => {
                        const updatedEducation = profile.education.map((item) =>
                          item.id === edu.id ? { ...item, school: e.target.value } : item
                        );
                        handleInputChange('education', updatedEducation);
                      }}
                      variant="body1"
                      fontWeight="bold"
                    />
                    <EditableText
                      isEditMode={isEditMode}
                      value={edu.degree}
                      onChange={(e) => {
                        const updatedEducation = profile.education.map((item) =>
                          item.id === edu.id ? { ...item, degree: e.target.value } : item
                        );
                        handleInputChange('education', updatedEducation);
                      }}
                      variant="body2"
                    />
                  </>
                }
                secondary={
                  <EditableText
                    isEditMode={isEditMode}
                    value={edu.duration}
                    onChange={(e) => {
                      const updatedEducation = profile.education.map((item) =>
                        item.id === edu.id ? { ...item, duration: e.target.value } : item
                      );
                      handleInputChange('education', updatedEducation);
                    }}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Skills Section Component
const SkillsSection = ({ profile, isEditMode, handleInputChange }) => {
  return (
    <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginBottom: '20px' }}>
      <CardHeader
        title={<Typography variant="h6" fontWeight="bold" color="text.primary">Skills</Typography>}
        sx={{ padding: '16px' }}
      />
      <CardContent sx={{ padding: '16px' }}>
        {isEditMode ? (
          <TextField
            fullWidth
            value={profile.skills.join(', ')}
            onChange={(e) => {
              const skills = e.target.value.split(',').map((skill) => skill.trim());
              handleInputChange('skills', skills);
            }}
            variant="outlined"
          />
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile.skills.map((skill, index) => (
              <Chip key={index} label={skill} sx={{ borderRadius: '4px' }} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Recommendations Section Component
const RecommendationsSection = ({ profile }) => {
  return (
    <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginBottom: '20px' }}>
      <CardHeader
        title={<Typography variant="h6" fontWeight="bold" color="text.primary">Recommendations</Typography>}
        sx={{ padding: '16px' }}
      />
      <CardContent sx={{ padding: '16px' }}>
        <List>
          {profile.recommendations.map((rec) => (
            <ListItem key={rec.id} sx={{ padding: '8px 0' }}>
              <ListItemAvatar>
                <Avatar src={rec.avatar} alt={rec.user} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="body1" fontWeight="bold" color="text.primary">{rec.user}</Typography>}
                secondary={
                  <>
                    <Typography variant="body2" color="text.primary">{rec.role}</Typography>
                    <Typography variant="body2" color="text.secondary">{rec.message}</Typography>
                  </>
                }
              />
              <FaThumbsUp style={{ color: '#4dabf7', marginLeft: 'auto' }} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Main Profile Component
export default function Profile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    headline: 'Software Engineer at Tech Innovators',
    location: 'San Francisco, CA',
    connections: 500,
    avatar: '/avatar.jpg',
    about: 'Passionate software engineer with expertise in AI, blockchain, and full-stack development.',
    experience: [
      {
        id: 1,
        role: 'Software Engineer',
        company: 'Tech Innovators',
        duration: 'Jan 2020 - Present',
        description: 'Developing cutting-edge AI solutions and blockchain applications.',
      },
      {
        id: 2,
        role: 'Intern',
        company: 'Code Masters',
        duration: 'Jun 2019 - Dec 2019',
        description: 'Assisted in building scalable web applications using React and Node.js.',
      },
    ],
    education: [
      {
        id: 1,
        school: 'Stanford University',
        degree: 'Master of Science in Computer Science',
        duration: '2017 - 2019',
      },
      {
        id: 2,
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        duration: '2013 - 2017',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'AI', 'Blockchain', 'Python'],
    recommendations: [
      {
        id: 1,
        user: 'Jane Smith',
        role: 'Senior Product Manager at Tech Innovators',
        message: 'John is an exceptional engineer with a deep understanding of AI and blockchain.',
        avatar: '/avatar2.jpg',
      },
      {
        id: 2,
        user: 'Alice Johnson',
        role: 'CTO at Code Masters',
        message: 'John is a quick learner and a great team player.',
        avatar: '/avatar3.jpg',
      },
    ],
  });

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const handleInputChange = (field, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [field]: value,
    }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#fafafa' }}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ProfileHeader profile={profile} isEditMode={isEditMode} toggleEditMode={toggleEditMode} handleInputChange={handleInputChange} />
      <AboutSection profile={profile} isEditMode={isEditMode} handleInputChange={handleInputChange} />
      <ExperienceSection profile={profile} isEditMode={isEditMode} handleInputChange={handleInputChange} />
      <EducationSection profile={profile} isEditMode={isEditMode} handleInputChange={handleInputChange} />
      <SkillsSection profile={profile} isEditMode={isEditMode} handleInputChange={handleInputChange} />
      <RecommendationsSection profile={profile} />
    </div>
  );
}