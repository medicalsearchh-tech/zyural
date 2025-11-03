import { useState, useEffect, useRef } from 'react'
import AdminSidebar from '../common/adminSidebar'
import ProfileCard from '../common/profileCard'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import { Link } from 'react-router-dom'
import { userApi, adminApi, messageApi } from '../../../core/utils/api'

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
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

const AdminMessage = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [initialMessage, setInitialMessage] = useState('');
  const [, setLoadingUsers] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Fetch current user
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

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await messageApi.getConversations({ limit: 50 });
      if (response.success) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch users for new conversation
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await adminApi.getUsersForMessage({ 
        limit: 100,
        excludeCurrent: true 
      });
      if (response.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      const response = await messageApi.getMessages(conversationId, { limit: 100 });
      if (response.success) {
        setMessages(response.data.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Select conversation
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await messageApi.sendMessage(selectedConversation.id, { content: newMessage });
      if (response.success) {
        setMessages(prev => [...prev, response.data]);  // Changed from response.data.messages
        setNewMessage('');
        scrollToBottom();
        
        // Update conversation list
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Start new conversation
  const handleStartNewConversation = async () => {
    if (!selectedUser || !initialMessage.trim()) return;

    try {
      const response = await messageApi.startConversation({
        recipientId: selectedUser.id,
        message: initialMessage
      });

      if (response.success) {
        setShowNewMessageModal(false);
        setSelectedUser(null);
        setInitialMessage('');
        
        // Refresh conversations and select the new one
        await fetchConversations();
        
        // Select the newly created conversation
        if (response.data.conversation) {  // Changed from response.data.messages
          setSelectedConversation(response.data.conversation);
          fetchMessages(response.data.conversation.id);
        }
      }
    } catch (error) {
      console.error('Error starting new conversation:', error);
    }
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100);
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just Now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv => {
    const name = `${conv.otherParticipant?.firstName} ${conv.otherParticipant?.lastName}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  // Filter users by search
  const filteredUsers = users.filter(user => {
    const name = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <div className="content">
        <div className="container">
          <ProfileCard />
          <div className="row">
            <AdminSidebar />
            <div className="col-lg-9">
              <div className="instructor-message">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="page-title mb-0">Messages</h5>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setShowNewMessageModal(true);
                      fetchUsers();
                    }}
                  >
                    <i className="fas fa-plus me-2"></i>
                    New Message
                  </button>
                </div>
                <div className="row">
                  {/* Chat User List */}
                  <div className="col-lg-5">
                    <div className="chat-cont-left">
                      <div className="chat-card mb-0 flex-fill">
                        <div className="chat-header">
                          <div className="input-icon">
                            <span className="input-icon-addon">
                              <i className="isax isax-search-normal-1 fs-14" />
                            </span>
                            <input
                              type="text"
                              className="form-control form-control-md"
                              placeholder="Search conversations..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="chat-body chat-users-list chat-scroll">
                          {filteredConversations.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                              <p>No conversations yet</p>
                              <button 
                                className="btn btn-sm btn-outline-primary mt-2"
                                onClick={() => {
                                  setShowNewMessageModal(true);
                                  fetchUsers();
                                }}
                              >
                                Start a conversation
                              </button>
                            </div>
                          ) : (
                            filteredConversations.map((conv) => (
                              <Link
                                key={conv.id}
                                to="#"
                                className={`d-flex justify-content-between align-items-center chat-member ${
                                  selectedConversation?.id === conv.id ? 'active' : ''
                                }`}
                                onClick={() => handleSelectConversation(conv)}
                              >
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-lg avatar-rounded flex-shrink-0 me-2">
                                    <ImageWithBasePath
                                      src={conv.otherParticipant?.avatar || 'assets/img/user/user-placeholder.jpg'}
                                      alt="User Image"
                                    />
                                    <span className={`badge badge-dot position-absolute bottom-0 end-0 ${
                                      conv.otherParticipant?.role === 'instructor' ? 'bg-warning' : 'bg-info'
                                    }`}></span>
                                  </div>
                                  <div>
                                    <h6 className="fs-16 fw-medium mb-1 d-flex align-items-center">
                                      {conv.otherParticipant?.firstName} {conv.otherParticipant?.lastName}
                                      <span className={`badge badge-sm ms-2 ${
                                        conv.otherParticipant?.role === 'instructor' ? 'bg-warning' : 'bg-info'
                                      }`}>
                                        {conv.otherParticipant?.role}
                                      </span>
                                      {conv.unreadCount > 0 && (
                                        <span className="msg-count badge badge-secondary d-flex align-items-center justify-content-center rounded-circle ms-2">
                                          {conv.unreadCount}
                                        </span>
                                      )}
                                    </h6>
                                    <p className="text-truncate mb-0" style={{ maxWidth: '200px' }}>
                                      {conv.lastMessagePreview}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="text-end">
                                    <p className="fs-12 text-muted mb-0">
                                      {formatTime(conv.lastMessageAt)}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Chat User List */}

                  {/* Chat Content */}
                  <div className="col-lg-7 chat-cont-right chat-window-long">
                    {selectedConversation ? (
                      <div className="chat-two-card chat-window mb-0 shadow-none flex-fill">
                        <div className="border-0 p-0 position-relative">
                          <div className="msg_head">
                            <div className="d-flex bd-highlight align-items-center">
                              <Link
                                id="back_user_list"
                                to="#"
                                className="back-user-list d-lg-none"
                                onClick={() => setSelectedConversation(null)}
                              >
                                <i className="fas fa-chevron-left" />
                              </Link>
                              <div className="avatar avatar-lg avatar-rounded flex-shrink-0 me-2">
                                <ImageWithBasePath
                                  src={selectedConversation.otherParticipant?.avatar || 'assets/img/user/user-placeholder.jpg'}
                                  alt="User"
                                />
                                <span className={`badge badge-dot position-absolute bottom-0 end-0 ${
                                  selectedConversation.otherParticipant?.role === 'instructor' ? 'bg-warning' : 'bg-info'
                                }`}></span>
                              </div>
                              <div>
                                <h6 className="fs-16 mb-1">
                                  {selectedConversation.otherParticipant?.firstName}{' '}
                                  {selectedConversation.otherParticipant?.lastName}
                                </h6>
                                <p className="fs-12 text-muted mb-0">
                                  <span className={`badge ${
                                    selectedConversation.otherParticipant?.role === 'instructor' ? 'bg-warning' : 'bg-info'
                                  }`}>
                                    {selectedConversation.otherParticipant?.role}
                                  </span>
                                  <span className="ms-2">{selectedConversation.otherParticipant?.email}</span>
                                </p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center send-action">
                              <Link
                                to="#"
                                className="btn chat-search-btn send-action-btn"
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                aria-label="Search"
                                onClick={() => setShowSearch(!showSearch)}
                              >
                                <i className="isax isax-search-normal-14" />
                              </Link>
                            </div>
                          </div>

                          {/* Chat Search */}
                          <div className={`chat-search search-wrap contact-search ${showSearch ? 'visible-chat' : ''}`}>
                            <form>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search Messages"
                                />
                                <span className="input-group-text">
                                  <i className="isax isax-search-normal-14" />
                                </span>
                              </div>
                            </form>
                          </div>
                        </div>

                        <div className="msg_card_body chat-scroll" ref={chatBodyRef}>
                          {loading ? (
                            <div className="text-center py-4">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            </div>
                          ) : (
                            <ul className="list-unstyled p-0">
                              {messages.map((msg) => {
                                const isSent = msg.senderId === currentUser?.id;
                                return (
                                  <li
                                    key={msg.id}
                                    className={isSent ? 'sent-message-group' : 'media received'}
                                  >
                                    {isSent ? (
                                      <ul>
                                        <li className="media sent d-flex align-items-end">
                                          <div className="media-body flex-grow-1">
                                            <div className="msg-box">
                                              <div className="d-flex align-items-end justify-content-end mb-1">
                                                <div className="avatar avatar-md avatar-rounded flex-shrink-0 ms-2">
                                                  <ImageWithBasePath
                                                    src={currentUser?.avatar || 'assets/img/user/user-01.jpg'}
                                                    alt="User Image"
                                                  />
                                                </div>
                                                <div className="position-relative">
                                                  <div className="d-flex align-items-center justify-content-end mb-1">
                                                    <div className="d-flex align-items-center">
                                                      <i className={`fa-solid ${msg.isRead ? 'fa-check-double text-success' : 'fa-check'} me-2 fs-12`} />
                                                      <p className="mb-0">{formatTime(msg.createdAt)}</p>
                                                      <i className="fa-solid fa-circle text-gray-1 fs-7 mx-1" />
                                                    </div>
                                                    <h6 className="fs-14 fw-normal d-flex align-items-center">
                                                      You
                                                    </h6>
                                                  </div>
                                                  <div>
                                                    <div className="sent-message">
                                                      <p>{msg.content}</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                      </ul>
                                    ) : (
                                      <div className="d-flex align-items-end mb-1">
                                        <div className="avatar avatar-md avatar-rounded flex-shrink-0 me-2">
                                          <ImageWithBasePath
                                            src={msg.sender?.avatar || 'assets/img/user/user-placeholder.jpg'}
                                            alt="User Image"
                                          />
                                        </div>
                                        <div className="media-body flex-grow-1">
                                          <div className="d-flex align-items-center mb-1">
                                            <h6 className="fs-14 fw-normal d-flex align-items-center">
                                              {msg.sender?.firstName} {msg.sender?.lastName}
                                            </h6>
                                            <div className="d-flex align-items-center">
                                              <i className="fa-solid fa-circle text-gray-1 fs-7 mx-1" />
                                              <p>{formatTime(msg.createdAt)}</p>
                                            </div>
                                          </div>
                                          <div className="msg-box">
                                            <div className="position-relative">
                                              <div className="d-flex align-items-center">
                                                <div className="received-message me-2">
                                                  <p>{msg.content}</p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>

                        <div className="chat-footer border-0 pt-0">
                          <div className="d-flex align-items-center">
                            <div className="chat-input me-2 flex-grow-1">
                              <input
                                className="form-control"
                                placeholder="Type your message here..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <button
                                className="btn btn-secondary btn_send"
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                              >
                                <i className="isax isax-send-1 text-white" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="chat-two-card chat-window mb-0 shadow-none flex-fill d-flex align-items-center justify-content-center">
                        <div className="text-center text-muted">
                          <i className="isax isax-message-text fs-1 mb-3 d-block"></i>
                          <h5>Select a conversation to start messaging</h5>
                          <p className="mb-3">Or start a new conversation with any user</p>
                          <button 
                            className="btn btn-primary"
                            onClick={() => {
                              setShowNewMessageModal(true);
                              fetchUsers();
                            }}
                          >
                            Start New Conversation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* /Chat Content */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Message</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowNewMessageModal(false);
                    setSelectedUser(null);
                    setInitialMessage('');
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Select User</label>
                  <select 
                    className="form-select"
                    value={selectedUser?.id || ''}
                    onChange={(e) => {
                      const user = users.find(u => u.id === e.target.value);
                      setSelectedUser(user || null);
                    }}
                  >
                    <option value="">Choose a user...</option>
                    {filteredUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email}) - {user.role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Initial Message</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Type your message here..."
                    value={initialMessage}
                    onChange={(e) => setInitialMessage(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowNewMessageModal(false);
                    setSelectedUser(null);
                    setInitialMessage('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleStartNewConversation}
                  disabled={!selectedUser || !initialMessage.trim()}
                >
                  Start Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminMessage;