import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import {
  Bell,
  LogOut,
  Plus,
  Menu,
  Code2,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onOpenNewSubmission: () => void;
  onSelectSubmission?: (id: string) => void;
  onToggleMenu?: () => void;
  onOpenResumeShowcase?: () => void;
  onOpenDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewSubmission,
  onSelectSubmission,
  onToggleMenu,
  onOpenResumeShowcase,
  onOpenDemo,
}) => {
  const {
    currentRole,
    currentUser,
    allUsers,
    switchUser,
    logout,
    notifications,
    unreadCount,
    markNotificationRead,
    activeTab,
    setActiveTab,
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Role-specific navigation tabs simplified to core 85% Gate workflow
  const getNavTabs = () => {
    if (currentRole === 'ADMIN') {
      return [
        { id: 'showcase', label: 'Showcase' },
        { id: 'submissions', label: 'Compliance Workspace (85% Gate)', isDefault: true },
        { id: 'brands', label: 'Brand Guidelines & Rules' },
      ];
    }
    if (currentRole === 'SUPERVISOR') {
      return [
        { id: 'showcase', label: 'Showcase' },
        { id: 'queue', label: 'Human Approval Queue (≥85%)', isDefault: true },
        { id: 'brands', label: 'Brand Guidelines & Rules' },
      ];
    }
    return [
      { id: 'showcase', label: 'Showcase' },
      { id: 'creatives', label: 'My Posters (85% Gate)', isDefault: true },
      { id: 'brands', label: 'Brand Guidelines & Rules' },
    ];
  };

  const navTabs = getNavTabs();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#E8E3D5] bg-[#FAF7EE]/90 backdrop-blur-xl px-4 sm:px-8 shadow-xs transition-colors">
      {/* Brand Identity & Main Tabs */}
      <div className="flex items-center gap-8">
        <button
          type="button"
          onClick={() => setActiveTab('showcase')}
          className="flex items-center gap-2.5 cursor-pointer group text-left shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 backdrop-blur-md shadow-xs ring-1 ring-[#FFD0E0]/80 p-0.5">
            <BrandLogo size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-[#182817] text-base font-syne leading-none">
                ZReview
              </span>
              <span className="text-[10px] font-space text-[#677A65] font-semibold tracking-wider uppercase border-l border-[#D8D2C3] pl-2">
                Vision Compliance
              </span>
            </div>
          </div>
        </button>

        {/* Clean Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
          {navTabs.map((tab) => {
            const isShowcaseActive =
              (activeTab === 'showcase' || activeTab === 'dashboard' || !activeTab) &&
              tab.id === 'showcase';
            const isActive = isShowcaseActive || (activeTab === tab.id && activeTab !== 'dashboard');
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#2E5629] font-bold shadow-xs border border-[#BED8B9]'
                    : 'text-[#526850] hover:text-[#182817] hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Video Demo + Architecture Specs + Action Button + Notifications + Role Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Watch Demo Video Button - Strawberry Chic Pill */}
        {onOpenDemo && (
          <button
            type="button"
            onClick={onOpenDemo}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFF0F5] hover:bg-[#FFE4ED] border border-[#FFD0E0] px-3 py-1.5 text-xs font-bold text-[#D82666] transition-colors cursor-pointer shadow-2xs"
            title="Watch ZReview Interactive Video Tour"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#FF5E97] animate-ping" />
            <span>Watch Demo</span>
          </button>
        )}

        {/* Architecture Specs (Senior Engineer Portfolio Deep-Dive) */}
        {onOpenResumeShowcase && (
          <button
            type="button"
            onClick={onOpenResumeShowcase}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E3D5] hover:border-[#D5CFBF] bg-white/70 hover:bg-white px-3 py-1.5 text-xs font-semibold text-[#3D4F3B] hover:text-[#182817] transition-colors cursor-pointer shadow-2xs backdrop-blur-md"
            title="System Architecture & Technical Specifications"
          >
            <Code2 className="h-3.5 w-3.5 text-[#5A6D58]" />
            <span className="hidden sm:inline">Architecture</span>
          </button>
        )}

        {/* Action Button: Upload Creative - Employee Only (Matcha Accent) */}
        {currentRole === 'EMPLOYEE' && (
          <button
            type="button"
            onClick={onOpenNewSubmission}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#3A6B34] to-[#2E5629] hover:from-[#2E5629] hover:to-[#22421E] text-white px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-[#2E5629]/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Upload Creative</span>
          </button>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/80 text-[#526850] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FF5E97]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  Notifications ({unreadCount})
                </span>
                <span className="text-[10px] font-mono text-slate-400">Activity</span>
              </div>
              <div className="max-h-60 overflow-y-auto py-2 space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No new notifications</p>
                ) : (
                  notifications.slice(0, 5).map((n, nIdx) => (
                    <div
                      key={`${n.id}-${nIdx}`}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.submissionId && onSelectSubmission) {
                          onSelectSubmission(n.submissionId);
                          setShowNotifications(false);
                        }
                      }}
                      className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-left"
                    >
                      <p className="text-xs font-bold text-slate-800">{n.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Direct Role Switcher (No photo fixture, clean name & role) */}
        {currentUser && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
            >
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 leading-tight">
                  {currentUser.role === 'EMPLOYEE'
                    ? 'Staff Engineer'
                    : currentUser.role === 'SUPERVISOR'
                    ? 'Review Lead'
                    : 'Director'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>

            {/* User Dropdown with Quick Role Switcher */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                </div>

                <div className="py-2">
                  <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Quick Switch Role
                  </p>
                  {[
                    { email: 'alex.rivera@zarvis.ai', roleLabel: 'Staff Engineer (Creator)' },
                    { email: 'elena.rostova@zarvis.ai', roleLabel: 'Review Lead (Supervisor)' },
                    { email: 'david.sterling@zarvis.ai', roleLabel: 'Executive Director (Admin)' },
                  ].map((item) => {
                    const u = allUsers.find((x) => x.email === item.email);
                    if (!u) return null;
                    const isSelected = currentUser.id === u.id;
                    return (
                      <button
                        key={item.email}
                        type="button"
                        onClick={() => {
                          switchUser(u);
                          setShowUserMenu(false);
                          if (u.role === 'ADMIN') setActiveTab('submissions');
                          else if (u.role === 'SUPERVISOR') setActiveTab('queue');
                          else setActiveTab('creatives');
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-slate-100 text-slate-900 font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {u.role}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer font-semibold transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu Toggle Drawer Button */}
        {onToggleMenu && (
          <button
            type="button"
            onClick={onToggleMenu}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200"
            title="Open Full Navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
};
