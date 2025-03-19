import Head from 'next/head';
import { useRouter } from 'next/router'; // Move useRouter to the top level
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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  FaBriefcase,
  FaGraduationCap,
  FaThumbsUp,
  FaLink,
  FaEnvelope,
  FaEdit,
  FaPlus,
  FaTrash,
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import {
  getUserById,
  updateUser,
  createExperience,
  updateExperience,
  deleteExperience,
  getExperiencesByUser,
  createEducation,
  updateEducation,
  deleteEducation,
  getEducationsByUser,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsByUser,
} from '../../utils/api';

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
const ProfileHeader = ({ profile, isEditMode, toggleEditMode, handleInputChange, handleSave }) => {
  return (
    <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginBottom: '20px' }}>
      <CardHeader
        avatar={<Avatar src={profile.profileImageUrl} alt={profile.name} sx={{ width: 100, height: 100 }} />}
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
              value={profile.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              variant="body1"
            />
            <EditableText
              isEditMode={isEditMode}
              value={profile.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              variant="body2"
            />
            {!isEditMode && (
              <Box sx={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <IconButton href={profile.github} target="_blank">
                  <FaGithub />
                </IconButton>
                <IconButton href={profile.linkedin} target="_blank">
                  <FaLinkedin />
                </IconButton>
              </Box>
            )}
          </>
        }
        action={
            profile.id == localStorage.getItem('userId') ? (
                isEditMode ? (
                  <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                  </Button>
                ) : (
                  <IconButton onClick={toggleEditMode} sx={{ color: 'text.primary' }}>
                    <FaEdit />
                  </IconButton>
                )
              ) : null
            }
        sx={{ padding: '24px' }}
      />
    </Card>
  );
};

