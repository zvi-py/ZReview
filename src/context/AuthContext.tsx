import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AppNotification, SystemSettings } from '../types';
import { api } from '../api';

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  currentRole: UserRole;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, role?: UserRole, password?: string) => Promise<User>;
  logout: () => void;
  switchUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  notifications: AppNotification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  systemSettings: SystemSettings;
  refreshSettings: () => Promise<void>;
  updateThreshold: (val: number) => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const defaultSettings: SystemSettings = {
  aiApprovalThreshold: 85,
  confidenceThreshold: 70,
  maxFileSizeMb: 30,
  videoFrameSamplingRateSec: 0,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  allowedVideoTypes: [],
  autoRouteEnabled: true,
  trendIntelligenceActive: true,
};

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Alex Rivera',
    email: 'alex.rivera@zarvis.ai',
    role: 'EMPLOYEE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Lead Full-Stack AI & Creative Engineering',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-lumina', 'brand-veloce', 'brand-jdc', 'brand-nmc'],
  },
  {
    id: 'usr-002',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@zarvis.ai',
    role: 'EMPLOYEE',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Senior Visual & Brand Systems',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-kinetix', 'brand-jdc', 'brand-nmc'],
  },
  {
    id: 'usr-003',
    name: 'Liam Chen',
    email: 'liam.chen@zarvis.ai',
    role: 'EMPLOYEE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Digital Collateral & Motion Graphics',
    assignedBrands: ['brand-lumina', 'brand-veloce', 'brand-solaris', 'brand-jdc', 'brand-jitd'],
  },
  {
    id: 'usr-101',
    name: 'Elena Rostova',
    email: 'elena.rostova@zarvis.ai',
    role: 'SUPERVISOR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'VP of Brand Quality & Creative Review',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-lumina', 'brand-veloce', 'brand-jdc', 'brand-nmc'],
    assignedCampaignIds: ['camp-apex-summit', 'camp-nova-debut', 'camp-jdc-banking', 'camp-nmc-ind'],
  },
  {
    id: 'usr-102',
    name: 'Marcus Vance',
    email: 'marcus.vance@zarvis.ai',
    role: 'SUPERVISOR',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    department: 'Principal Brand Governance Lead',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-veloce', 'brand-kinetix', 'brand-jdc', 'brand-nmc'],
    assignedCampaignIds: ['camp-apex-summit', 'camp-veloce-wealth', 'camp-jdc-banking'],
  },
  {
    id: 'usr-103',
    name: 'Maya Lin',
    email: 'maya.lin@zarvis.ai',
    role: 'SUPERVISOR',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Global Creative Operations Director',
    assignedBrands: ['brand-lumina', 'brand-nova', 'brand-solaris', 'brand-jitd', 'brand-jgi'],
    assignedCampaignIds: ['camp-lumina-clinical', 'camp-nova-debut', 'camp-jitd-admissions'],
  },
  {
    id: 'usr-admin',
    name: 'David Sterling',
    email: 'david.sterling@zarvis.ai',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Chief Creative Officer & Head of Governance',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-lumina', 'brand-veloce', 'brand-kinetix', 'brand-solaris', 'brand-hyperion', 'brand-aura', 'brand-jdc', 'brand-nmc', 'brand-jitd', 'brand-jgi'],
  },
  {
    id: 'usr-nminds-admin',
    name: 'David Sterling',
    email: 'david.sterling@zarvis.ai',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Chief Creative Officer & Head of Governance',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-lumina', 'brand-veloce', 'brand-jdc', 'brand-nmc'],
  },
  {
    id: 'usr-900',
    name: 'System Admin',
    email: 'admin@zarvis.ai',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    department: 'Enterprise Cloud & AI Ops',
    assignedBrands: ['brand-apex', 'brand-nova', 'brand-lumina', 'brand-veloce', 'brand-jdc', 'brand-nmc'],
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Role is IMMUTABLY derived from the authenticated user
  const currentRole: UserRole = currentUser?.role || 'EMPLOYEE';

  useEffect(() => {
    async function init() {
      try {
        const [users, settings] = await Promise.all([
          api.getUsers().catch(() => DEFAULT_USERS),
          api.getSettings().catch(() => defaultSettings),
        ]);
        const validUsers = Array.isArray(users) && users.length > 0 ? users : DEFAULT_USERS;
        setAllUsers(validUsers);
        if (settings) {
          setSystemSettings(settings);
        }

        // Check if there is an active session token
        const token = localStorage.getItem('z_token') || localStorage.getItem('zarvis_token');
        const isExplicitlyLoggedOut =
          localStorage.getItem('z_logged_out') === 'true' ||
          localStorage.getItem('zarvis_logged_out') === 'true';

        let targetUser: User | null = null;
        if (!isExplicitlyLoggedOut && token) {
          try {
            const meRes = await api.getMe();
            if (meRes.user) {
              targetUser = meRes.user;
            }
          } catch {
            // Token may be invalid/expired, clear it
            localStorage.removeItem('z_token');
            localStorage.removeItem('zarvis_token');
          }
        }

        // Fallback to stored user ID if no token or offline
        if (!targetUser && !isExplicitlyLoggedOut) {
          const storedUserId = localStorage.getItem('z_user_id') || localStorage.getItem('zarvis_user_id');
          if (storedUserId) {
            targetUser = validUsers.find((u) => u.id === storedUserId) || null;
          }
        }

        if (targetUser) {
          setCurrentUser(targetUser);
          setActiveTab('dashboard');
          try {
            const notifs = await api.getNotifications(targetUser.id);
            if (Array.isArray(notifs)) {
              setNotifications(notifs);
            }
          } catch {
            // non-fatal notification fetch
          }
        } else {
          // No active session: keep currentUser null so user sees Login Screen
          setCurrentUser(null);
        }
      } catch (err) {
        console.warn('Network initial fetch fell back to default state:', err);
        setAllUsers(DEFAULT_USERS);
        setSystemSettings(defaultSettings);
        setCurrentUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }
    init();
  }, []);

  const login = async (email: string, role?: UserRole, password?: string): Promise<User> => {
    try {
      const res = await api.login(email, role, password);
      const user = res.user;
      setCurrentUser(user);
      localStorage.setItem('z_user_id', user.id);
      localStorage.removeItem('zarvis_user_id');
      localStorage.removeItem('z_logged_out');
      localStorage.removeItem('zarvis_logged_out');

      // Update users list if new
      setAllUsers((prev) => (prev.some((u) => u.id === user.id) ? prev : [user, ...prev]));
      setActiveTab('dashboard');

      api.getNotifications(user.id).then(setNotifications).catch(console.error);
      return user;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = () => {
    api.logout().catch(() => {});
    setCurrentUser(null);
    localStorage.removeItem('z_user_id');
    localStorage.removeItem('zarvis_user_id');
    localStorage.removeItem('z_token');
    localStorage.removeItem('zarvis_token');
    localStorage.setItem('z_logged_out', 'true');
    localStorage.setItem('zarvis_logged_out', 'true');
    setNotifications([]);
    setActiveTab('dashboard');
  };

  const refreshNotifications = async () => {
    if (!currentUser) return;
    try {
      const notifs = await api.getNotifications(currentUser.id);
      setNotifications(notifs);
    } catch (err) {
      console.error(err);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const refreshSettings = async () => {
    try {
      const s = await api.getSettings();
      setSystemSettings(s);
    } catch (err) {
      console.error(err);
    }
  };

  const updateThreshold = async (val: number) => {
    try {
      const updated = await api.updateSettings({
        aiApprovalThreshold: val,
        userId: currentUser?.id,
        userName: currentUser?.name,
      });
      setSystemSettings(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // STRICT RBAC POLICY: Runtime user and role toggles without re-authentication are disabled
  const switchUser = (user: User) => {
    console.warn('Switching users without re-authenticating is forbidden. Please log out first.');
  };

  const switchRole = (role: UserRole) => {
    console.warn('Switching roles without logging out is forbidden by RBAC policy. Please log out first.');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        currentRole,
        isAuthenticated: !!currentUser,
        isAuthLoading,
        login,
        logout,
        switchUser,
        switchRole,
        notifications,
        unreadCount,
        refreshNotifications,
        markNotificationRead,
        systemSettings,
        refreshSettings,
        updateThreshold,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
