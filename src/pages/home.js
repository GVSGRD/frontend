import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, Button, TextField, InputAdornment } from '@mui/material';
import { FaHeart, FaComment, FaShare, FaUserPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { getAllPosts, createLike, deleteLike, getLikesByPostId, createComment, deleteComment, getCommentsByPostId } from '../utils/api';

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getAllPosts();
        setPosts(postsData);
        postsData.forEach(async (post) => {
          const likesData = await getLikesByPostId(post.id);
          if (likesData.some(like => like.userId === currentUserId)) {
            setLikedPosts(prev => new Set(prev.add(post.id)));
          }
          const commentsData = await getCommentsByPostId(post.id);
          setComments(prev => ({ ...prev, [post.id]: commentsData }));
        });
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const currentUserId = 1; // Replace with actual current user ID

  const handleLike = async (postId) => {
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
        }
      } else {
        await createLike(postId, currentUserId);
        setLikedPosts(prev => new Set(prev.add(postId)));
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleComment = async (postId, content) => {
    if (!content.trim()) return;
    try {
      const newComment = await createComment(postId, currentUserId, content);
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
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
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleUserClick = (userId) => {
    router.push(`/profile/${userId}`);
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
              {/* Use static image from public folder */}
              <div style={{ marginTop: '16px' }}>
                <Image
                  src="/img1.jpg" // Path to the static image in the public folder
                  alt="Post Media"
                  width={600}
                  height={400}
                  style={{ borderRadius: '8px', width: '100%', height: 'auto' }}
                />
              </div>
            </CardContent>

            <CardActions style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <IconButton aria-label="like" sx={{ color: likedPosts.has(post.id) ? 'red' : 'text.secondary' }} onClick={() => handleLike(post.id)}>
                  <FaHeart />
                  <Typography variant="body2" color="text.secondary" sx={{ marginLeft: '8px' }}>
                    {post.likeCount}
                  </Typography>
                </IconButton>
                <IconButton aria-label="comment" sx={{ color: 'text.secondary' }}>
                  <FaComment />
                  <Typography variant="body2" color="text.secondary" sx={{ marginLeft: '8px' }}>
                    {post.commentsCount}
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

            {/* Comments Section */}
            <div style={{ padding: '16px', borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="body2" fontWeight="bold" color="text.primary" gutterBottom>
                Comments
              </Typography>
              {comments[post.id]?.map((comment) => (
                <div key={comment.id} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Avatar src={comment.user.profileImageUrl} alt="User Avatar" sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2" color="text.primary">
                      <strong>{comment.user.name}:</strong> {comment.content}
                    </Typography>
                    {comment.user.id === currentUserId && (
                      <IconButton size="small" onClick={() => handleDeleteComment(post.id, comment.id)}>
                        <FaTrash />
                      </IconButton>
                    )}
                  </div>
                  {comment.replies?.map((reply) => (
                    <div key={reply.id} style={{ marginLeft: '32px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar src={reply.user.profileImageUrl} alt="User Avatar" sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2" color="text.primary">
                          <strong>{reply.user.name}:</strong> {reply.content}
                        </Typography>
                        {reply.user.id === currentUserId && (
                          <IconButton size="small" onClick={() => handleDeleteComment(post.id, reply.id)}>
                            <FaTrash />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}