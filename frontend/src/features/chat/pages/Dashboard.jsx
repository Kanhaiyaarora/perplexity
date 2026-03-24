import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Plus, Trash2, Moon, Sun, LogOut, User, Menu, X, Brain, MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'

const Dashboard = () => {
  const { user } = useSelector(state => state.auth)
  const { initializedSocketConnection, handleSendMessage, handleGetChats, handleOpenChat } = useChat();

  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);


  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const currentChat = chats[currentChatId];

  const messages = currentChat ? currentChat.messages : [];


  // Socket.io
  useEffect(() => {
    initializedSocketConnection()
    handleGetChats()
  }, [])


  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Save theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const message = input.trim();
    setInput('');
    setIsTyping(true);
    try {
      await handleSendMessage({ message, chatId: currentChatId });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle input change with auto-expand
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // New chat - simplified since we can only use hook layer
  const newChat = () => {
    // For now, just clear the current chat selection
    // The hook will create a new chat when sending the first message
    setStreamingMessage('');
    setIsTyping(false);
  };

  // Switch chat - simplified since we can only use hook layer
  const switchChat = (chatId) => {
    // For now, just update local state - ideally this should be in the hook
    handleOpenChat(chatId, chats)
    setStreamingMessage('');
    setIsTyping(false);
  };

  // Delete chat - simplified since we can only use hook layer
  const deleteChat = (chatId) => {
    // For now, just switch to another chat if available
    setStreamingMessage('');
    setIsTyping(false);
  };

  return (
    <>
      <style>
        {`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          textarea::-webkit-scrollbar {
            display: none;
          }
          textarea {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .chat-item-active {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
          }
          @media (max-width: 768px) {
            .sidebar-overlay {
              display: none;
            }
          }
        `}
      </style>
      <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-black'}`}>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-r transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}>

          {/* Logo Section */}
          <div className={`flex items-center justify-center h-20 border-b ${theme === 'dark' ? 'border-gray-800 bg-linear-to-b from-gray-800 to-gray-900' : 'border-gray-100 bg-linear-to-b from-blue-50 to-white'} relative z-10`}>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Chat</h1>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="px-3 py-4 border-b border-gray-800 dark:border-gray-800">
            <button onClick={newChat} className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
              <Plus className="w-5 h-5" />
              New Chat
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-2">
            {Object.keys(chats).length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className={`w-8 h-8 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} />
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>No chats yet</p>
              </div>
            ) : (
              Object.values(chats).map(chat => (
                <div
                  key={chat.id}
                  className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${chat.id === currentChatId ? (theme === 'dark' ? 'chat-item-active bg-gray-800 border border-purple-500/30' : 'chat-item-active bg-blue-50/50 border border-blue-200/50') : (theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50')}`}
                >
                  <span
                    onClick={() => switchChat(chat.id)}
                    className="flex-1 truncate font-medium text-sm"
                    title={chat.title}
                  >
                    {chat.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                    className={`ml-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ${theme === 'dark' ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300' : 'hover:bg-red-100 text-red-500 hover:text-red-600'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Theme Toggle */}
          <div className={`p-3 border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-yellow-600'}`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="text-sm font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          </div>

          {/* User Info */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'}`}>
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-sm">{user.username}</span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</span>
                </div>
              </div>
              <LogOut className={`w-5 h-5 cursor-pointer transition-colors opacity-0 group-hover:opacity-100 ${theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`} />
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        <div
          className={`md:hidden fixed inset-0 bg-black/40 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-800 bg-gray-900/50 backdrop-blur-sm' : 'border-gray-100 bg-white/50 backdrop-blur-sm'} shadow-sm`}>
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`md:hidden p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h2 className="text-lg font-semibold">{currentChat ? currentChat.title : 'AI Chat'}</h2>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{messages.length} messages</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto scrollbar-hide ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Start a new conversation</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Ask anything. Get instant AI-powered responses.</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-sm lg:max-w-md px-4 py-3 rounded-2xl transition-all duration-200 ${msg.role === 'user' ? `bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md` : theme === 'dark' ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-gray-100 text-gray-900 border border-gray-200'}`}>
                      {msg.role === 'ai' ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 justify-start animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'}`}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                {streamingMessage && (
                  <div className="flex gap-3 justify-start animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className={`max-w-sm lg:max-w-md px-4 py-3 rounded-2xl ${theme === 'dark' ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-gray-100 text-gray-900 border border-gray-200'}`}>
                      {streamingMessage}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className={`border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white/50'} backdrop-blur-sm`}>
            <div className="p-6 flex items-end gap-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Ask anything..."
                className={`flex-1 px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 max-h-32 min-h-12 font-medium ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-black placeholder-gray-500'}`}
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
