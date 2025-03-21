import axios from 'axios';

const API_BASE_URL = 'http://localhost:8060';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// User APIs
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/create`, userData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/email/${email}`, getAuthHeader());
    return response.data;
  } catch (error) {
    if (error.response && error.response.status !== 200) {
      console.log('Get user by email response:', error);
      return null;
    }
    console.error('Error fetching user by email:', error);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/update`, userData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Experience APIs
export const createExperience = async (experienceData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/experience/create`, experienceData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating experience:', error);
    throw error;
  }
};

export const updateExperience = async (experienceData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/experience/update`, experienceData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

export const deleteExperience = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/experience/delete/${id}`, getAuthHeader());
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};

export const getExperiencesByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/experience/user/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching experiences:', error);
    throw error;
  }
};

// Education APIs
export const createEducation = async (educationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/education/create`, educationData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating education:', error);
    throw error;
  }
};

export const updateEducation = async (educationData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/education/update`, educationData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating education:', error);
    throw error;
  }
};

export const deleteEducation = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/education/delete/${id}`, getAuthHeader());
  } catch (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
};

export const getEducationsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/education/user/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching educations:', error);
    throw error;
  }
};

// Skill APIs
export const createSkill = async (skillData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/skill/create`, skillData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating skill:', error);
    throw error;
  }
};

export const updateSkill = async (skillData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/skill/update`, skillData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};

export const deleteSkill = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/skill/delete/${id}`, getAuthHeader());
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

export const getSkillsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/skill/user/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

// Team APIs
export const getTeamsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/team-user/user/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching teams by user ID:', error);
    throw error;
  }
};

export const getTeamById = async (teamId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/team/${teamId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching team by ID:', error);
    throw error;
  }
};

export const getTeamUsersByTeamId = async (teamId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/team-user/team/${teamId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching team users by team ID:', error);
    throw error;
  }
};

export const getTechStacksByTeamId = async (teamId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/techstack/team/${teamId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching tech stacks by team ID:', error);
    throw error;
  }
};

// Team User APIs
export const createTeamUser = async (teamUserData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/team-user/create`, teamUserData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating team user:', error);
    throw error;
  }
};

export const getTeamUserByUserIdAndTeamId = async (teamId, userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/team-user/team/${teamId}/user/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // No entry found
    }
    console.error('Error fetching team user:', error);
    throw error;
  }
};

export const updateTeam = async (teamData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/team/update`, teamData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};

// Tech Stack APIs
export const createTechStack = async (techStackData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/techstack/create`, techStackData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating tech stack:', error);
    throw error;
  }
};

export const updateTechStack = async (techStackData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/techstack/update`, techStackData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error updating tech stack:', error);
    throw error;
  }
};

export const deleteTechStack = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/techstack/delete/${id}`, getAuthHeader());
  } catch (error) {
    console.error('Error deleting tech stack:', error);
    throw error;
  }
};

// Request APIs
export const getRequestsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/team-user/request/${userId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

export const acceptRequest = async (requestId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/team-user/accept/${requestId}`,
      {},
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error accepting request:', error);
    throw error;
  }
};

export const rejectRequest = async (requestId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/team-user/reject/${requestId}`,
      {},
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting request:', error);
    throw error;
  }
};

// Post APIs
export const createPost = async (postData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/post/create`,
      postData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/post/all`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createLike = async (postId, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/like/create`,
      { postId: postId, userId: userId },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const deleteLike = async (likeId) => {
  try {
    await axios.delete(`${API_BASE_URL}/like/delete/${likeId}`, getAuthHeader());
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const getLikesByPostId = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/like/post/${postId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching likes:', error);
    throw error;
  }
};

// Comment APIs
export const createComment = async (postId, userId, content, parentCommentId = null) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/comment/create`,
      { postId, user: { id: userId }, parentCommentId, content },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    await axios.delete(`${API_BASE_URL}/comment/delete/${commentId}`, getAuthHeader());
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const updateComment = async (commentData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/comment/update`,
      commentData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comment/post/${postId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Chat APIs
export const getAllChats = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/chats`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

export const getMessagesByChatId = async (chatId) => {
  try {
    const response = await axios.get(`http://localhost:8080/messages/${chatId}/messages`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(`http://localhost:8080/messages`, message, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};