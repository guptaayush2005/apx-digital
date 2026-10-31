import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Search, 
  Trash2, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  LogOut, 
  MessageSquare, 
  LayoutDashboard, 
  Layers, 
  ArrowRight,
  ExternalLink,
  Radio,
  Eye,
  EyeOff,
  Bell,
  Plus,
  Edit,
  FolderGit2,
  X,
  Bot,
  Menu,
  Wrench
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

interface MessageReply {
  id: string;
  message_id: string;
  sender: string;
  sender_name: string;
  reply_text: string;
  created_at: string;
}

interface AdminMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  source: 'contact' | 'inquiry';
  budget?: string;
  timeline?: string;
  status: 'New' | 'Read' | 'Replied' | 'Closed';
  created_at: string;
  updated_at: string;
  reply_count?: number;
}

interface ChatConversation {
  id: string;
  visitor_id: string;
  visitor_name: string;
  visitor_email: string;
  status: string;
  unread_admin: number;
  created_at: string;
  last_activity: string;
  last_message?: string;
  last_message_time?: string;
}

interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: 'visitor' | 'admin' | 'ai';
  sender_name: string;
  message: string;
  created_at: string;
}

interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  category: string;
  technologies: string[];
  thumbnail_url: string;
  gallery_images: string[];
  live_url?: string;
  github_url?: string;
  case_study_url?: string;
  completion_date?: string;
  is_featured: boolean;
  status: 'Published' | 'Draft';
  created_at: string;
  updated_at: string;
}

interface ServiceTool {
  id: string;
  title: string;
  description: string;
  url: string;
  badge: string;
  is_free: number;
  is_visible: number;
  features?: string;
  updated_at?: string;
}

interface Metrics {
  totalMessages: number;
  newMessages: number;
  repliedMessages: number;
  closedMessages: number;
  activeChats: number;
  totalInquiries: number;
  totalProjects: number;
  recentActivities: { id: string; type: string; title: string; description: string; created_at: string }[];
}

