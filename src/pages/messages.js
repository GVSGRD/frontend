import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, TextField, IconButton, Badge, InputAdornment, useMediaQuery, Fade } from '@mui/material';
import { FaSearch, FaEllipsisV, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getAllChats, getMessagesByChatId, sendMessage as sendMessageApi } from '../utils/api'; // Import APIs

export default function Messages() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch chats from the backend
  useEffect(() => {
    setLoading(true);
    setError(null);

    getAllChats()
      .then((data) => {
        setChats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching chats:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Fetch messages for the selected chat
  useEffect(() => {
    if (selectedChat) {
      setLoading(true);
      setError(null);

      getMessagesByChatId(selectedChat.id)
        .then((data) => {
          setMessages(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
          setError(error.message);
          setLoading(false);
        });
    }
  }, [selectedChat]);

  // WebSocket connection for real-time messaging
  useEffect(() => {
    const socket = new SockJS('http://localhost:9094/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('WebSocket connected');
      setStompClient(client);

      client.subscribe('/topic/messages', (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    };

    client.onStompError = (frame) => {
      console.error('WebSocket error:', frame.headers.message);
    };

    client.activate();

    return () => {
      if (client) {
        client.deactivate();
        console.log('WebSocket disconnected');
      }
    };
  }, []);

  // Send a message
  const sendMessage = (content) => {
    if (stompClient && selectedChat) {
      const message = {
        chatRoomId: selectedChat.id,
        senderId: 1, // Replace with the logged-in user's ID
        content: content,
        timestamp: new Date().toISOString(),
      };

      // Send message via WebSocket
      stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(message),
      });

      // Optionally, send message via REST API for persistence
      sendMessageApi(message)
        .then((savedMessage) => {
          console.log('Message saved:', savedMessage);
        })
        .catch((error) => {
          console.error('Error saving message:', error);
        });
    } else {
      console.error('WebSocket connection not established or no chat selected');
    }
  };

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
            {loading ? (
              <Typography>Loading chats...</Typography>
            ) : error ? (
              <Typography color="error">Error: {error}</Typography>
            ) : (
              chats.map((chat) => (
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
              ))
            )}
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
            {loading ? (
              <Typography>Loading messages...</Typography>
            ) : error ? (
              <Typography color="error">Error: {error}</Typography>
            ) : (
              messages.map((msg) => (
                <Box key={msg.id} sx={{ display: 'flex', flexDirection: msg.senderId === 1 ? 'row-reverse' : 'row', marginBottom: '16px' }}>
                  <Avatar src={msg.senderId === 1 ? '/avatar.jpg' : '/avatar1.jpg'} alt={msg.senderId === 1 ? 'You' : msg.senderName} />
                  <Box sx={{ marginLeft: msg.senderId === 1 ? '0' : '8px', marginRight: msg.senderId === 1 ? '8px' : '0', maxWidth: '60%', backgroundColor: msg.senderId === 1 ? '#d9fdd3' : '#fff', padding: '8px 12px', borderRadius: '8px' }}>
                    <Typography variant="body1">{msg.content}</Typography>
                    <Typography variant="body2" sx={{ textAlign: 'right' }}>{new Date(msg.timestamp).toLocaleTimeString()}</Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
          <Box sx={{ padding: '16px', borderTop: '1px solid #e9ecef' }}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  sendMessage(e.target.value.trim());
                  e.target.value = '';
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={(e) => {
                      const input = e.target.closest('.MuiTextField-root').querySelector('input');
                      if (input.value.trim()) {
                        sendMessage(input.value.trim());
                        input.value = '';
                      }
                    }}>
                      <FaPaperPlane style={{ color: '#4dabf7' }} />
                    </IconButton>
                  </InputAdornment>
                ),
                style: { borderRadius: '24px', backgroundColor: '#f0f2f5' },
              }}
            />
          </Box>
        </Box>
      </Fade>
    </div>
  );
}