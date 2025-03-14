import Head from 'next/head';
import { useState } from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, TextField, IconButton, Badge, InputAdornment, useMediaQuery, Fade } from '@mui/material';
import { FaSearch, FaEllipsisV, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

export default function Messages() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedChat, setSelectedChat] = useState(null);

  const chats = [
    { id: 1, name: 'Tech Innovators', type: 'group', lastMessage: 'Let’s discuss the new project updates.', timestamp: '10:15 AM', unreadCount: 2, avatar: '/group1.jpg', online: false },
    { id: 2, name: 'John Doe', type: 'individual', lastMessage: 'Hey, how are you?', timestamp: 'Yesterday', unreadCount: 0, avatar: '/avatar1.jpg', online: true },
  ];

  const activeChat = selectedChat ? {
    id: selectedChat.id,
    name: selectedChat.name,
    type: selectedChat.type,
    messages: [
      { id: 1, sender: 'John Doe', message: 'Hi everyone!', timestamp: '10:00 AM' },
      { id: 2, sender: 'Jane Smith', message: 'Hello!', timestamp: '10:05 AM' },
      { id: 3, sender: 'You', message: 'Let’s discuss the new project updates.', timestamp: '10:15 AM' },
    ]
  } : null;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#fafafa' }}>
      <Head>
        <title>Messages</title>
        <meta name="description" content="Chat and group messages" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!selectedChat || !isMobile ? (
        <Box sx={{ width: isMobile ? '100%' : '30%', borderRight: isMobile ? 'none' : '1px solid #e9ecef', backgroundColor: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #e9ecef' }}>
            <Typography variant="h6" fontWeight="bold">Chats</Typography>
            <IconButton><FaEllipsisV /></IconButton>
          </Box>
          <Box sx={{ padding: '16px' }}>
            <TextField
              fullWidth
              placeholder="Search chats..."
              variant="outlined"
              InputProps={{ startAdornment: (<InputAdornment position="start"><FaSearch style={{ color: '#6c757d' }} /></InputAdornment>), style: { borderRadius: '24px', backgroundColor: '#f0f2f5' } }}
            />
          </Box>
          <List>
            {chats.map((chat) => (
              <ListItem key={chat.id} onClick={() => setSelectedChat(chat)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <ListItemAvatar>
                  <Badge
                    color="success"
                    variant="dot"
                    overlap="circular"
                    invisible={!chat.online}
                  >
                    <Avatar src={chat.avatar} alt={chat.name} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText 
                  primary={<Typography fontWeight="bold">{chat.name}</Typography>} 
                  secondary={chat.lastMessage} 
                />
                {chat.unreadCount > 0 && (
                  <Badge badgeContent={chat.unreadCount} color="primary" />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      ) : null}

      <Fade in={!!selectedChat} timeout={300}>
        <Box sx={{ flex: 1, display: selectedChat || !isMobile ? 'flex' : 'none', flexDirection: 'column', backgroundColor: '#fff' }}>
          {selectedChat && (
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid #e9ecef' }}>
              {isMobile && <IconButton onClick={() => setSelectedChat(null)}><FaArrowLeft /></IconButton>}
              <Badge color="success" variant="dot" overlap="circular" invisible={!selectedChat.online}>
                <Avatar src={selectedChat.avatar} alt={selectedChat.name} sx={{ width: 48, height: 48 }} />
              </Badge>
              <Box sx={{ marginLeft: '16px' }}>
                <Typography variant="h6" fontWeight="bold">{selectedChat.name}</Typography>
                <Typography variant="body2" color="text.secondary">{selectedChat.type === 'group' ? 'Group · 10 members' : selectedChat.online ? 'Online' : 'Offline'}</Typography>
              </Box>
            </Box>
          )}
          <Box sx={{ flex: 1, padding: '16px', overflowY: 'auto', backgroundColor: '#f0f2f5' }}>
            {activeChat ? activeChat.messages.map((msg) => (
              <Box key={msg.id} sx={{ display: 'flex', flexDirection: msg.sender === 'You' ? 'row-reverse' : 'row', marginBottom: '16px' }}>
                <Avatar src={msg.sender === 'You' ? '/avatar.jpg' : '/avatar1.jpg'} alt={msg.sender} />
                <Box sx={{ marginLeft: msg.sender === 'You' ? '0' : '8px', marginRight: msg.sender === 'You' ? '8px' : '0', maxWidth: '60%', backgroundColor: msg.sender === 'You' ? '#d9fdd3' : '#fff', padding: '8px 12px', borderRadius: '8px' }}>
                  <Typography variant="body1">{msg.message}</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'right' }}>{msg.timestamp}</Typography>
                </Box>
              </Box>
            )) : <Typography sx={{ textAlign: 'center', marginTop: '20%' }}>Select a chat to start messaging</Typography>}
          </Box>
          <Box sx={{ padding: '16px', borderTop: '1px solid #e9ecef' }}>
            <TextField fullWidth placeholder="Type a message..." variant="outlined" InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton><FaPaperPlane style={{ color: '#4dabf7' }} /></IconButton></InputAdornment>), style: { borderRadius: '24px', backgroundColor: '#f0f2f5' } }} />
          </Box>
        </Box>
      </Fade>
    </div>
  );
}