export const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isLight = theme === 'light';
  const adminLogoSrc = isLight ? '/brand/apx-logo-light-tight.jpg' : '/brand/apx-logo-tight.jpg';

  // Auth State
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('apx_admin_token'));
  const [adminUser, setAdminUser] = useState<any>(() => {
    const saved = sessionStorage.getItem('apx_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(() => {
    return sessionStorage.getItem('apx_must_change_pwd') === 'true';
  });

  // Login Form - Clean state, no hardcoded secrets in source
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forced Password Change Form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [pwdChangeError, setPwdChangeError] = useState('');
  const [isUpdatingPwd, setIsUpdatingPwd] = useState(false);

  // Dashboard Nav Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'inbox' | 'livechat' | 'website' | 'services'>('overview');

  // Mobile Sidebar Drawer
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Services & Tools Management State
  const [servicesTools, setServicesTools] = useState<ServiceTool[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ServiceTool | null>(null);
  const [toolForm, setToolForm] = useState({
    title: '',
    description: '',
    url: '',
    badge: 'FREE TOOL',
    is_free: true,
    is_visible: true,
  });
  const [isSavingTool, setIsSavingTool] = useState(false);
  const [toolModalError, setToolModalError] = useState('');

  // Metrics & Activities
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  // Notifications
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Messages List
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  // Selected Message Modal / Drawer
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const [replies, setReplies] = useState<MessageReply[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Live Chat
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [liveChatMessages, setLiveChatMessages] = useState<ChatMessage[]>([]);
  const [liveInputText, setLiveInputText] = useState('');
  const [, setIsWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Portfolio Management
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [portfolioFilter, setPortfolioFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    category: 'Website Development',
    technologies: '',
    thumbnail_url: '',
    gallery_images: '',
    live_url: '',
    github_url: '',
    case_study_url: '',
    completion_date: '',
    is_featured: false,
    status: 'Published' as 'Published' | 'Draft'
  });
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectModalError, setProjectModalError] = useState('');

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginIdentifier, password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setToken(data.token);
        setAdminUser(data.user);
        setMustChangePassword(Boolean(data.must_change_password));
        sessionStorage.setItem('apx_admin_token', data.token);
        sessionStorage.setItem('apx_admin_user', JSON.stringify(data.user));
        sessionStorage.setItem('apx_must_change_pwd', String(Boolean(data.must_change_password)));
        if (!data.must_change_password) {
          navigate('/admin/dashboard');
        }
      } else {
        setLoginError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      setLoginError('Failed to connect to the APX Digital security server.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (token && !mustChangePassword && (location.pathname === '/admin' || location.pathname === '/admin/login')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [token, mustChangePassword, location.pathname, navigate]);

  // Handle Forced Password Change
  const handleForcedPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdChangeError('');

    if (newPassword.trim().length < 6) {
      setPwdChangeError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdChangeError('New password and confirmation do not match.');
      return;
    }

    setIsUpdatingPwd(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: loginPassword,
          newPassword: newPassword.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMustChangePassword(false);
        sessionStorage.setItem('apx_must_change_pwd', 'false');
        fetchMetrics();
        navigate('/admin/dashboard');
      } else {
        setPwdChangeError(data.error || 'Failed to update administrator password.');
      }
    } catch {
      setPwdChangeError('Network failure updating administrator security keys.');
    } finally {
      setIsUpdatingPwd(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setAdminUser(null);
    setMustChangePassword(false);
    sessionStorage.removeItem('apx_admin_token');
    sessionStorage.removeItem('apx_admin_user');
    sessionStorage.removeItem('apx_must_change_pwd');
    if (wsRef.current) {
      wsRef.current.close();
    }
    navigate('/admin/login');
  };

  // Fetch Services & Tools
  const fetchServicesTools = async () => {
    if (!token) return;
    setIsLoadingServices(true);
    try {
      const res = await fetch('/api/admin/services-tools', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setServicesTools(data.tools || []);
      }
    } catch (e) {
      console.error('Failed to load services tools:', e);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const openEditToolModal = (tool: ServiceTool) => {
    setEditingTool(tool);
    setToolForm({
      title: tool.title,
      description: tool.description,
      url: tool.url,
      badge: tool.badge || 'FREE TOOL',
      is_free: Boolean(tool.is_free),
      is_visible: Boolean(tool.is_visible),
    });
    setToolModalError('');
    setIsToolModalOpen(true);
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingTool) return;
    setIsSavingTool(true);
    setToolModalError('');

    try {
      const res = await fetch(`/api/admin/services-tools/${editingTool.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: toolForm.title.trim(),
          description: toolForm.description.trim(),
          url: toolForm.url.trim(),
          badge: toolForm.badge.trim(),
          is_free: toolForm.is_free ? 1 : 0,
          is_visible: toolForm.is_visible ? 1 : 0,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsToolModalOpen(false);
        fetchServicesTools();
      } else {
        setToolModalError(data.error || 'Failed to update service/tool.');
      }
    } catch {
      setToolModalError('Network error while updating service/tool.');
    } finally {
      setIsSavingTool(false);
    }
  };

  // Fetch Metrics
  const fetchMetrics = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
        if (data.recentActivities) {
          setActivities(data.recentActivities);
        }
      }
    } catch (e) {
      console.error('Failed to load metrics:', e);
    }
  };

  // Fetch Notifications
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUnreadNotifications(data.unreadCount || 0);
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
  };

  // Fetch Messages
  const fetchMessages = async (overrideStatus?: string) => {
    if (!token) return;
    setIsLoadingMessages(true);
    try {
      const params = new URLSearchParams();
      const effStatus = overrideStatus !== undefined ? overrideStatus : statusFilter;
      if (effStatus !== 'All') params.append('status', effStatus);
      if (sourceFilter !== 'All') params.append('source', sourceFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/admin/messages?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Failed to load messages:', e);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Fetch Portfolio Projects
  const fetchPortfolio = async () => {
    if (!token) return;
    setIsLoadingPortfolio(true);
    try {
      const res = await fetch('/api/admin/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolioProjects(data.projects || []);
      }
    } catch (e) {
      console.error('Failed to load portfolio:', e);
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  // Fetch Message Details
  const openMessage = async (msg: AdminMessage) => {
    setSelectedMessage(msg);
    setReplyText('');
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedMessage(data.message);
        setReplies(data.replies || []);
      }
      if (msg.status === 'New') {
        updateMessageStatus(msg.id, 'Read');
      }
    } catch (e) {
      console.error('Failed to load message details:', e);
    }
  };

  // Update Status
  const updateMessageStatus = async (id: string, newStatus: 'New' | 'Read' | 'Replied' | 'Closed') => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => prev ? { ...prev, status: newStatus } : null);
        }
        fetchMetrics();
        fetchNotifications();
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  // Delete Message
  const deleteMessage = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to permanently delete this customer inquiry and its audit thread?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        fetchMetrics();
        fetchNotifications();
      }
    } catch (e) {
      console.error('Failed to delete message:', e);
    }
  };

  // Send Reply
  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedMessage || !replyText.trim()) return;

    setIsSendingReply(true);
    try {
      const res = await fetch(`/api/admin/messages/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          replyText: replyText.trim(),
          senderName: adminUser?.name || 'Ayush Gupta (Founder)',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setReplies((prev) => [...prev, data.reply]);
        setReplyText('');
        setSelectedMessage((prev) => prev ? { ...prev, status: 'Replied' } : null);
        setMessages((prev) =>
          prev.map((m) => (m.id === selectedMessage.id ? { ...m, status: 'Replied' } : m))
        );
        fetchMetrics();
      }
    } catch (e) {
      console.error('Failed to send reply:', e);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Fetch Live Chat Conversations
  const fetchConversations = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        if (!activeConvId && data.conversations?.length > 0) {
          setActiveConvId(data.conversations[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load conversations:', e);
    }
  };

  // Fetch Messages for a Live Conversation
  const fetchLiveMessages = async (convId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/conversations/${convId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLiveChatMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Failed to load live chat messages:', e);
    }
  };

  // Open Project Form Modal
  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      slug: '',
      short_description: '',
      full_description: '',
      category: 'Website Development',
      technologies: 'React, TypeScript, FastAPI, PostgreSQL',
      thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      gallery_images: '',
      live_url: '',
      github_url: '',
      case_study_url: '',
      completion_date: '2026-03',
      is_featured: false,
      status: 'Published'
    });
    setProjectModalError('');
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: PortfolioProject) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      slug: proj.slug,
      short_description: proj.short_description,
      full_description: proj.full_description || '',
      category: proj.category,
      technologies: proj.technologies.join(', '),
      thumbnail_url: proj.thumbnail_url,
      gallery_images: proj.gallery_images.join(', '),
      live_url: proj.live_url || '',
      github_url: proj.github_url || '',
      case_study_url: proj.case_study_url || '',
      completion_date: proj.completion_date || '',
      is_featured: proj.is_featured,
      status: proj.status
    });
    setProjectModalError('');
    setIsProjectModalOpen(true);
  };

  // Save Project (Create or Edit)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSavingProject(true);
    setProjectModalError('');

    try {
      const isEditing = Boolean(editingProject);
      const url = isEditing ? `/api/admin/portfolio/${editingProject!.id}` : '/api/admin/portfolio';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectForm)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsProjectModalOpen(false);
        fetchPortfolio();
        fetchMetrics();
      } else {
        setProjectModalError(data.error || 'Failed to save portfolio project.');
      }
    } catch {
      setProjectModalError('Network error connecting to portfolio database.');
    } finally {
      setIsSavingProject(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (proj: PortfolioProject) => {
    if (!token) return;
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${proj.title}"? This will immediately remove it from the public Our Work page.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/portfolio/${proj.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPortfolio();
        fetchMetrics();
      } else {
        alert('Failed to delete project.');
      }
    } catch (e) {
      console.error('Delete project error:', e);
    }
  };

  // WebSocket Connection for Admin
  useEffect(() => {
    if (!token || mustChangePassword) return;

    fetchMetrics();
    fetchNotifications();
    fetchMessages();
    fetchConversations();
    fetchPortfolio();
    fetchServicesTools();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsWsConnected(true);
      ws.send(JSON.stringify({ type: 'admin:auth', token }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'admin:notification') {
          fetchMetrics();
          fetchNotifications();
          fetchMessages();
        } else if (msg.type === 'admin:visitor_joined') {
          fetchConversations();
        } else if (msg.type === 'chat:new_message') {
          setLiveChatMessages((prev) => {
            if (msg.conversation_id === activeConvId && !prev.some((m) => m.id === msg.id)) {
              return [...prev, msg];
            }
            return prev;
          });
          fetchConversations();
          fetchMetrics();
        }
      } catch (e) {
        console.error('WS parse error:', e);
      }
    };

    ws.onclose = () => {
      setIsWsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [token, mustChangePassword]);

  useEffect(() => {
    if (activeConvId && token && !mustChangePassword) {
      fetchLiveMessages(activeConvId);
    }
  }, [activeConvId, token, mustChangePassword]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [liveChatMessages]);

  const sendLiveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveInputText.trim() || !activeConvId || !wsRef.current) return;

    const payload = {
      type: 'admin:message',
      conversationId: activeConvId,
      text: liveInputText.trim(),
      senderName: adminUser?.name || 'Ayush Gupta (Founder)',
    };

    wsRef.current.send(JSON.stringify(payload));
    setLiveInputText('');
  };

  // ==========================================
  // VIEW 1: LOGIN PORTAL (if not authenticated)
  // ==========================================
  if (!token) {
    return (
      <div 
        className="admin-login-view"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          backgroundColor: 'var(--bg-primary)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
          <ThemeToggle />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="admin-login-card"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '2.5rem',
            borderRadius: '24px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-highlight)',
            boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              className="admin-login-icon-box"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem auto',
                color: 'var(--accent-primary)',
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {t.adminLoginExtras?.title || 'APX Digital Admin'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              {t.adminLoginExtras?.subtitle || 'Restricted management console. Authorized personnel only.'}
            </p>
          </div>

          {loginError && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.5rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                {t.adminLoginExtras?.usernameLabel || 'Admin Username or Email'}
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
                placeholder={t.adminLoginExtras?.usernamePlaceholder || 'ayush44129@gmail.com'}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                {t.adminLoginExtras?.passwordLabel || 'Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  placeholder={t.adminLoginExtras?.passwordPlaceholder || 'Enter administrator password'}
                  style={{
                    width: '100%',
                    padding: '0.85rem 2.6rem 0.85rem 1.1rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                marginTop: '0.8rem',
                padding: '0.95rem',
                borderRadius: '12px',
                background: 'var(--accent-gradient)',
                color: 'var(--accent-contrast)',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                boxShadow: 'var(--shadow-accent)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <Lock size={18} />
              <span>{isLoggingIn ? (t.adminLoginExtras?.submittingBtn || 'Authenticating...') : (t.adminLoginExtras?.submitBtn || 'Sign In to Admin Portal')}</span>
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a
                href="/"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                ← Return to Public Website
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FORCED PASSWORD CHANGE (If mustChangePassword is true)
  // ==========================================
  if (mustChangePassword) {
    return (
      <div 
        className="admin-login-view"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          backgroundColor: 'var(--bg-primary)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
          <ThemeToggle />
        </div>
        <div
          className="admin-login-card"
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: '2.5rem',
            borderRadius: '24px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-highlight)',
            boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <div
              className="admin-login-icon-box"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem auto',
                color: 'var(--accent-primary)',
              }}
            >
              <Lock size={26} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Security Requirement: Update Password
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.5 }}>
              You have authenticated using the initial temporary credentials. For production security, you must set a permanent personal password before accessing the dashboard.
            </p>
          </div>

          {pwdChangeError && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.5rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{pwdChangeError}</span>
            </div>
          )}

          <form onSubmit={handleForcedPasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                New Secure Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Minimum 6 characters"
                  style={{
                    width: '100%',
                    padding: '0.85rem 2.6rem 0.85rem 1.1rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter new password"
                style={{
                  width: '100%',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPwd}
              style={{
                marginTop: '0.8rem',
                padding: '0.95rem',
                borderRadius: '12px',
                background: 'var(--accent-gradient)',
                color: 'var(--accent-contrast)',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                boxShadow: 'var(--shadow-accent)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={18} />
              <span>{isUpdatingPwd ? 'Updating Security...' : 'Save Password & Enter Dashboard'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="admin-dashboard-view" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header
        className="admin-dashboard-header"
        style={{
          height: '70px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {/* Mobile Drawer Hamburger */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="admin-mobile-toggle-btn"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle navigation drawer"
          >
            {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img
              src={adminLogoSrc}
              alt="APX Digital"
              style={{
                height: '34px',
                width: 'auto',
                borderRadius: '6px',
                border: isLight ? '1px solid #DCE6F5' : 'none',
                boxShadow: isLight ? '0 2px 6px rgba(21, 94, 239, 0.1)' : '0 2px 6px rgba(0, 0, 0, 0.2)',
              }}
            />
          </a>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'var(--accent-subtle)',
              color: 'var(--accent-primary)',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Admin Engine
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
          {/* Theme Toggle in Admin Header */}
          <ThemeToggle />

          {/* Notifications Bell — Displayed separately on left of profile */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: unreadNotifications > 0 ? 'var(--accent-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--accent-contrast)',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  width: '320px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-highlight)',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '12px',
                  zIndex: 200,
                  maxHeight: '380px',
                  overflowY: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px 10px 8px', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.8rem', fontWeight: 800 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Recent Notifications</span>
                  <span style={{ color: 'var(--accent-primary)' }}>{unreadNotifications} New</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      No new notifications.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setShowNotificationsDropdown(false);
                          setActiveTab('inbox');
                          fetchMessages();
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Section — Properly aligned with Initials avatar, name, email & role */}
          <div
            className="admin-header-profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px 6px 8px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '360px',
            }}
          >
            {/* Initials Avatar Badge (AG) */}
            <div
              className="admin-avatar-badge"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-subtle)',
                border: '1.5px solid var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                fontWeight: 900,
                fontSize: '0.86rem',
                flexShrink: 0,
                letterSpacing: '0.04em',
              }}
            >
              AG
            </div>

            {/* Profile Info Columns */}
            <div className="admin-profile-meta" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  Ayush Gupta
                </span>
                <span
                  style={{
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    backgroundColor: 'var(--accent-subtle)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Founder
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                <span
                  style={{
                    fontSize: '0.73rem',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '160px',
                  }}
                  title={adminUser?.email || 'ayush44129@gmail.com'}
                >
                  {adminUser?.email || 'ayush44129@gmail.com'}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>•</span>
                <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  Super Admin
                </span>
              </div>
            </div>
          </div>

          {/* Sign Out Button — Cleanly positioned on the far right */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            title="Sign Out of Admin Portal"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Mobile Backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 95,
            }}
          />
        )}

        {/* Sidebar Tabs / Drawer */}
        <aside
          className={`admin-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}
          style={{
            width: '250px',
            backgroundColor: 'var(--bg-card)',
            borderRight: '1px solid var(--border-subtle)',
            padding: '1.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            zIndex: 96,
          }}
        >
          <button
            onClick={() => {
              setActiveTab('overview');
              setIsMobileSidebarOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'overview' ? 'var(--accent-subtle)' : 'transparent',
              color: activeTab === 'overview' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('inbox');
              fetchMessages();
              setIsMobileSidebarOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'inbox' ? 'var(--accent-subtle)' : 'transparent',
              color: activeTab === 'inbox' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={18} />
              <span>Inbox</span>
            </div>
            {metrics?.newMessages ? (
              <span
                style={{
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--accent-contrast)',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                }}
              >
                {metrics.newMessages}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => {
              setActiveTab('livechat');
              fetchConversations();
              setIsMobileSidebarOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'livechat' ? 'var(--accent-subtle)' : 'transparent',
              color: activeTab === 'livechat' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageSquare size={18} />
              <span>Live Chat</span>
            </div>
            {metrics?.activeChats ? (
              <span
                style={{
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                }}
              >
                {metrics.activeChats}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => {
              setActiveTab('website');
              fetchPortfolio();
              setIsMobileSidebarOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'website' ? 'var(--accent-subtle)' : 'transparent',
              color: activeTab === 'website' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={18} />
              <span>Website CMS</span>
            </div>
            {metrics?.totalProjects ? (
              <span
                style={{
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                }}
              >
                {metrics.totalProjects}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => {
              setActiveTab('services');
              fetchServicesTools();
              setIsMobileSidebarOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'services' ? 'var(--accent-subtle)' : 'transparent',
              color: activeTab === 'services' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wrench size={18} />
              <span>Services & Tools</span>
            </div>
            <span
              style={{
                padding: '2px 7px',
                borderRadius: '9999px',
                backgroundColor: 'var(--accent-subtle)',
                color: 'var(--accent-primary)',
                fontSize: '0.72rem',
                fontWeight: 800,
              }}
            >
              FREE
            </span>
          </button>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxHeight: 'calc(100vh - 70px)' }}>
          {/* TAB 1: OVERVIEW — ALL METRIC CARDS ARE CLICKABLE */}
          {activeTab === 'overview' && (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                  System Overview
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '0.94rem' }}>
                  Live operational telemetry and visitor interaction metrics for APX Digital. Click any card to navigate to filtered view.
                </p>
              </div>

              {/* Clickable Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
                {/* 1. Total Inquiries -> Opens Inbox (All) */}
                <div
                  className="admin-stat-card"
                  onClick={() => {
                    setStatusFilter('All');
                    setActiveTab('inbox');
                    fetchMessages('All');
                  }}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="Click to view all inquiries"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Inquiries</span>
                    <Mail size={18} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {metrics?.totalMessages ?? 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>View all inquiries</span>
                    <ArrowRight size={12} />
                  </div>
                </div>

                {/* 2. New Messages -> Opens Inbox (New) */}
                <div
                  className="admin-stat-card"
                  onClick={() => {
                    setStatusFilter('New');
                    setActiveTab('inbox');
                    fetchMessages('New');
                  }}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-highlight)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="Click to view unread inquiries"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>New Messages</span>
                    <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                    {metrics?.newMessages ?? 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Show unread only</span>
                    <ArrowRight size={12} />
                  </div>
                </div>

                {/* 3. Replied -> Opens Inbox (Replied) */}
                <div
                  className="admin-stat-card"
                  onClick={() => {
                    setStatusFilter('Replied');
                    setActiveTab('inbox');
                    fetchMessages('Replied');
                  }}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="Click to view answered inquiries"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Replied</span>
                    <CheckCircle2 size={18} style={{ color: '#10B981' }} />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10B981' }}>
                    {metrics?.repliedMessages ?? 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>View resolved threads</span>
                    <ArrowRight size={12} />
                  </div>
                </div>

                {/* 4. Active Live Chats -> Opens Live Chat */}
                <div
                  className="admin-stat-card"
                  onClick={() => {
                    setActiveTab('livechat');
                    fetchConversations();
                  }}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="Click to open active live chats"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Live Chats</span>
                    <Radio size={18} style={{ color: 'var(--accent-bright)' }} />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-bright)' }}>
                    {metrics?.activeChats ?? 0}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-bright)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Launch live console</span>
                    <ArrowRight size={12} />
                  </div>
                </div>

                {/* 5. Total Projects -> Opens Website CMS / Portfolio */}
                <div
                  className="admin-stat-card"
                  onClick={() => {
                    setActiveTab('website');
                    fetchPortfolio();
                  }}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="Click to manage portfolio projects"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Projects</span>
                    <FolderGit2 size={18} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                    {metrics?.totalProjects ?? 1}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Manage portfolio</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>

              {/* Real System Activities (From Database) */}
              <div style={{ padding: '1.8rem', borderRadius: '16px', backgroundColor: '#111318', border: '1px solid #20242C' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Recent System Activity
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Audit Log</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {activities.length > 0 ? (
                    activities.map((act) => (
                      <div
                        key={act.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          backgroundColor: '#181A20',
                          border: '1px solid #232730',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>{act.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{act.description}</div>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                          {new Date(act.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#64748B', fontSize: '0.88rem', padding: '1rem', textAlign: 'center' }}>
                      No activity logs recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INBOX */}
          {activeTab === 'inbox' && (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                    Customer Inquiries & Messages
                  </h2>
                  <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
                    Manage contact form submissions, review specifications, and send direct replies.
                  </p>
                </div>

                {/* Filters & Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input
                      type="text"
                      placeholder="Search inquiries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchMessages()}
                      style={{
                        padding: '7px 12px 7px 34px',
                        borderRadius: '8px',
                        backgroundColor: '#111318',
                        border: '1px solid #282C34',
                        color: '#FFFFFF',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setTimeout(() => fetchMessages(e.target.value), 50);
                    }}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#111318',
                      border: '1px solid #282C34',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Read">Read</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <select
                    value={sourceFilter}
                    onChange={(e) => {
                      setSourceFilter(e.target.value);
                      setTimeout(() => fetchMessages(), 50);
                    }}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#111318',
                      border: '1px solid #282C34',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  >
                    <option value="All">All Sources</option>
                    <option value="contact">Contact Form</option>
                    <option value="inquiry">Project Scope</option>
                  </select>
                </div>
              </div>

              {/* Messages Table */}
              <div style={{ backgroundColor: '#111318', borderRadius: '16px', border: '1px solid #20242C', overflow: 'hidden' }}>
                {isLoadingMessages ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>No submissions matching current criteria.</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #20242C', color: '#64748B', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <th style={{ padding: '1rem 1.2rem' }}>Status</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Sender</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Subject / Domain</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Source</th>
                          <th style={{ padding: '1rem 1.2rem' }}>Date & Time</th>
                          <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((msg) => (
                          <tr
                            key={msg.id}
                            style={{
                              borderBottom: '1px solid #1C1F26',
                              backgroundColor: msg.status === 'New' ? 'rgba(255,140,50,0.04)' : 'transparent',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s',
                            }}
                            onClick={() => openMessage(msg)}
                          >
                            <td style={{ padding: '1rem 1.2rem' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  backgroundColor:
                                    msg.status === 'New' ? 'var(--accent-subtle)' :
                                    msg.status === 'Replied' ? 'rgba(16,185,129,0.18)' :
                                    msg.status === 'Closed' ? 'rgba(100,116,139,0.18)' : 'rgba(56,189,248,0.18)',
                                  color:
                                    msg.status === 'New' ? 'var(--accent-primary)' :
                                    msg.status === 'Replied' ? '#10B981' :
                                    msg.status === 'Closed' ? '#94A3B8' : '#38BDF8',
                                }}
                              >
                                {msg.status}
                              </span>
                            </td>
                            <td style={{ padding: '1rem 1.2rem' }}>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{msg.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{msg.email}</div>
                            </td>
                            <td style={{ padding: '1rem 1.2rem', maxWidth: '300px' }}>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {msg.subject}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {msg.message}
                              </div>
                            </td>
                            <td style={{ padding: '1rem 1.2rem' }}>
                              <span style={{ fontSize: '0.78rem', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                                {msg.source === 'inquiry' ? 'Project Proposal' : 'Contact Form'}
                              </span>
                            </td>
                            <td style={{ padding: '1rem 1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {new Date(msg.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </td>
                            <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => deleteMessage(msg.id)}
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#EF4444',
                                  cursor: 'pointer',
                                }}
                                title="Delete inquiry"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Message Details Modal */}
              {selectedMessage && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1.5rem',
                  }}
                  onClick={() => setSelectedMessage(null)}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '750px',
                      maxHeight: '90vh',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '20px',
                      border: '1px solid var(--border-highlight)',
                      boxShadow: 'var(--shadow-glow)',
                      overflowY: 'auto',
                      padding: '2rem',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            backgroundColor: 'var(--accent-subtle)',
                            color: 'var(--accent-primary)',
                            marginBottom: '6px',
                          }}
                        >
                          {selectedMessage.status}
                        </span>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {selectedMessage.subject}
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          From: <strong style={{ color: 'var(--text-primary)' }}>{selectedMessage.name}</strong> ({selectedMessage.email})
                          {selectedMessage.phone && ` • Phone: ${selectedMessage.phone}`}
                          {selectedMessage.company && ` • Company: ${selectedMessage.company}`}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedMessage(null)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        <X size={22} />
                      </button>
                    </div>

                    {/* Status Changer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', padding: '0.8rem 1rem', borderRadius: '10px', backgroundColor: 'var(--bg-surface)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Update Status:</span>
                      {(['New', 'Read', 'Replied', 'Closed'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateMessageStatus(selectedMessage.id, st)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            backgroundColor: selectedMessage.status === st ? 'var(--accent-primary)' : 'var(--bg-card)',
                            color: selectedMessage.status === st ? 'var(--accent-contrast)' : 'var(--text-secondary)',
                          }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {/* Body */}
                    <div style={{ padding: '1.2rem', borderRadius: '12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                      {selectedMessage.message}
                    </div>

                    {/* Replies Thread */}
                    {replies.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                          Official Replies ({replies.length})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          {replies.map((r) => (
                            <div key={r.id} style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'var(--accent-subtle)', border: '1px solid var(--border-highlight)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.78rem' }}>
                                <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{r.sender_name}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleString()}</span>
                              </div>
                              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{r.reply_text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Send Reply Form */}
                    <form onSubmit={sendReply}>
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Type an official response to ${selectedMessage.name}...`}
                        required
                        style={{
                          width: '100%',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '0.88rem',
                          outline: 'none',
                          marginBottom: '8px',
                          resize: 'vertical',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          type="submit"
                          disabled={isSendingReply}
                          style={{
                            padding: '8px 18px',
                            borderRadius: '8px',
                            background: 'var(--accent-gradient)',
                            color: 'var(--accent-contrast)',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Send size={14} />
                          <span>{isSendingReply ? 'Sending...' : 'Send Official Reply'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE CHAT */}
          {activeTab === 'livechat' && (
            <div style={{ maxWidth: '1200px', margin: '0 auto', height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1.2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                  Live Visitor Chat Gateway
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
                  Engage website visitors in real time via bidirectional WebSockets.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '320px 1fr',
                  flex: 1,
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                }}
              >
                {/* Conversations List */}
                <div style={{ borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Active Visitor Conversations ({conversations.length})
                  </div>
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {conversations.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No active chat sessions. Visitors will appear here when they click "Talk to a Live Agent".
                      </div>
                    ) : (
                      conversations.map((conv) => {
                        const isSelected = conv.id === activeConvId;
                        return (
                          <div
                            key={conv.id}
                            onClick={() => setActiveConvId(conv.id)}
                            style={{
                              padding: '1rem',
                              borderBottom: '1px solid var(--border-subtle)',
                              backgroundColor: isSelected ? 'var(--accent-subtle)' : 'transparent',
                              borderLeft: isSelected ? '3px solid var(--accent-primary)' : '3px solid transparent',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                                {conv.visitor_name}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                              {conv.visitor_email || 'Anonymous Visitor'}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {conv.last_message || 'Session started'}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Chat Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {activeConvId ? (
                    <>
                      {/* Chat Header */}
                      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)' }}>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {conversations.find((c) => c.id === activeConvId)?.visitor_name || 'Visitor'}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                            Live Session
                          </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ID: {activeConvId}
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div
                        ref={chatScrollRef}
                        style={{
                          flex: 1,
                          padding: '1.5rem',
                          overflowY: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                        }}
                      >
                        {liveChatMessages.length === 0 ? (
                          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No messages in this conversation yet. Send a greeting to start.
                          </div>
                        ) : (
                          liveChatMessages.map((m) => {
                            const isAdmin = m.sender === 'admin';
                            const isAi = m.sender === 'ai';

                            return (
                              <div
                                key={m.id}
                                style={{
                                  alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                                  maxWidth: '75%',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--text-muted)',
                                    marginBottom: '3px',
                                    textAlign: isAdmin ? 'right' : 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    justifyContent: isAdmin ? 'flex-end' : 'flex-start',
                                  }}
                                >
                                  {isAi && <Bot size={12} style={{ color: 'var(--accent-primary)' }} />}
                                  <span>{m.sender_name}</span>
                                  <span>•</span>
                                  <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div
                                  style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    backgroundColor: isAdmin ? 'var(--accent-primary)' : isAi ? 'var(--bg-surface)' : 'var(--bg-card)',
                                    color: isAdmin ? 'var(--accent-contrast)' : 'var(--text-primary)',
                                    fontWeight: isAdmin ? 600 : 400,
                                    fontSize: '0.88rem',
                                    lineHeight: 1.5,
                                    border: isAi ? '1px solid var(--border-highlight)' : '1px solid var(--border-subtle)',
                                  }}
                                >
                                  {m.message}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Chat Input */}
                      <form
                        onSubmit={sendLiveMessage}
                        style={{
                          padding: '1rem 1.5rem',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          gap: '10px',
                          backgroundColor: 'var(--bg-surface)',
                        }}
                      >
                        <input
                          type="text"
                          value={liveInputText}
                          onChange={(e) => setLiveInputText(e.target.value)}
                          placeholder="Reply to visitor in real time..."
                          style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            outline: 'none',
                          }}
                        />
                        <button
                          type="submit"
                          disabled={!liveInputText.trim()}
                          style={{
                            padding: '0.75rem 1.4rem',
                            borderRadius: '10px',
                            background: 'var(--accent-gradient)',
                            color: 'var(--accent-contrast)',
                            border: 'none',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Send size={16} />
                          <span>Send</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Select a conversation on the left to start live chatting.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WEBSITE MANAGEMENT & PORTFOLIO CRUD */}
          {activeTab === 'website' && (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                    Website Content & Portfolio CMS
                  </h2>
                  <p style={{ color: '#94A3B8', fontSize: '0.94rem' }}>
                    Manage our live portfolio projects, agency services, and public case studies directly without manual code editing.
                  </p>
                </div>

                <button
                  onClick={openNewProjectModal}
                  style={{
                    padding: '0.75rem 1.4rem',
                    borderRadius: '10px',
                    background: 'var(--accent-gradient)',
                    color: 'var(--accent-contrast)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Plus size={18} />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* SECTION A: PORTFOLIO MANAGEMENT (CRUD) */}
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FolderGit2 size={20} style={{ color: 'var(--accent-primary)' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Our Work / Portfolio Projects ({portfolioProjects.length})
                    </h3>
                  </div>

                  {/* Filter tabs */}
                  <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-card)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    {(['All', 'Published', 'Draft'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setPortfolioFilter(filter)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          backgroundColor: portfolioFilter === filter ? 'var(--accent-subtle)' : 'transparent',
                          color: portfolioFilter === filter ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        }}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Projects Table / Card List */}
                <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                  {isLoadingPortfolio ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading portfolio projects...</div>
                  ) : portfolioProjects.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No projects currently found. Click "Add New Project" to publish one.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {portfolioProjects
                        .filter((p) => portfolioFilter === 'All' || p.status === portfolioFilter)
                        .map((project) => (
                          <div
                            key={project.id}
                            style={{
                              padding: '1.4rem',
                              borderBottom: '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '1.5rem',
                              flexWrap: 'wrap',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', minWidth: '280px', flex: 1 }}>
                              <img
                                src={project.thumbnail_url}
                                alt={project.title}
                                style={{
                                  width: '90px',
                                  height: '65px',
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  border: '1px solid var(--border-subtle)',
                                }}
                              />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                  <span
                                    style={{
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.7rem',
                                      fontWeight: 800,
                                      backgroundColor: project.status === 'Published' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                      color: project.status === 'Published' ? '#10B981' : '#F59E0B',
                                    }}
                                  >
                                    {project.status}
                                  </span>
                                  {project.is_featured && (
                                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 800 }}>★ Featured</span>
                                  )}
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{project.category}</span>
                                </div>
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                  {project.title}
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '550px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {project.short_description}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {project.live_url && (
                                <a
                                  href={project.live_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    backgroundColor: 'var(--bg-surface)',
                                    border: '1px solid var(--border-subtle)',
                                    color: '#38BDF8',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                  title="Inspect project"
                                >
                                  <span>View</span>
                                  <ExternalLink size={12} />
                                </a>
                              )}

                              <button
                                onClick={() => openEditProjectModal(project)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  backgroundColor: 'var(--accent-subtle)',
                                  border: '1px solid var(--border-highlight)',
                                  color: 'var(--accent-primary)',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Edit size={13} />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleDeleteProject(project)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#EF4444',
                                  cursor: 'pointer',
                                }}
                                title="Delete project"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION B: SERVICES & BRANDING CONFIG */}
              <div style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-highlight)', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Official Brand Tagline
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  BUILD • CREATE • INNOVATE
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Active across Hero, Footer, About, and Branding sections.
                </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  Configured Services (8 Official Services)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {[
                    'Website Development',
                    'App Development',
                    'AI Solutions & Automation',
                    'Video Editing & Motion Graphics',
                    'Graphic Design & Branding',
                    'Presentation Design',
                    'Digital Marketing & Content Support',
                    'Social Media Management (New)',
                  ].map((serviceName, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1.2rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{serviceName}</span>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: '0.72rem', fontWeight: 800 }}>
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Add/Edit Modal */}
              {isProjectModalOpen && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1.5rem',
                  }}
                  onClick={() => setIsProjectModalOpen(false)}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '780px',
                      maxHeight: '92vh',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '20px',
                      border: '1px solid var(--border-highlight)',
                      boxShadow: 'var(--shadow-glow)',
                      overflowY: 'auto',
                      padding: '2rem',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {editingProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
                      </h3>
                      <button
                        onClick={() => setIsProjectModalOpen(false)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        <X size={22} />
                      </button>
                    </div>

                    {projectModalError && (
                      <div style={{ padding: '0.8rem', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                        {projectModalError}
                      </div>
                    )}

                    <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            Project Title *
                          </label>
                          <input
                            type="text"
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            required
                            placeholder="e.g. AapdaSetu Early Warning Platform"
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '10px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem',
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            Category *
                          </label>
                          <select
                            value={projectForm.category}
                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '10px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem',
                              outline: 'none',
                            }}
                          >
                            <option value="Website Development">Website Development</option>
                            <option value="App Development">App Development</option>
                            <option value="AI Solutions & Automation">AI Solutions & Automation</option>
                            <option value="Video Editing & Motion Graphics">Video Editing & Motion Graphics</option>
                            <option value="Graphic Design & Branding">Graphic Design & Branding</option>
                            <option value="Social Media Management">Social Media Management</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                          Short Description *
                        </label>
                        <input
                          type="text"
                          value={projectForm.short_description}
                          onChange={(e) => setProjectForm({ ...projectForm, short_description: e.target.value })}
                          required
                          placeholder="Concise 1-2 sentence overview shown on project card"
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '0.88rem',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                          Detailed Project Overview
                        </label>
                        <textarea
                          rows={3}
                          value={projectForm.full_description}
                          onChange={(e) => setProjectForm({ ...projectForm, full_description: e.target.value })}
                          placeholder="Comprehensive architectural overview, challenges solved, results achieved..."
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '0.88rem',
                            outline: 'none',
                            resize: 'vertical',
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            Thumbnail URL *
                          </label>
                          <input
                            type="text"
                            value={projectForm.thumbnail_url}
                            onChange={(e) => setProjectForm({ ...projectForm, thumbnail_url: e.target.value })}
                            required
                            placeholder="https://..."
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '10px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem',
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            Technologies (Comma-separated)
                          </label>
                          <input
                            type="text"
                            value={projectForm.technologies}
                            onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                            placeholder="FastAPI, PostgreSQL, React, Python"
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '10px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem',
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            Live Project / Demo URL
                          </label>
                          <input
                            type="text"
                            value={projectForm.live_url}
                            onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                            placeholder="https://..."
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '10px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem',
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            LinkedIn / Case Study URL
                          </label>
                          <input
                            type="text"
                            value={projectForm.case_study_url}
                            onChange={(e) => setProjectForm({ ...projectForm, case_study_url: e.target.value })}
                            placeholder="https://lnkd.in/..."
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '10px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '0.88rem',
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            Visibility Status
                          </label>
                          <select
                            value={projectForm.status}
                            onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as 'Published' | 'Draft' })}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '0.85rem',
                              outline: 'none',
                            }}
                          >
                            <option value="Published">Published (Visible Publicly)</option>
                            <option value="Draft">Draft (Hidden from Public)</option>
                          </select>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '1.2rem' }}>
                          <input
                            type="checkbox"
                            checked={projectForm.is_featured}
                            onChange={(e) => setProjectForm({ ...projectForm, is_featured: e.target.checked })}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
                          />
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Feature this project prominently
                          </span>
                        </label>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                        <button
                          type="button"
                          onClick={() => setIsProjectModalOpen(false)}
                          style={{
                            padding: '0.75rem 1.4rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingProject}
                          style={{
                            padding: '0.75rem 1.8rem',
                            borderRadius: '10px',
                            background: 'var(--accent-gradient)',
                            color: 'var(--accent-contrast)',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                          }}
                        >
                          {isSavingProject ? 'Saving to Database...' : editingProject ? 'Update Project' : 'Publish Project'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SERVICES & FREE TOOLS MANAGEMENT */}
          {activeTab === 'services' && (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                    Services & Free Tools Management
                  </h2>
                  <p style={{ color: '#94A3B8', fontSize: '0.94rem' }}>
                    Manage APX Digital web services, integrated digital tools, visibility settings, and free/paid tiers.
                  </p>
                </div>
              </div>

              {isLoadingServices ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                  Loading tools and services directory...
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                  {servicesTools.map((tool) => (
                    <div
                      key={tool.id}
                      style={{
                        backgroundColor: '#111318',
                        borderRadius: '16px',
                        border: '1px solid #20242C',
                        padding: '1.8rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1.2rem',
                        position: 'relative',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                          <span
                            style={{
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              backgroundColor: tool.is_free ? 'rgba(16, 185, 129, 0.15)' : 'var(--accent-subtle)',
                              color: tool.is_free ? '#10B981' : 'var(--accent-primary)',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              letterSpacing: '0.04em',
                            }}
                          >
                            {tool.badge || (tool.is_free ? 'FREE TOOL' : 'PAID SERVICE')}
                          </span>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: tool.is_visible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: tool.is_visible ? '#10B981' : '#EF4444',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                            }}
                          >
                            {tool.is_visible ? '● Active & Visible' : '○ Disabled'}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                          {tool.title}
                        </h3>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                          {tool.description}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Live URL:</span>
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}
                          >
                            {tool.url}
                          </a>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                        <button
                          onClick={() => openEditToolModal(tool)}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                          }}
                        >
                          <Edit size={15} />
                          <span>Edit Details</span>
                        </button>
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--accent-subtle)',
                            border: '1px solid var(--border-highlight)',
                            color: 'var(--accent-primary)',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            textDecoration: 'none',
                          }}
                        >
                          <span>Open Tool</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Edit Tool Modal */}
              {isToolModalOpen && editingTool && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-highlight)',
                      borderRadius: '20px',
                      width: '100%',
                      maxWidth: '560px',
                      padding: '2rem',
                      boxShadow: 'var(--shadow-glow)',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Edit Tool / Service Settings
                      </h3>
                      <button
                        onClick={() => setIsToolModalOpen(false)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {toolModalError && (
                      <div
                        style={{
                          padding: '0.8rem 1rem',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          color: '#EF4444',
                          fontSize: '0.85rem',
                          marginBottom: '1rem',
                        }}
                      >
                        {toolModalError}
                      </div>
                    )}

                    <form onSubmit={handleSaveTool} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                          Tool / Service Title
                        </label>
                        <input
                          type="text"
                          value={toolForm.title}
                          onChange={(e) => setToolForm({ ...toolForm, title: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={toolForm.description}
                          onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '0.88rem',
                            outline: 'none',
                            resize: 'vertical',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                          Live Destination URL
                        </label>
                        <input
                          type="url"
                          value={toolForm.url}
                          onChange={(e) => setToolForm({ ...toolForm, url: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            Badge Label
                          </label>
                          <input
                            type="text"
                            value={toolForm.badge}
                            onChange={(e) => setToolForm({ ...toolForm, badge: e.target.value })}
                            placeholder="FREE TOOL"
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '10px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem',
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            Pricing Model
                          </label>
                          <select
                            value={toolForm.is_free ? '1' : '0'}
                            onChange={(e) => setToolForm({ ...toolForm, is_free: e.target.value === '1' })}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '10px',
                              backgroundColor: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--text-primary)',
                              fontSize: '0.9rem',
                              outline: 'none',
                            }}
                          >
                            <option value="1">Free Online Tool (100% Free)</option>
                            <option value="0">Paid Commercial Service</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '0.4rem' }}>
                          <input
                            type="checkbox"
                            checked={toolForm.is_visible}
                            onChange={(e) => setToolForm({ ...toolForm, is_visible: e.target.checked })}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
                          />
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Enable Visibility (Display publicly on APX Digital website)
                          </span>
                        </label>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                        <button
                          type="button"
                          onClick={() => setIsToolModalOpen(false)}
                          style={{
                            padding: '0.75rem 1.4rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingTool}
                          style={{
                            padding: '0.75rem 1.8rem',
                            borderRadius: '10px',
                            background: 'var(--accent-gradient)',
                            color: 'var(--accent-contrast)',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                          }}
                        >
                          {isSavingTool ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
