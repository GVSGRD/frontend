import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, Button, TextField, InputAdornment,
  Modal, Box, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { FaHeart, FaComment, FaShare, FaUserPlus, FaSearch, FaTrash, FaPlus, FaEdit, FaPaperPlane } from 'react-icons/fa';
import {
  getAllPosts, createLike, deleteLike, getLikesByPostId, createComment, deleteComment, getCommentsByPostId,
  createPost, getTeamsByUserId, getTeamUserByUserIdAndTeamId, createTeamUser, updateComment, getUserById
} from '../utils/api';

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teams, setTeams] = useState([]);
  const [teamUserStatus, setTeamUserStatus] = useState({});
  const [deleteCommentId, setDeleteCommentId] = useState(null); // For delete confirmation
  const [editComment, setEditComment] = useState(null); // For editing comments
  const [users, setUsers] = useState({}); // Store user details

  // Fetch current user ID from localStorage on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setCurrentUserId(parseInt(userId, 10)); // Convert to number if necessary
    }
  }, []);

  // Fetch posts, teams, and teamUser status when currentUserId is available
  useEffect(() => {
    const fetchPostsAndTeams = async () => {
      try {
        const postsData = await getAllPosts();
        setPosts(postsData);

        // Fetch teamUser status for each post
        const statusMap = {};
        for (const post of postsData) {
          const teamUser = await getTeamUserByUserIdAndTeamId(post.team.id, currentUserId);
          statusMap[post.team.id] = teamUser ? teamUser.status : null; // Use teamId as the key
        }
        setTeamUserStatus(statusMap);

        // Fetch likes and comments for each post
        postsData.forEach(async (post) => {
          const likesData = await getLikesByPostId(post.id);
          setLikeCounts(prev => ({ ...prev, [post.id]: likesData.length }));
          if (likesData.some(like => like.userId === currentUserId)) {
            setLikedPosts(prev => new Set(prev.add(post.id)));
          }
          const commentsData = await getCommentsByPostId(post.id);
          setComments(prev => ({ ...prev, [post.id]: commentsData }));
          setCommentCounts(prev => ({ ...prev, [post.id]: commentsData.length }));

          // Fetch user details for each comment
          const userDetails = {};
          for (const comment of commentsData) {
            if (!users[comment.user.id]) {
              const user = await getUserById(comment.user.id);
              userDetails[comment.user.id] = user;
            }
          }
          setUsers(prev => ({ ...prev, ...userDetails }));
        });

        // Fetch teams for the current user
        const teamsData = await getTeamsByUserId(currentUserId);
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching posts, teams, or teamUser status:', error);
      }
    };

    if (currentUserId !== null) {
      fetchPostsAndTeams();
    }
  }, [currentUserId]);

  const handleLike = async (postId) => {
    if (currentUserId === null) {
      console.error('User not logged in');
      return;
    }

    try {
      if (likedPosts.has(postId)) {
        const likeId = await getLikesByPostId(postId).then(likes => likes.find(like => like.userId === currentUserId)?.id);
        if (likeId) {
          await deleteLike(likeId);
          setLikedPosts(prev => {
            const newLikedPosts = new Set(prev);
            newLikedPosts.delete(postId);
            return newLikedPosts;
          });
          setLikeCounts(prev => ({ ...prev, [postId]: prev[postId] - 1 }));
        }
      } else {
        await createLike(postId, currentUserId);
        setLikedPosts(prev => new Set(prev.add(postId)));
        setLikeCounts(prev => ({ ...prev, [postId]: prev[postId] + 1 }));
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleComment = async (postId, content) => {
    if (currentUserId === null) {
      console.error('User not logged in');
      return;
    }

    if (!content.trim()) return;
    try {
      const newComment = await createComment(postId, currentUserId, content);
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment], // Use postId instead of post.id
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      setCommentCounts(prev => ({ ...prev, [postId]: prev[postId] + 1 }));

      // Fetch user details for the new comment
      if (!users[newComment.user.id]) {
        const user = await getUserById(newComment.user.id);
        setUsers(prev => ({ ...prev, [user.id]: user }));
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].filter(comment => comment.id !== commentId),
      }));
      setCommentCounts(prev => ({ ...prev, [postId]: prev[postId] - 1 }));
      setDeleteCommentId(null); // Close the confirmation dialog
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditComment = async (postId, commentId, content) => {
    try {
      const existingComment = comments[postId].find(comment => comment.id === commentId);
  
      const commentData = {
        id: commentId,
        postId: postId,
        user: {
          id: currentUserId,
        },
        parentCommentId: existingComment.parentCommentId || null,
        content: content,
        createdAt: existingComment.createdAt || null,
        updatedAt: new Date().toISOString(),
      };
  
      // Call the updateComment API
      const updatedComment = await updateComment(commentData);
  
      // Update the comments state with the updated comment
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].map(comment =>
          comment.id === commentId ? updatedComment : comment
        ),
      }));
  
      // Close the edit dialog
      setEditComment(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleUserClick = (userId) => {
    router.push(`/profile/${userId}`);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      alert('Post content cannot be empty');
      return;
    }

    try {
      const newPost = await createPost({
        user: { id: currentUserId },
        team: { id: selectedTeamId },
        content: postContent,
        mediaUrl: mediaUrl,
      });

      // Add the new post to the posts list
      setPosts(prev => [newPost, ...prev]);
      setIsCreatePostModalOpen(false);
      setPostContent('');
      setMediaUrl('');
      setSelectedTeamId('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleJoinTeam = async (teamId) => {
    if (currentUserId === null) {
      console.error('User not logged in');
      return;
    }

    try {
      const teamUserData = {
        team: { id: teamId },
        user: { id: currentUserId },
        joinDate: new Date().toISOString(),
        status: 'PENDING',
        lastActivity: null,
      };

      await createTeamUser(teamUserData);

      // Update the teamUser status for the post
      setTeamUserStatus(prev => ({ ...prev, [teamId]: 'PENDING' }));
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

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
                <FaSearch style={{ color: '#6c757d' }} />
              </InputAdornment>
            ),
            style: { borderRadius: '24px', backgroundColor: '#fff' },
          }}
        />
      </div>

      {/* Create Post Button */}
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '24px' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus />}
          onClick={() => setIsCreatePostModalOpen(true)}
        >
          Create Post
        </Button>
      </div>

      {/* Create Post Modal */}
      <Modal open={isCreatePostModalOpen} onClose={() => setIsCreatePostModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
        }}>
          <Typography variant="h6" gutterBottom>
            Create a New Post
          </Typography>
          <TextField
            fullWidth
            placeholder="Post Content"
            variant="outlined"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            multiline
            rows={4}
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            fullWidth
            placeholder="Media URL (optional)"
            variant="outlined"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <FormControl fullWidth sx={{ marginBottom: '16px' }}>
            <InputLabel>Select Team</InputLabel>
            <Select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              label="Select Team"
            >
              {teams.map((team) => (
                <MenuItem key={team.team.id} value={team.team.id}>
                  {team.team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreatePost}
          >
            Post
          </Button>
        </Box>
      </Modal>

      {/* News Feed Posts */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {posts.map((post) => (
          <Card key={post.id} style={{ marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
            <CardHeader
              avatar={
                <Avatar src={post.user.avatar} alt="User Avatar" sx={{ width: 48, height: 48 }} onClick={() => handleUserClick(post.user.id)} />
              }
              title={
                <Typography variant="h6" fontWeight="bold" color="text.primary" onClick={() => handleUserClick(post.user.id)}>
                  {post.user.name}
                </Typography>
              }
              subheader={
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => router.push(`/team/${post.team.id}`)}
                  sx={{ textTransform: 'none', padding: 0 }}
                >
                  {post.team.name}
                </Button>
              }
              sx={{ padding: '16px' }}
            />
            <CardContent sx={{ padding: '16px' }}>
              <Typography variant="body1" color="text.primary" paragraph>
                {post.content}
              </Typography>
              {post.mediaUrl && (
                <div style={{ marginTop: '16px' }}>
                  <Image
                    src={post.mediaUrl}
                    alt="Post Media"
                    width={600}
                    height={400}
                    style={{ borderRadius: '8px', width: '100%', height: 'auto' }}
                  />
                </div>
              )}
            </CardContent>

            <CardActions style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <IconButton aria-label="like" sx={{ color: likedPosts.has(post.id) ? 'red' : 'text.secondary' }} onClick={() => handleLike(post.id)}>
                  <FaHeart />
                  <Typography variant="body2" color="text.secondary" sx={{ marginLeft: '8px' }}>
                    {likeCounts[post.id] || 0}
                  </Typography>
                </IconButton>
                <IconButton aria-label="comment" sx={{ color: 'text.secondary' }}>
                  <FaComment />
                  <Typography variant="body2" color="text.secondary" sx={{ marginLeft: '8px' }}>
                    {commentCounts[post.id] || 0}
                  </Typography>
                </IconButton>
                <IconButton aria-label="share" sx={{ color: 'text.secondary' }}>
                  <FaShare />
                </IconButton>
              </div>
              {teamUserStatus[post.team.id] === 'PENDING' ? (
                <Button variant="outlined" color="secondary" disabled>
                  Requested
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FaUserPlus />}
                  onClick={() => handleJoinTeam(post.team.id)}
                  sx={{ borderRadius: '20px', textTransform: 'none' }}
                >
                  Join
                </Button>
              )}
            </CardActions>

            {/* Comments Section */}
            <div style={{ padding: '16px', borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="body2" fontWeight="bold" color="text.primary" gutterBottom>
                Comments
              </Typography>
              {comments[post.id]?.map((comment) => (
                <div key={comment.id} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Avatar src={users[comment.user.id]?.profileImageUrl} alt="User Avatar" sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2" color="text.primary">
                      <strong>{users[comment.user.id]?.name}:</strong> {comment.content}
                    </Typography>
                    {comment.user.id === currentUserId && (
                      <>
                        <IconButton size="small" onClick={() => setEditComment(comment)}>
                          <FaEdit />
                        </IconButton>
                        <IconButton size="small" onClick={() => setDeleteCommentId({ postId: post.id, commentId: comment.id })}>
                          <FaTrash />
                        </IconButton>
                      </>
                    )}
                  </div>
                  {comment.replies?.map((reply) => (
                    <div key={reply.id} style={{ marginLeft: '32px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar src={users[reply.user.id]?.profileImageUrl} alt="User Avatar" sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2" color="text.primary">
                          <strong>{users[reply.user.id]?.name}:</strong> {reply.content}
                        </Typography>
                        {reply.user.id === currentUserId && (
                          <>
                            <IconButton size="small" onClick={() => setEditComment(reply)}>
                              <FaEdit />
                            </IconButton>
                            <IconButton size="small" onClick={() => setDeleteCommentId({ postId: post.id, commentId: reply.id })}>
                              <FaTrash />
                            </IconButton>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  placeholder="Add a comment..."
                  variant="outlined"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleComment(post.id, commentInputs[post.id]);
                    }
                  }}
                  sx={{ marginTop: '16px' }}
                />
                <IconButton
                  color="primary"
                  onClick={() => handleComment(post.id, commentInputs[post.id])}
                >
                  <FaPaperPlane />
                </IconButton>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteCommentId !== null}
        onClose={() => setDeleteCommentId(null)}
      >
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCommentId(null)}>Cancel</Button>
          <Button
            onClick={() => {
              handleDeleteComment(deleteCommentId.postId, deleteCommentId.commentId);
              setDeleteCommentId(null);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Comment Dialog */}
      <Dialog
        open={editComment !== null}
        onClose={() => setEditComment(null)}
      >
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            value={editComment?.content || ''}
            onChange={(e) =>
              setEditComment((prev) => ({ ...prev, content: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditComment(null)}>Cancel</Button>
          <Button
            onClick={() => {
              handleEditComment(editComment.postId, editComment.id, editComment.content);
              setEditComment(null);
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}