// Experience Section Component
const ExperienceSection = ({ experiences, isEditMode, handleAddExperience, handleEditExperience, handleDeleteExperience }) => {
  const [editId, setEditId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newExperience, setNewExperience] = useState({
    companyLogo: '',
    designation: '',
    company: '',
    fromDate: '',
    toDate: '',
    description: '',
  });

  const handleSave = (exp) => {
    handleEditExperience(exp);
    setEditId(null);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleSaveNewExperience = () => {
    if (newExperience.designation && newExperience.company && newExperience.fromDate) {
      handleAddExperience(newExperience);
      setOpenModal(false);
      setNewExperience({
        companyLogo: '',
        designation: '',
        company: '',
        fromDate: '',
        toDate: '',
        description: '',
      });
    }
  };

  return (
    <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginBottom: '20px' }}>
      <CardHeader
        title={<Typography variant="h6" fontWeight="bold" color="text.primary">Experience</Typography>}
        action={
          isEditMode && (
            <IconButton onClick={handleOpenModal}>
              <FaPlus />
            </IconButton>
          )
        }
        sx={{ padding: '16px' }}
      />
      <CardContent sx={{ padding: '16px' }}>
        <List>
          {experiences.map((exp) => (
            <ListItem key={exp.id} sx={{ padding: '8px 0' }}>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#e9ecef', color: '#212529' }}>
                  <FaBriefcase />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  editId === exp.id ? (
                    <>
                      <TextField
                        fullWidth
                        value={exp.designation}
                        onChange={(e) => handleEditExperience({ ...exp, designation: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        value={exp.company}
                        onChange={(e) => handleEditExperience({ ...exp, company: e.target.value })}
                      />
                    </>
                  ) : (
                    <>
                      <Typography variant="body1" fontWeight="bold">{exp.designation}</Typography>
                      <Typography variant="body2">{exp.company}</Typography>
                    </>
                  )
                }
                secondary={
                  editId === exp.id ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={exp.description}
                      onChange={(e) => handleEditExperience({ ...exp, description: e.target.value })}
                    />
                  ) : (
                    <Typography variant="body2">{exp.description}</Typography>
                  )
                }
              />
              {isEditMode && (
                <Box>
                  {editId === exp.id ? (
                    <IconButton onClick={() => handleSave(exp)}>
                      <FaEdit />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => setEditId(exp.id)}>
                      <FaEdit />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDeleteExperience(exp.id)}>
                    <FaTrash />
                  </IconButton>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>

      {/* Add Experience Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add New Experience</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Designation"
            value={newExperience.designation}
            onChange={(e) => setNewExperience({ ...newExperience, designation: e.target.value })}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            fullWidth
            label="Company"
            value={newExperience.company}
            onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            fullWidth
            label="From Date"
            type="date"
            value={newExperience.fromDate}
            onChange={(e) => setNewExperience({ ...newExperience, fromDate: e.target.value })}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            fullWidth
            label="To Date"
            type="date"
            value={newExperience.toDate}
            onChange={(e) => setNewExperience({ ...newExperience, toDate: e.target.value })}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={2}
            value={newExperience.description}
            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSaveNewExperience} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

// Education Section Component
const EducationSection = ({ educations, isEditMode, handleAddEducation, handleEditEducation, handleDeleteEducation }) => {
  const [editId, setEditId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newEducation, setNewEducation] = useState({
    universityLogo: '',
    universityName: '',
    degree: '',
    fromDate: '',
    toDate: '',
  });

  const handleSave = (edu) => {
    handleEditEducation(edu);
    setEditId(null);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleSaveNewEducation = () => {
    if (newEducation.universityName && newEducation.degree && newEducation.fromDate) {
      handleAddEducation(newEducation);
      setOpenModal(false);
      setNewEducation({
        universityLogo: '',
        universityName: '',
        degree: '',
        fromDate: '',
        toDate: '',
      });
    }
  };

  return (
    <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginBottom: '20px' }}>
      <CardHeader
        title={<Typography variant="h6" fontWeight="bold" color="text.primary">Education</Typography>}
        action={
          isEditMode && (
            <IconButton onClick={handleOpenModal}>
              <FaPlus />
            </IconButton>
          )
        }
        sx={{ padding: '16px' }}
      />
      <CardContent sx={{ padding: '16px' }}>
        <List>
          {educations.map((edu) => (
            <ListItem key={edu.id} sx={{ padding: '8px 0' }}>
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#e9ecef', color: '#212529' }}>
                  <FaGraduationCap />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  editId === edu.id ? (
                    <>
                      <TextField
                        fullWidth
                        value={edu.universityName}
                        onChange={(e) => handleEditEducation({ ...edu, universityName: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        value={edu.degree}
                        onChange={(e) => handleEditEducation({ ...edu, degree: e.target.value })}
                      />
                    </>
                  ) : (
                    <>
                      <Typography variant="body1" fontWeight="bold">{edu.universityName}</Typography>
                      <Typography variant="body2">{edu.degree}</Typography>
                    </>
                  )
                }
                secondary={
                  editId === edu.id ? (
                    <TextField
                      fullWidth
                      value={edu.duration}
                      onChange={(e) => handleEditEducation({ ...edu, duration: e.target.value })}
                    />
                  ) : (
                    <Typography variant="body2">{edu.duration}</Typography>
                  )
                }
              />
              {isEditMode && (
                <Box>
                  {editId === edu.id ? (
                    <IconButton onClick={() => handleSave(edu)}>
                      <FaEdit />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => setEditId(edu.id)}>
                      <FaEdit />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDeleteEducation(edu.id)}>
                    <FaTrash />
                  </IconButton>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>

      {/* Add Education Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add New Education</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="University Name"
            value={newEducation.universityName}
            onChange={(e) => setNewEducation({ ...newEducation, universityName: e.target.value })}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            fullWidth
            label="Degree"
            value={newEducation.degree}
            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            fullWidth
            label="From Date"
            type="date"
            value={newEducation.fromDate}
            onChange={(e) => setNewEducation({ ...newEducation, fromDate: e.target.value })}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            fullWidth
            label="To Date"
            type="date"
            value={newEducation.toDate}
            onChange={(e) => setNewEducation({ ...newEducation, toDate: e.target.value })}
            sx={{ marginBottom: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSaveNewEducation} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

// Skills Section Component
const SkillsSection = ({ skills, isEditMode, handleAddSkill, handleDeleteSkill }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    if (newSkill.trim()) {
      handleAddSkill(newSkill);
      setNewSkill('');
    }
  };

  return (
    <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', marginBottom: '20px' }}>
      <CardHeader
        title={<Typography variant="h6" fontWeight="bold" color="text.primary">Skills</Typography>}
        sx={{ padding: '16px' }}
      />
      <CardContent sx={{ padding: '16px' }}>
        {isEditMode ? (
          <Box sx={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <TextField
              fullWidth
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              variant="outlined"
              placeholder="Add new skill"
            />
            <Button onClick={handleAdd} variant="contained" color="primary">
              Add
            </Button>
          </Box>
        ) : null}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill.skillName}
              onDelete={isEditMode ? () => handleDeleteSkill(skill.id) : null}
              sx={{ borderRadius: '4px' }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Profile Component
export default function Profile() {
  const router = useRouter(); // Move useRouter to the top level
  const { id: userId } = router.query; // Extract userId from the URL

  const [isEditMode, setIsEditMode] = useState(false);
    

  const [profile, setProfile] = useState({
    id: 1,
    name: 'John Doe',
    userName: 'johndoe123',
    email: 'john.doe@example.com',
    designation: 'Backend Developer',
    bio: 'Software Engineer',
    profileImageUrl: 'https://example.com/profile/john.jpg',
    location: 'New York, USA',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    createdAt: '2025-03-01T12:53:43.000+00:00',
    updatedAt: '2025-03-01T12:53:43.000+00:00',
  });
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return; // Return early if userId is not available

        const user = await getUserById(userId);
        setProfile(user);

        const userExperiences = await getExperiencesByUser(userId);
        setExperiences(userExperiences);

        const userEducations = await getEducationsByUser(userId);
        setEducations(userEducations);

        const userSkills = await getSkillsByUser(userId);
        setSkills(userSkills);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]); // Add userId as a dependency

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const handleInputChange = (field, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser(profile);
      toggleEditMode();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddExperience = async (newExperience) => {
    try {
      const createdExperience = await createExperience({ ...newExperience, user: { id: profile.id } });
      setExperiences([...experiences, createdExperience]);
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  const handleEditExperience = async (exp) => {
    try {
      const updatedExperience = await updateExperience(exp);
      setExperiences(experiences.map((e) => (e.id === updatedExperience.id ? updatedExperience : e)));
    } catch (error) {
      console.error('Error updating experience:', error);
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await deleteExperience(id);
      setExperiences(experiences.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const handleAddEducation = async (newEducation) => {
    try {
      const createdEducation = await createEducation({ ...newEducation, user: { id: profile.id } });
      setEducations([...educations, createdEducation]);
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  const handleEditEducation = async (edu) => {
    try {
      const updatedEducation = await updateEducation(edu);
      setEducations(educations.map((e) => (e.id === updatedEducation.id ? updatedEducation : e)));
    } catch (error) {
      console.error('Error updating education:', error);
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      await deleteEducation(id);
      setEducations(educations.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const handleAddSkill = async (skillName) => {
    try {
      const createdSkill = await createSkill({ skillName, user: { id: profile.id } });
      setSkills([...skills, createdSkill]);
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      setSkills(skills.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#fafafa' }}>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User profile page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ProfileHeader
        profile={profile}
        isEditMode={isEditMode}
        toggleEditMode={toggleEditMode}
        handleInputChange={handleInputChange}
        handleSave={handleSaveProfile}
      />
      <ExperienceSection
        experiences={experiences}
        isEditMode={isEditMode}
        handleAddExperience={handleAddExperience}
        handleEditExperience={handleEditExperience}
        handleDeleteExperience={handleDeleteExperience}
      />
      <EducationSection
        educations={educations}
        isEditMode={isEditMode}
        handleAddEducation={handleAddEducation}
        handleEditEducation={handleEditEducation}
        handleDeleteEducation={handleDeleteEducation}
      />
      <SkillsSection
        skills={skills}
        isEditMode={isEditMode}
        handleAddSkill={handleAddSkill}
        handleDeleteSkill={handleDeleteSkill}
      />
    </div>
  );
}