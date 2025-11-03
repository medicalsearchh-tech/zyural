import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messageApi, userApi } from '../../../core/utils/api';
import './message.css';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
  attachments?: string[];
  sender: User;
}

interface Conversation {
  id: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadCount: number;
  otherParticipant: User;
  messages: Message[];
}

const MessageDetailPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConversationList, setShowConversationList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await userApi.getProfile();
        if (response.success) {
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const convResponse = await messageApi.getConversations({ limit: 50 });
        if (convResponse.success) {
          setConversations(convResponse.data.conversations);
          
          if (conversationId) {
            const foundConv = convResponse.data.conversations.find(
              (conv: Conversation) => conv.id === conversationId
            );
            if (foundConv) {
              setCurrentConversation(foundConv);
              await fetchMessages(foundConv.id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [conversationId]);

  const fetchMessages = async (convId: string) => {
    try {
      const response = await messageApi.getMessages(convId, { limit: 100 });
      if (response.success) {
        setMessages(response.data.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentConversation) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      content: newMessage,
      senderId: currentUser!.id,
      createdAt: new Date().toISOString(),
      isRead: false,
      sender: currentUser!,
      attachments: []
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    scrollToBottom();

    try {
      const response = await messageApi.sendMessage(currentConversation.id, { 
        content: newMessage 
      });
      
      if (response.success) {
        setMessages(prev => 
          prev.map(msg => msg.id === tempId ? response.data : msg)
        );
        
        const convResponse = await messageApi.getConversations({ limit: 50 });
        if (convResponse.success) {
          setConversations(convResponse.data.conversations);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const filteredConversations = conversations.filter(conv => {
    const name = `${conv.otherParticipant.firstName} ${conv.otherParticipant.lastName}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <>
      <div className="messages-app">
        {/* Sidebar */}
        <div className={`message-sidebar ${!showConversationList ? 'hidden' : ''}`}>
          <div className="message-sidebar-header">
            <h4>Messages</h4>
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="conversations-list">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${
                  currentConversation?.id === conv.id ? 'active' : ''
                }`}
                onClick={() => {
                  setCurrentConversation(conv);
                  fetchMessages(conv.id);
                  setShowConversationList(false);
                  navigate(`/messages/${conv.id}`);
                }}
              >
                <div className="d-flex align-items-center">
                  <div className="position-relative">
                    <img
                      src={conv.otherParticipant?.avatar || 'assets/img/user/user-placeholder.jpg'}
                      alt="User"
                      className="conv-avatar"
                    />
                    {conv.otherParticipant?.isOnline && (
                      <span className="online-indicator"></span>
                    )}
                  </div>
                  
                  <div className="conv-info">
                    <div className="conv-name">
                      {conv.otherParticipant.firstName} {conv.otherParticipant.lastName}
                    </div>
                    <div className="conv-preview">
                      {conv.lastMessagePreview}
                    </div>
                  </div>
                  
                  <div className="conv-meta">
                    <div className="conv-time">{formatTime(conv.lastMessageAt)}</div>
                    {conv.unreadCount > 0 && (
                      <span className="unread-badge">{conv.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {currentConversation ? (
            <>
              {/* Header */}
              <div className="chat-header">
                <div className="chat-header-left">
                  <button 
                    className="back-btn"
                    onClick={() => setShowConversationList(true)}
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  
                  <div className="position-relative">
                    <img
                      src={currentConversation.otherParticipant.avatar || 'assets/img/user/user-placeholder.jpg'}
                      alt="User"
                      className="chat-avatar"
                    />
                    {currentConversation.otherParticipant.isOnline && (
                      <span className="online-indicator"></span>
                    )}
                  </div>
                  
                  <div className="chat-user-info">
                    <h5>
                      {currentConversation.otherParticipant.firstName}{' '}
                      {currentConversation.otherParticipant.lastName}
                    </h5>
                    <div className="chat-user-status">
                      {currentConversation.otherParticipant.isOnline 
                        ? 'Online' 
                        : `Last seen ${formatTime(currentConversation.otherParticipant.lastSeen || '')}`
                      }
                    </div>
                  </div>
                </div>
                
                <div className="chat-actions">
                  <button><i className="fas fa-search"></i></button>
                  <button><i className="fas fa-ellipsis-v"></i></button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {Object.entries(messageGroups).map(([date, dateMessages]) => (
                  <div key={date}>
                    <div className="date-separator">
                      <span className="date-badge">{formatDate(date)}</span>
                    </div>
                    
                    {dateMessages.map((message) => {
                      const isSent = message.senderId === currentUser?.id;
                      
                      return (
                        <div
                          key={message.id}
                          className={`message-row ${isSent ? 'sent' : 'received'}`}
                        >
                          <div className="message-bubble">
                            <p>{message.content}</p>
                            <div className="message-meta">
                              <span>{formatTime(message.createdAt)}</span>
                              {isSent && (
                                <span className="read-status">
                                  <i className={`fas ${
                                    message.isRead ? 'fa-check-double' : 'fa-check'
                                  }`} />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="input-area">
                <div className="input-wrapper">
                  <div className="input-actions">
                    <button onClick={() => fileInputRef.current?.click()}>
                      <i className="fas fa-paperclip"></i>
                    </button>
                    <button>
                      <i className="fas fa-smile"></i>
                    </button>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    multiple
                  />
                  
                  <input
                    type="text"
                    className="message-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  
                  <button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <i className="fas fa-comments"></i>
              <h4>Select a conversation</h4>
              <p>Choose from your existing conversations or start a new one</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageDetailPage;